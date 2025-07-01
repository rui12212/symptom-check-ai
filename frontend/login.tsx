import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage(){
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        try {
            const res = await fetch('http://locahost:8000/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email,password}),
            });

            const data = await res.json();
            if(res.ok){
                localStorage.setItem('token', data.token);
                router.push('/mypage');
            }else {
                setError(data.error || 'ログイン失敗');
            }
        } catch (err) {
            console.error(err);
            setError('通信エラー');
        }
    };

    return (
        <div style= {{ maxWidth: 400, margin: 'auto'}}>
            <h2>Login</h2>
            <form onSubmit={handleLogin}>
                <input
                type='email'
                placeholder='メールアドレス'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <br />
                <input
                type='password'
                placeholder='パスワード'
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                />
                <br />
                <button type='submit'>ログイン</button>
            </form>
            {error && <p style={{ color: 'red'}}>{error}</p>}
        </div>
    )




    // useEffect(() => {
    //     const token = localStrage.getItem('token');
    //     if(!token){
    //         router.push('/login');
    //         return;
    //     }

    //     fetch('http://localhost:8000/api/auth/me', {
    //         headers: { Authorization: 'Bearer ${token}'},
    //     }).then(res => res.json()).then(data=>setUser(data))
    // })

}

