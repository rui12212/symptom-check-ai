const express = require('express');
const router = express.Router();
const openai = require('../utils/openaiClient');
const db = require('../db/connection');
const authMiddleware = require('../utils/authMiddleware.js'); 
const authenticateToken = require('../utils/jwt')

router.post('/', authMiddleware, async (req,res) => {
    try {
        // フロントエンドからのrequest（JSON形式）のconversationHistory keyを読み取り
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

    const completion = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [{ role: "user", content: "こんにちは" }],
      });

      const userId = req.user.id;
      const result = completion.choices[0].message.content;
    

    const [rows] = await db.execute( 
        'INSERT INTO diagnoses (user_id, result_summary, diagnosis_level) VALUES (?,?,?)',
        [userId, result,'未分類']
    );

    res.status(200).jsonp({ summary: result });
    
} catch (error) {
    console.error('GPT API Error', error.response?.data || error.message);
    res.status(500).json({ error: 'API Error'});
}
});

router.get('/', authMiddleware, async(req,res) => {
    try{
        const userId = req.user.id;
        // console.log(userId);
        // console.log(req);
        // console.log(req.user);
        
        const [rows] = await db.execute(
            `SELECT id, result_summary, diagnosis_level, created_at FROM diagnoses WHERE user_id = ? ORDER BY created_at DESC`,
        [userId]
        );
        res.status(200).json(rows);
    } catch(err){
        console.error('履歴取得エラー：', err);
        res.status(500).json({ error: 'Failed to get diagnosis summary'});
    }
});

router.get('/:id', authMiddleware, async(req, res) => {
    try{
        const userId = req.user.id;
        const diagnosisId = req.params.id;

        const [rows] = await db.execute(
            `SELECT id, result_summary, diagnosis_level, created_at
            FROM diagnoses
            WHERE id = ? AND user_id = ?`
            ,[diagnosisId, userId]
        );

        if(rows.length === 0) {
            return res.status(404).json({ error: 'No result for this diagnosis '});
        }

        res.status(200).json(rows[0]);
    } catch(err){
        console.error('Error of get detail:', err);
        return res.status(500).json({ error: 'Failed to get the diagnosis detail'});
    }
})

module.exports = router;