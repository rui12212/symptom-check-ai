import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

type Diagnosis = {
   id: number;
   result_summary: string;
   diagnosis_level: string;
   created_at: string;
};

export default function DiagnosisDetailPage() {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState<Diagnosis | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        if(id!) return;
        const fetchDetail = async () => {
            const token = localStorage.getItem('token');
            if(!token) {
                router.push('/login');
                return;
            }
            try{
                const res = await fetch(`http://localhost:8000/api/diagnoses/${id}`, {
                    headers: {Authorization: `Bearer ${token}`},
                });
                if(!res.ok) throw new Error('Failed to get your diagnosis detail');
                
                const json = await res.json();
                setData(json);
            } catch(err: any){
                setError(err.message);
            }finally {
                setLoading(false);
            }
        };
        fetchDetail();
    }, [id, router]);

    if(loading) return <p>Still loading...</p>;
    if(error) return <p style = {{ color: 'red'}}> {error}</p>;
    if(!data) return <p>No data</p>;

    return (
        <div style = {{ maxWidth:800, margin: 'auto', padding: '20px'}}>
            <button onClick={()=>router.back()} style={{marginBottom:'20px'}}>Back</button>
            <h2>📖 Daignosis Detail</h2>
            <p><strong>ID:</strong>{data.id}</p>
            <p><strong>Created At:</strong>{new Date(data.created_at).toLocaleString()}</p>
            <p><strong>Diagnosis Level:</strong>{data.diagnosis_level}</p>
            <h3>✏️ Diagnosis Summary</h3>
            <pre style={{ whiteSpace:'pre-wrap', wordWrap: 'break-word'}}>{data.result_summary}</pre>
        </div>
    )
}