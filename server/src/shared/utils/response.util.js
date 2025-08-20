import { StatusCodes } from "http-status-codes";

export const handleError = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message;

  return res.status(status).json({
    status: status,
    message: message,
  });
};

export const handleResponse = (
  res,
  { status = StatusCodes.OK, message = "Operation successfully !", data = null }
) => {
  return res.status(status).json({
    status: status || 200,
    message,
    data,
  });
};

export const handleResponseList = (
  res,
  {
    status = StatusCodes.OK,
    message = "Get list successfully!",
    data = [],
    pagination = {
      total: 0,
      page: 1,
      pageSize: 10,
      totalPages: 0,
    },
  }
) => {
  return res.status(status).json({
    status: status || 200,
    message,
    data,
    pagination,
  });
};
