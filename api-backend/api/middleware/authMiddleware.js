import jwt from "jsonwebtoken";

export const authenticateToken = (req, res, next) => {
    const authorization = req.headers.authorization;
    if (authorization && authorization.startsWith("Bearer ")) {
    const token = authorization.split(" ")[1];
    try {
        req.user = jwt.verify(token, process.env.SECRET_KEY);
        next();
    } catch (error) {
        res.status(401).send("Token tidak valid.");
    }
    } else {
    console.error(authorization)
    res.status(401).send("Anda belum login (tidak ada otorisasi).");
    }
}