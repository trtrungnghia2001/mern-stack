import Joi from "joi";

// Schema đăng ký với quy tắc mật khẩu mạnh hơn
export const schemaSignup = Joi.object({
  name: Joi.string().trim().min(3).max(50).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "string.min": "Password must be at least 8 characters long.",
    }),
  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Confirm password does not match password.",
    }),
});

// Schema đăng nhập
export const schemaSignin = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

// Schema đổi mật khẩu
export const schemaChangePassword = Joi.object({
  password: Joi.string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "string.min": "Password must be at least 8 characters long.",
    }),
  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Confirm password does not match password.",
    }),
});

// Schema quên mật khẩu
export const schemaForgotPassword = Joi.object({
  email: Joi.string().email().required(),
});

// Schema đặt lại mật khẩu
export const schemaResetPassword = Joi.object({
  token: Joi.string().uuid().required(), // Giả sử token là UUID
  password: Joi.string()
    .min(8)
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    )
    .required()
    .messages({
      "string.pattern.base":
        "Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character.",
      "string.min": "Password must be at least 8 characters long.",
    }),
  confirm_password: Joi.string()
    .valid(Joi.ref("password"))
    .required()
    .messages({
      "any.only": "Confirm password does not match password.",
    }),
});

// Schema cập nhật thông tin người dùng
export const schemaUpdateMe = Joi.object({
  name: Joi.string().trim().min(3).max(50).optional(),
  gender: Joi.string().optional(),
  avatar: Joi.string().uri().optional(), // Xác thực URL
  phoneNumber: Joi.string()
    .length(10)
    .pattern(/^[0-9]+$/)
    .optional(), // Ví dụ cho số điện thoại 10 chữ số
  address: Joi.string().optional(),
  birthday: Joi.date().optional(), // Xác thực định dạng ngày
  work: Joi.string().optional(),
  education: Joi.string().optional(),
  bio: Joi.string().max(255).optional(), // Giới hạn độ dài bio
  link_website: Joi.string().uri().optional(), // Xác thực URL
});
