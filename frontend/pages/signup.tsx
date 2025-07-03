import { useState} from 'react';
import { useRouter } from 'next/router';

export default function SignupPage(){
    const router = useRouter();
    const [form, setForm] = useState({
        email:'',
        password:'',
        occupation:'',
        gender:'male',
        dateOfBirth:'',
    });

    const [error, setError] = useState('');

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value});
    };

    const handleSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
    }

    try{
        const res = await fetch('http://localhost:8000/api/auth/signup', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(form),
        });

        const data = await res.json();
        if(res.ok){
            localStorage.setItem('token', data.token);
            router.push('/mypage');
        } else {
            setError(data.error || 'failed to signup')
        }
    } catch(err){
        console.error(err);
        setError('connection error')
    };

    return (
        <div style= {{ maxWidth:400, margin:'auto'}}>
            <h2>New signup</h2>
            <form onSubmit={handleSignup}>
                <input 
                type='email'
                name='email'
                placeholder='email address'
                value={form.email}
                onChange={handleChange}
                required
                /><br />

                <input 
                type='password'
                name='password'
                placeholder='password'
                value={form.password}
                onChange={handleChange}
                required
                /><br/>

                <input
                type='text'
                name='occupation'
                placeholder='occupation'
                value={form.occupation}
                onChange={handleChange}
                /><br/>
            </form>
        </div>
    )
}