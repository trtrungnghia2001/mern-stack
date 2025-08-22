import CLOUDINARY_CONFIG from "#server/configs/cloudinary.config";
import ENV_CONFIG from "#server/configs/env.config";

export async function getMediaByType(type) {
  return await CLOUDINARY_CONFIG.api.resources({
    type: "upload",
    prefix: `${ENV_CONFIG.CLOUDINARY_FOLDER_NAME}/`, // folder path
    resource_type: type,
    max_results: 100,
  });
}
