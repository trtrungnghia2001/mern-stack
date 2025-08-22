import { uploadToCloudinary } from "#server/shared/services/cloudinary.service";
import { handleResponse } from "#server/shared/utils/response.util";
import { StatusCodes } from "http-status-codes";
import { getMediaByType } from "./upload.service.js";

export async function getMediaImageController(req, res, next) {
  try {
    const resultImage = await getMediaByType("image");

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Media files retrieved successfully",
      data: resultImage.resources,
    });
  } catch (err) {
    next(err);
  }
}
export async function getMediaVideoController(req, res, next) {
  try {
    const resultVideo = await getMediaByType("video");

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Media files retrieved successfully",
      data: resultVideo.resources,
    });
  } catch (err) {
    next(err);
  }
}
export async function uploadSingleController(req, res, next) {
  try {
    const file = req.file;

    if (!file) return res.status(400).json({ message: "No file uploaded" });

    const result = await uploadToCloudinary(file);

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "File uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
export async function uploadArrayController(req, res, next) {
  try {
    const files = req.files;

    if (!files) return res.status(400).json({ message: "No files uploaded" });

    const result = await Promise.all(
      files.map((file) => uploadToCloudinary(file))
    );

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Files uploaded successfully",
      data: result,
    });
  } catch (error) {
    console.error(error);
    next(error);
  }
}
