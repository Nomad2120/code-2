import { DocTypeCodes, RegistrationDoc, RegistrationDocFile } from '@shared/types/registration';
import { getBase64, resizeFile } from '@shared/utils/helpers/base64Convertion';
import api from '@app/api';
import notistackExternal from '@shared/utils/helpers/notistackExternal';
import pdfIcon from '@shared/icons/pdf100.png';
import {
  AddScanDoc,
  OsiAccountApplicationDoc,
  OsiAccountApplicationDocFile
} from '@shared/types/osiAccountApplications';
import { queryClient } from '@shared/api/reactQuery';
import { getGetApiScansIdQueryOptions } from '@shared/api/orval/scans/scans';

export const fileToScanDoc = async (
  file: File,
  docTypeCode: DocTypeCodes | string | undefined = ''
): Promise<AddScanDoc> => {
  let data;
  let base64data;
  if (file.name.split('.').pop()?.toLowerCase() === 'pdf') {
    data = await getBase64(file);
    base64data = data.base64StringFile;
  } else {
    data = await resizeFile(file);
    base64data = data.substring(data.indexOf(',') + 1);
  }

  const scanDoc: AddScanDoc = {
    docTypeCode: docTypeCode as string,
    data: base64data,
    extension: file.name.split('.').pop()
  };

  return scanDoc;
};
export const fromDocToFile = async (
  doc: RegistrationDoc | OsiAccountApplicationDoc,
  optimize = false
): Promise<RegistrationDocFile | OsiAccountApplicationDocFile> => {
  const { scan } = doc;

  let docData;
  if (optimize) {
    const scanResponse = await queryClient.fetchQuery(getGetApiScansIdQueryOptions(scan.id ?? 0));
    docData = scanResponse.result;
  } else {
    docData = (await api.Scan(scan.id)) as unknown as string;
  }

  const extension = scan.fileName.split('.').pop() ?? 'unknown';
  let file;
  if (extension === 'pdf') {
    file = await createPdfFile(docData, scan.fileName);
  } else {
    file = await createImgFile(docData, scan.fileName);
  }

  return {
    file,
    preview: createPreview(file),
    fileName: scan.fileName,
    base64data: docData,
    extension,
    ...doc
  };
};
export const createPdfFile = async (base64Data: any, fileName: string): Promise<any> => {
  const fileURL = `data:application/pdf;base64,${base64Data}`;
  const fetchFile = await fetch(fileURL);
  const blobFile = await fetchFile.blob();
  const file = new File([blobFile], fileName);
  return file;
};
export const createImgFile = async (base64Data: any, fileName: string): Promise<any> => {
  const fileURL = `data:image/jpg;base64,${base64Data}`;
  const fetchFile = await fetch(fileURL);
  const blobFile = await fetchFile.blob();
  return new File([blobFile], fileName);
};
export const createPreview = (file: any) => {
  if (file.name.split('.').pop()?.toLocaleLowerCase() === 'pdf') {
    return pdfIcon;
  }
  return URL.createObjectURL(file);
};
export const downloadDoc = async (doc: RegistrationDocFile): Promise<void> => {
  try {
    if (doc.extension.toLowerCase() === 'pdf') {
      const fetchData = `data:application/pdf;base64,${doc.base64data}`;
      const a = document.createElement('a');
      a.href = fetchData;
      a.download = doc.fileName;
      a.click();
    } else {
      const image = new Image();
      image.src = `data:image/jpg;base64,${doc.base64data}`;
      const w = window.open('');
      w?.document.write(image.outerHTML);
    }
  } catch (err: any) {
    notistackExternal.error(err.toString());
  }
};
