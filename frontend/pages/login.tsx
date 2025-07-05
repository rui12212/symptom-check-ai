import { useState } from 'react';
import { useRouter } from 'next/router';

export default function LoginPage(){
    const router = useRouter();
    // 変数と変効用関数
    // 変数定義、変更用関数定義、初期値の設定
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    // ログインページで使用するログイン処置の関数を記載
    const handleLogin = async (e: React.FormEvent) => {
        // ページ再読み込み防止
        e.preventDefault();
        // 前回のエラーを初期化
        setError('');

        try {
            // fetch=APIにリクエストを送る
            const res = await fetch('http://localhost:8000/api/auth/login', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ email,password}),
            });

            const data = await res.json();
            // HTTPレスポンスが200番台ならOK
            if(res.ok){
                // ブラウザにTokenを保存
                localStorage.setItem('token', data.token);
                // myPageに移動
                router.push('/mypage');
            }else {
                // 200番台以外なら、setErrorにerrordataを代入
                setError(data.error || 'ログイン失敗');
            }
        } catch (err) {
            console.error(err);
            setError('通信エラー');
        }
    };

    // ログインページのUIと機能を作成
    return (
        <div style= {{ maxWidth: 400, margin: 'auto'}}>
            <h2>Login</h2>
            {/* 送信時に関数を呼び出し */}
            <form onSubmit={handleLogin}>
                {/* email用入力フォーム欄 */}
                <input
                type='email'
                placeholder='メールアドレス'
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                />
                <br />
                {/* パスワード用入力フォーム欄 */}
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
}

