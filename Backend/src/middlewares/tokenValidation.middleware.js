import tokenManager from "../utils/tokenManager.js";

export const validateToken = (req, res, next) => {
  const token = req.body.token || req.headers["x-resume-token"];

  if (!token) {
    return res.status(403).json({
      success: false,
      error: "Token is required",
    });
  }

  if (!tokenManager.validateToken(token)) {
    return res.status(403).json({
      success: false,
      error: "Invalid or expired token. Please refresh and try again.",
    });
  }

  next();
};
