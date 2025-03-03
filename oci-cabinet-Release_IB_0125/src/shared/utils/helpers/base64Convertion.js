/* eslint-disable no-plusplus */
import base64js from 'base64-js';
import Resizer from 'react-image-file-resizer';

export const base64Decode = (str, encoding = 'utf-8') => {
  if (!str) {
    return '';
  }
  const bytes = base64js.toByteArray(str);
  return new TextDecoder(encoding).decode(bytes);
};

export const base64Encode = (str, encoding = 'utf-8') => {
  if (!str) {
    return '';
  }
  const bytes = new TextEncoder(encoding).encode(str);
  return base64js.fromByteArray(bytes);
};

export function arrayBufferToBase64(buffer) {
  let binary = '';
  const bytes = new Uint8Array(buffer);
  const len = bytes.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return window.btoa(binary);
}

export function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

export function fileToString(file) {
  return new Promise((resolve, reject) => {
    try {
      const reader = new FileReader();
      reader.readAsArrayBuffer(file);
      reader.onloadend = () => {
        resolve(arrayBufferToBase64(reader.result));
      };
    } catch (e) {
      reject(e);
    }
  });
}

export const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(file, 1980, 1980, 'JPEG', 90, 0, resolve, 'base64');
  });

export const getBase64 = (file) => {
  const reader = new FileReader();
  return new Promise((resolve, reject) => {
    reader.onerror = () => {
      reader.abort();
      reject(new Error('Error parsing file'));
    };
    reader.onload = function () {
      const bytes = Array.from(new Uint8Array(this.result));

      const base64StringFile = btoa(bytes.map((item) => String.fromCharCode(item)).join(''));

      resolve({
        bytes,
        base64StringFile,
        fileName: file.name,
        fileType: file.type
      });
    };
    reader.readAsArrayBuffer(file);
  });
};
