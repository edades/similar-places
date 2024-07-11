const toBase64 = file => new Promise((resolve, reject) => {
  const reader = new FileReader();
  if(file) {
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
  }
});

export { toBase64 }