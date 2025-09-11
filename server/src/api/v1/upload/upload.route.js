import upload from "#server/configs/multer.config";
import express from "express";
import {
  deleteFileController,
  getMediaImageController,
  getMediaVideoController,
  uploadArrayController,
  uploadSingleController,
} from "./upload.controller.js";

const uploadRouter = express.Router();

uploadRouter.get("/media/image", getMediaImageController);

uploadRouter.get("/media/video", getMediaVideoController);

uploadRouter.post(
  "/single",
  upload.single("singleFile"),
  uploadSingleController
);

uploadRouter.post("/array", upload.array("arrayFile"), uploadArrayController);

uploadRouter.post("/delete", deleteFileController);

export default uploadRouter;
