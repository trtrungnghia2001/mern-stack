import swaggerJsdoc from "swagger-jsdoc";

const swaggerSpec = swaggerJsdoc({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "Full API v1 Documentation",
      version: "1.0.0",
      description:
        "Comprehensive API documentation for all V1 endpoints, including user authentication, comments, and other future services.",
    },
    servers: [
      {
        url: "/api/v1",
        description: "Development server",
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
      schemas: {
        // --- Schemas cho nhóm Authentication ---
        SignupRequest: {
          type: "object",
          required: ["name", "email", "password", "confirm_password"],
          properties: {
            name: {
              type: "string",
              minLength: 3,
              maxLength: 50,
              example: "johndoe",
            },
            email: {
              type: "string",
              format: "email",
              example: "johndoe@gmail.com",
            },
            password: {
              type: "string",
              minLength: 8,
              description:
                "Mật khẩu phải chứa chữ hoa, chữ thường, số và ký tự đặc biệt.",
              example: "P@ssword123",
            },
            confirm_password: {
              type: "string",
              description: "Phải khớp với mật khẩu.",
              example: "P@ssword123",
            },
          },
        },
        SigninRequest: {
          type: "object",
          required: ["email", "password"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "johndoe@example.com",
            },
            password: { type: "string", example: "P@ssword123" },
          },
        },
        UpdateMeRequest: {
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 3,
              maxLength: 50,
              example: "Jane Doe",
            },
            gender: { type: "string", example: "male" },
            avatar: {
              type: "string",
              format: "uri",
              example: "http://example.com/avatar.jpg",
            },
            phoneNumber: {
              type: "string",
              pattern: "^[0-9]{10}$",
              example: "0987654321",
            },
            address: { type: "string", example: "123 Main St, Anytown" },
            birthday: { type: "string", format: "date", example: "1990-01-01" },
            work: { type: "string", example: "Software Engineer" },
            education: { type: "string", example: "University of Technology" },
            bio: {
              type: "string",
              maxLength: 255,
              example: "Passionate about coding.",
            },
            link_website: {
              type: "string",
              format: "uri",
              example: "http://johndoe.com",
            },
          },
        },
        // Schema MỚI để mô tả dữ liệu tải file
        UploadMeRequest: {
          type: "object",
          properties: {
            name: {
              type: "string",
              minLength: 3,
              maxLength: 50,
              example: "Jane Doe",
            },
            gender: { type: "string", example: "male" },
            // Sử dụng "format": "binary" để chỉ định file
            avatarFile: {
              type: "string",
              format: "binary",
              description: "File ảnh đại diện.",
            },
            phoneNumber: {
              type: "string",
              pattern: "^[0-9]{10}$",
              example: "0987654321",
            },
            address: { type: "string", example: "123 Main St, Anytown" },
            birthday: { type: "string", format: "date", example: "1990-01-01" },
            work: { type: "string", example: "Software Engineer" },
            education: { type: "string", example: "University of Technology" },
            bio: {
              type: "string",
              maxLength: 255,
              example: "Passionate about coding.",
            },
            link_website: {
              type: "string",
              format: "uri",
              example: "http://johndoe.com",
            },
          },
        },
        ChangePasswordRequest: {
          type: "object",
          required: ["password", "confirm_password"],
          properties: {
            password: {
              type: "string",
              minLength: 8,
              description: "Mật khẩu mới phải mạnh.",
              example: "NewP@ssword456",
            },
            confirm_password: {
              type: "string",
              description: "Phải khớp với mật khẩu mới.",
              example: "NewP@ssword456",
            },
          },
        },
        ForgotPasswordRequest: {
          type: "object",
          required: ["email"],
          properties: {
            email: {
              type: "string",
              format: "email",
              example: "johndoe@example.com",
            },
          },
        },
        ResetPasswordRequest: {
          type: "object",
          required: ["token", "password", "confirm_password"],
          properties: {
            token: {
              type: "string",
              description: "Token đặt lại mật khẩu nhận qua email.",
              example: "eyJhbGciOiJIUzI1Ni...",
            },
            password: {
              type: "string",
              minLength: 8,
              description: "Mật khẩu mới phải mạnh.",
              example: "NewP@ssword456",
            },
            confirm_password: {
              type: "string",
              description: "Phải khớp với mật khẩu mới.",
              example: "NewP@ssword456",
            },
          },
        },
      },
    },
    tags: [
      {
        name: "Authentication",
        description:
          "Các endpoint cho đăng ký, đăng nhập và quản lý tài khoản người dùng.",
      },
      {
        name: "Comments",
        description: "Các endpoint cho việc quản lý bình luận trên bài viết.",
      },
      { name: "Uploads", description: "Các endpoint cho việc tải lên file." },
    ],
    paths: {
      // --- Endpoints cho nhóm Authentication ---
      "/auth/signup": {
        post: {
          tags: ["Authentication"],
          summary: "Đăng ký người dùng mới",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SignupRequest" },
              },
            },
          },
          responses: {
            201: { description: "Người dùng được tạo thành công." },
            400: { description: "Dữ liệu đầu vào không hợp lệ." },
          },
        },
      },
      "/auth/signin": {
        post: {
          tags: ["Authentication"],
          summary: "Đăng nhập người dùng",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SigninRequest" },
              },
            },
          },
          responses: {
            200: { description: "Đăng nhập thành công." },
            401: { description: "Thông tin đăng nhập không hợp lệ." },
          },
        },
      },
      // ... (Các endpoint authentication khác) ...
      "/auth/signout": {
        post: {
          tags: ["Authentication"],
          summary: "Đăng xuất người dùng",
          responses: { 200: { description: "Đăng xuất thành công." } },
        },
      },
      "/auth/get-me": {
        get: {
          tags: ["Authentication"],
          summary: "Lấy thông tin người dùng đã xác thực",
          security: [{ bearerAuth: [] }],
          responses: {
            200: { description: "Trả về thông tin người dùng." },
            401: { description: "Chưa được xác thực." },
          },
        },
      },
      "/auth/update-me": {
        put: {
          tags: ["Authentication"],
          summary: "Cập nhật thông tin người dùng",
          security: [{ bearerAuth: [] }],
          requestBody: {
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/UpdateMeRequest" },
              },
              "multipart/form-data": {
                schema: { $ref: "#/components/schemas/UploadMeRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Thông tin người dùng được cập nhật thành công.",
            },
            401: { description: "Chưa được xác thực." },
            400: { description: "Dữ liệu đầu vào không hợp lệ." },
          },
        },
      },
      "/auth/refresh-token": {
        post: {
          tags: ["Authentication"],
          summary: "Làm mới access token",
          responses: {
            200: { description: "Tạo access token mới." },
            401: { description: "Refresh token không hợp lệ." },
          },
        },
      },
      "/auth/change-password": {
        post: {
          tags: ["Authentication"],
          summary: "Thay đổi mật khẩu",
          security: [{ bearerAuth: [] }],
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ChangePasswordRequest" },
              },
            },
          },
          responses: {
            200: { description: "Mật khẩu thay đổi thành công." },
            401: { description: "Chưa được xác thực." },
            400: { description: "Mật khẩu không hợp lệ." },
          },
        },
      },
      "/auth/forgot-password": {
        post: {
          tags: ["Authentication"],
          summary: "Yêu cầu đặt lại mật khẩu",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ForgotPasswordRequest" },
              },
            },
          },
          responses: {
            200: {
              description: "Link đặt lại mật khẩu đã được gửi đến email.",
            },
            404: { description: "Người dùng không tồn tại." },
          },
        },
      },
      "/auth/reset-password": {
        post: {
          tags: ["Authentication"],
          summary: "Đặt lại mật khẩu bằng token",
          requestBody: {
            required: true,
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/ResetPasswordRequest" },
              },
            },
          },
          responses: {
            200: { description: "Đặt lại mật khẩu thành công." },
            400: { description: "Token không hợp lệ hoặc đã hết hạn." },
          },
        },
      },
      // Social login endpoints
      "/auth/passport/google": {
        get: {
          tags: ["Authentication"],
          summary: "Bắt đầu đăng nhập bằng Google",
          description:
            "Endpoint này chuyển hướng người dùng đến Google để xác thực.",
          responses: { 302: { description: "Chuyển hướng đến Google." } },
        },
      },
    },
  },
  apis: [],
});

export default swaggerSpec;
