import { useEffect, useState} from 'react';
import { useRouter} from 'next/router';

type Diagnosis = {
    id: number;
    result_summary: string;
    diagnosis_level: string;
    created_at: string;
};

export default function HistoryPage(){
    const router = useRouter();
    const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchHistory = async() => {
            const token = localStorage.getItem('token');
            if(!token){
                router.push('/login');
                return;
            }

            try{
                const res = await fetch('http://localhost:8000/api/diagnoses', {
                    headers: {
                        Authorization: `Bear ${token}`,
                    },
                });

                if(!res.ok){
                    throw new Error('Failed to get diagnoses history');
                }

                const data = await res.json();
                setDiagnoses(data);
            } catch(err: any){
                setError(err.message);
            }finally{
                setLoading(false);
            }
        };

        fetchHistory();
    }, [router]);

    if(loading) return <p>Loading...</p>;
    if(error) return <p style={{ color: 'red'}}>Error: {error}</p>;

    return (
        <div style={{ maxWidth:800, margin:'auto', padding:'20px'}}>
            <h2>🗒️Diagnoses History</h2>
            {diagnoses.length === 0 ? (
                <p>There is no history</p>
            ): (
                <ul style={{ listStyle: 'none', padding:0 }}>
                    {diagnoses.map((item) => (
                        <li
                         key = {item.id}
                         style={{
                            border: '1px solid #ccc',
                            borderRadius: '8px',
                            padding: '10px',
                            marginBottom: '10px',
                         }}
                        >
                            <p><strong>Created Day:</strong>{new Date(item.created_at).toLocaleString()}</p>
                            <p><strong>Summary of Symptom:</strong></p>
                            <pre style={{ whiteSpace: 'pre-wrap', wordWrap: 'break-word'}}>
                                {item.result_summary}
                            </pre>
                            <p><strong>Level:</strong>{item.diagnosis_level}</p>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    )

} 