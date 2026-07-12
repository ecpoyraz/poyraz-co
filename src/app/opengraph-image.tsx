import { createSocialImage, socialImageSize } from "./_social-image";

export const alt = "A full stack marketer | Eyüp Poyraz";
export const size = socialImageSize;
export const contentType = "image/png";

export default function OpenGraphImage() {
  return createSocialImage();
}
