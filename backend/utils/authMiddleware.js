const jwt = require('jsonwebtoken');

function authMiddleware(req,res,next) {
    const authHeader = req.headers.authorization;
    if(!authHeader){
        return res.status(401).json({ error: 'There is no token'});
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        // この関数を呼び出した先で、req.userを呼び出すことができる
        req.user = {id : decoded.userId};
        next();
    }catch(err){
        return res.status(403).json({ error: 'Invalid token'});
    }
}

module.exports = authMiddleware;