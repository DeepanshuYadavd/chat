import jwt from "jsonwebtoken";
export const protect = async (req, res, next) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res.status(401).json({
        message: "UnAuthorized",
      });
    }
    const decoded = await jwt.verify(token, process.env.jwt_SECRET);
    if (!decoded) {
      return res.status(404).json({
        message: "user not found",
      });
    }
    req.user = decoded;
    next();
  } catch (err) {
    return res.status(500).json({
      message: err.message,
    });
  }
};
