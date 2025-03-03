export const openBase64PdfInNewWindow = (base64: string) => {
  const blob = new Blob([Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))], { type: 'application/pdf' });
  window.open(URL.createObjectURL(blob));
};

export const downloadBase64Pdf = (base64: string, fileName: string) => {
  const a = document.createElement('a');
  a.href = `data:application/pdf;base64,${base64}`;
  a.download = fileName;
  a.click();
};
