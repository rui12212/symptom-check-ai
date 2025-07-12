import { useState, useEffect, useRef } from 'react';
import  axios from 'axios';


export default function voiceDiagnose(){
    const [conversation, setConversation] = useState<string[]>([]);
    const [result, setResult] = useState('')
    const [listening, setListening] = useState(false);
    const recognitionRef = useRef<any>(null);

    useEffect(() => {
        const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
        const recognition = new SpeechRecognition();
        recognition.lang = 'ja-JP';
        recognition.interimResults = false;
        recognition.continuous = false;
        recognition.continuous = recognition;

        recognition.result = async (event:any) => {
            const speechText = event.results[0][0].transcript;
            const updated = [...conversation, speechText];
            setConversation(updated);
            speakText('Thank you, i am making a summary');

            try {
                const res = await axios.post('http://localhost:8000/api/diagnose', {
                    conversationHistory: updated,
                });

                setResult(res.data.summary);
                speakText(res.data.summary);
            }catch(err){
                console.error(err);
                speakText('Error occurred during making the summary');
            }
        };

        recognition.onend = () => setListening(false);
    }, [conversation]);

    const startListening = () => {
        setListening(true);
        recognitionRef.current?.start();
    };

    const speakText = (text: string) => {
        const synth = window.speechSynthesis;
        const utter = new SpeechSynthesisUtterance(text);
        utter.lang = 'ja-JP';
        synth.speak(utter);
    };

    return (
        <div style={{ maxWidth:600, margin:'auto'}}>
            <h2>🎙️Talking with Mic</h2>
            <button onClick={startListening} disabled={listening}>
                {listening ? 'Listening now': 'Speak now'}
            </button>

            <div style={{ marginTop:20}}>
                <h3>🗣️ The contents you spoke</h3>
                <ul>
                    {conversation.map((line, i) => (
                        <li key={i}>{line}</li>
                    ))}
                </ul>
            </div>

            {result && (
        <div style={{ marginTop: 20 }}>
          <h3>📋 診断結果（要約）</h3>
          <pre>{result}</pre>
        </div>
      )}
        </div>
    )
}