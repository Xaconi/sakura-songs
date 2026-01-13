export const CLOUDINARY_CONFIG = {
  cloudName: 'dxv2rbatl',
  baseUrl: 'https://res.cloudinary.com',
};

export function getAudioUrl(filename) {
  const { cloudName, baseUrl } = CLOUDINARY_CONFIG;
  return `${baseUrl}/${cloudName}/video/upload/${filename}`;
}
