import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';

export default function MyPage(){
    const router = useRouter();
    const [user, setUser] = useState<any>(null);

    useEffect(() => {
        const token = localStorage.getItem('token');
        if(!token){
            router.push('login');
            return;
        }

        fetch('http://localhost:8000/api/authy/me', {
            headers: { Authorization: 'Bearer ${token}'},
        }).then(res => res.json()).then(data=> setUser(data)).catch(()=> router.push('/login'));    
    }, [router]);

    if(!user) return <p>Loading...</p>

    return(
        <div style={{ maxWidth:400, margin:'auto'}}>
            <h2>My Page</h2>
            <p>Mail: {user.email}</p>
            <p>Occupation: {user.occupation}</p>
            <p>Gender: {user.gender}</p>
            <p>Birthday: {user.dateOfBirth}</p>
        </div>
    );
}