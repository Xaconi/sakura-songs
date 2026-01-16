interface CloudinaryConfig {
  cloudName: string;
  baseUrl: string;
}

export const CLOUDINARY_CONFIG: CloudinaryConfig = {
  cloudName: 'dxv2rbatl',
  baseUrl: 'https://res.cloudinary.com',
};

export function getAudioUrl(filename: string): string {
  const { cloudName, baseUrl } = CLOUDINARY_CONFIG;
  return `${baseUrl}/${cloudName}/video/upload/${filename}`;
}
