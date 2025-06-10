// middleware/optionalAuthMiddleware.js
import jwt from "jsonwebtoken";

export const optionalAuthMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.split(" ")[1];
    try {
      const user = jwt.verify(token, process.env.SECRET_KEY);
      req.user = user;
    } catch (err) {
      console.warn("Token invalid, lanjut sebagai tamu");
    }
  }

  next(); // lanjut meski tanpa token
};