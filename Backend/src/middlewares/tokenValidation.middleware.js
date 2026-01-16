import tokenManager from "../utils/tokenManager.js";

export const validateToken = (req, res, next) => {
  // const token = req.body.token || req.headers["x-resume-token"];

  // if (!token) {
  //   return res.status(403).json({
  //     success: false,
  //     error: "Token is required",
  //   });
  // }
  const authHeader = req.headers.authorization;
  const tokenFromHeader = authHeader?.startsWith("Bearer ") ? authHeader.slice(7) : null;

  const token = tokenFromHeader || req.cookies?.token || req.body?.token || req.query?.token;

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
