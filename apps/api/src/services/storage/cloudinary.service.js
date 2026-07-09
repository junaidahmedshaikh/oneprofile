import { v2 as cloudinary } from "cloudinary";
import { env } from "../../config/env.js";
import { ApiError } from "../../utils/apiError.js";

const hasCloudinaryConfig = Boolean(
  env.CLOUDINARY_CLOUD_NAME &&
  env.CLOUDINARY_API_KEY &&
  env.CLOUDINARY_API_SECRET,
);

if (hasCloudinaryConfig) {
  cloudinary.config({
    cloud_name: env.CLOUDINARY_CLOUD_NAME,
    api_key: env.CLOUDINARY_API_KEY,
    api_secret: env.CLOUDINARY_API_SECRET,
    secure: true,
  });
}

export async function uploadLogoDataUri(
  dataUri,
  folder = env.CLOUDINARY_UPLOAD_FOLDER || "oneprofile/onboarding",
) {
  if (!dataUri || typeof dataUri !== "string") {
    throw new ApiError(
      400,
      "Logo payload is required",
      "ONBOARDING_LOGO_REQUIRED",
    );
  }

  if (!dataUri.startsWith("data:image/")) {
    throw new ApiError(
      400,
      "Logo must be an image data URI",
      "ONBOARDING_LOGO_INVALID",
    );
  }

  if (dataUri.length > 6_000_000) {
    throw new ApiError(
      413,
      "Logo image is too large",
      "ONBOARDING_LOGO_TOO_LARGE",
    );
  }

  if (!hasCloudinaryConfig) {
    return {
      secure_url: dataUri,
      public_id: "",
      provider: "inline",
    };
  }

  return cloudinary.uploader.upload(dataUri, {
    folder,
    resource_type: "image",
    transformation: [
      {
        width: 512,
        height: 512,
        crop: "limit",
      },
    ],
  });
}
