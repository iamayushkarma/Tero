import tokenManager from "../utils/tokenManager.js";

export const validateToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  const tokenFromBearer = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const token =
    tokenFromBearer ||
    req.headers["x-resume-token"] ||
    req.headers["token"] ||
    req.cookies?.token ||
    req.body?.token ||
    req.query?.token;

  if (!token) {
    return res.status(401).json({ message: "Token missing" });
  }

  if (!tokenManager.validateToken(token)) {
    return res.status(403).json({
      success: false,
      error: "Invalid or expired token. Please refresh and try again.",
    });
  }

  next();
};
