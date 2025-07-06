const express = require('express');
const router = express.Router();
const openai = require('..utils/openaiClient');

router.post('/', async (req,res) => {
    try {
        // フロントエンドからのrequest（JSON形式）のconversationHiostory keyを読み取り
        const { conversationHistory } = req.body;

        if(!conversationHistory || !Array.isArray(conversationHistory)) {
            return res.status(400).json({ error: 'Invalid input format'});
        }

        const systemPrompt = `
あなたは医療アシスタントAIです。ユーザーからの症状情報をもとに、
診断名を出さずに症状の特徴を要約し、受診の目安と医師に伝えるべきことを整理してください。

以下のフォーマットで出力してください：

【症状の整理】
- 主訴：
- 発症時期：
- 強さ・頻度：
- 関連症状：
- 既往歴・服薬：
- 年齢・性別：

【推奨行動】
- 受診の必要性
- 医師に伝えるべきポイント
    `;

    const messages = [
        {role: 'system', content: systemPrompt },
        ...conversationHistory.map((entry) =>({
            role: 'user',
            content: entry,
        })),
    ];

    const completion = await openai.createChatCompletion({
        model: 'gpt-4',
        message: massages,
        temperature:0.6,
    });

    const result = completion.data.choices[0].message.content;
    res.status(200).jsonp({ summary: result });
    
} catch (error) {
    console.error('GPT API Error', error.response?.data || error.message);
    res.status(500).json({ error: 'API Error'});
}
});

module.exports = router;