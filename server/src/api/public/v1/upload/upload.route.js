import CLOUDINARY_CONFIG from "#server/configs/cloudinary.config";
import ENV_CONFIG from "#server/configs/env.config";
import upload from "#server/configs/multer.config";
import { uploadToCloudinary } from "#server/shared/services/cloudinary.service";
import { handleResponse } from "#server/shared/utils/response.util";
import express from "express";
import { StatusCodes } from "http-status-codes";

const uploadRouter = express.Router();

uploadRouter.get("/media/folder/:folderName", async (req, res, next) => {
  const { folderName } = req.params;

  try {
    const resultImage = await CLOUDINARY_CONFIG.api.resources({
      type: "upload",
      prefix: `${folderName || ENV_CONFIG.CLOUDINARY_FOLDER_NAME}/`, // folder path
      resource_type: "image",
      max_results: 100,
    });
    const resultVideo = await CLOUDINARY_CONFIG.api.resources({
      type: "upload",
      prefix: `${folderName || ENV_CONFIG.CLOUDINARY_FOLDER_NAME}/`, // folder path
      resource_type: "video",
      max_results: 100,
    });

    return handleResponse(res, {
      status: StatusCodes.OK,
      message: "Media files retrieved successfully",
      data: [...resultImage.resources, ...resultVideo.resources],
    });
  } catch (err) {
    next(err);
  }
});

uploadRouter.post(
  "/single",
  upload.single("singleFile"),
  async (req, res, next) => {
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
);

uploadRouter.post(
  "/array",
  upload.array("arrayFile"),
  async (req, res, next) => {
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
);

export default uploadRouter;
