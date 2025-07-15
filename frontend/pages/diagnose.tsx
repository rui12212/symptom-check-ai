import { useState } from 'react';
import axios from 'axios';

export default function DiagnosePage(){
    const [conversation, setConversation ] = useState<string[]>([]);
    const [input, setInput] = useState('');
    const [result, setResult] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async () =>{
        // !これは、booleanだけじゃなくて、空文字弾くとかでも使える
        if(!input.trim()) return;

        const updateHistory = [...conversation, input];
        setConversation(updateHistory);
        setInput('');
        setLoading(true);

        try {
            const res = await axios.post('http://localhost:8000/api/diagnose',{
                conversationHistory: updateHistory,
            });
            
            setResult(res.data.summary);
        } catch(err){
            alert('認証に失敗しました');
            console.error(err);
        } finally {
            setLoading(false);
        }
    }

    return(
        <div style={{ maxWidth:600, margin: 'auto'}}>
            <h2>🏥症状セルフチェック</h2>
            <div>
                <input
                type='text'
                placeholder='start conversation'
                value={input}
                onChange= {(e)=> setInput(e.target.value)}
                style={{ width: '80%'}}
                />
                <button onClick={handleSubmit}> Send</button>
            </div>

            <div style ={{ marginTop:20}}>
                <h3>👂Conversation History</h3>
                <ul>
                    {conversation.map((c,i)=> 
                    <li key={i}>{c}</li>
                    )}
                </ul>
            </div>

            {loading && <p> Composing summary...</p>}

            {result && (
        <div style={{ marginTop: 20 }}>
          <h3>📝 診断結果</h3>
          <pre>{result}</pre>
        </div>
      )}
        </div>
    )

}