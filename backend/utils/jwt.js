const jwt = require('jsonwebtoken');

function authenticateToken(req, res, next) {
    // headerからBearer abc123を丸ごと取り出す
    const authHeader = req.headers['authorization'];
    // Bearer abc123 → abc123 を取り出す。
    const token = authHeader && authHeader.split(' ')[1];

    if(!token){
        return res.status(401).json({ error: 'Token required'});
    }

    // jwt.verify() 関数でトークンの検証を行う。失敗した場合は err が返る。
    // process.env.JWT_SECRET はトークンを作るときに使った秘密鍵。
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded)=> {
        if(err) return res.status(403).json({error: 'Invalid token'});

        // トークンが正しい場合、デコードされた中身（userIdなど）を req.user に保存。
        req.user = decoded;
        
        // 後続の処理でログイン中のユーザー情報を使えるようになる。
        next();
    });
}
// 正しい：関数自体をエクスポート（呼び出しは Express 側が行う）
// authenticateToken();だと関数を即時実行し、next()で次の関数にreq/resをおくることができない
module.exports = authenticateToken;