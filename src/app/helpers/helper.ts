export const blobToBase64 = (blob) => {
  const reader = new FileReader();
  reader.readAsDataURL(blob);
  return new Promise<string>((resolve) => {
    reader.onloadend = () => {
      resolve(reader.result.toString().replace(/^data:.+;base64,/, ''));
    };
  });
};
