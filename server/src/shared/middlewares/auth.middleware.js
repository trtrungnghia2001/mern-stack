import ENV_CONFIG from "#server/configs/env.config";
import createHttpError from "http-errors";
import jwt from "jsonwebtoken";

// Middleware xác thực người dùng (authentication)
export const authMiddleware = async (req, res, next) => {
  try {
    const tokenHeader = req.headers.authorization; // Thường là "Bearer <token>"
    const tokenCookies = req.cookies.access_token; // Thường là "Bearer <token>"

    let accessToken = null;

    if (tokenCookies) {
      // Ưu tiên lấy từ cookie nếu có
      accessToken = req.cookies.access_token.split(" ")?.[1]; // Loại bỏ "Bearer "
    } else if (tokenHeader) {
      // Lấy từ Authorization header nếu không có trong cookie
      accessToken = tokenHeader.split(" ")?.[1]; // Loại bỏ "Bearer "
    }

    if (!accessToken) {
      throw createHttpError.Unauthorized(
        "Access Token not found. Please log in."
      );
    }

    // Xác minh token
    const decoded = await jwt.verify(accessToken, ENV_CONFIG.JWT_SECRET_KEY);

    // Gán payload của token vào req.user để các controller sau có thể sử dụng
    req.user = decoded;
    next(); // Chuyển sang middleware/controller tiếp theo
  } catch (error) {
    next(error); // Chuyển các lỗi khác
  }
};

// Middleware kiểm tra quyền admin (authorization)
export const adminMiddleware = (req, res, next) => {
  // Lấy thông tin user từ req.user (được gán từ auth.middleware.js)
  const user = req.user;

  // Giả sử thông tin user có trường 'role'
  if (user && user.role === "admin") {
    next(); // Cho phép truy cập
  } else {
    res.status(403).json({ message: "Forbidden: You don't have admin rights" });
  }
};
