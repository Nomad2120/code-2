import { makeAutoObservable } from 'mobx';
import api from '@app/api';
import { injectable } from 'inversify';
import pdfIcon from '@shared/icons/pdf100.png';
import { getBase64, resizeFile } from '@/shared/utils/helpers/base64Convertion';

@injectable()
export class RegistrationDocsModel {
  constructor() {
    makeAutoObservable(this);
  }

  saveDoc = async (regId: number, doc: any): Promise<void> => {
    await api.RegistrationUpdateDoc(regId, doc);
  };

  prepareUploadedFiles = async (docs: any) => Promise.all(docs.map(async (doc: any) => this.loadDoc(doc)));

  loadDoc = async (doc: any): Promise<any> => {
    const { scan } = doc;

    const docData = await api.Scan(scan.id);
    const extension = scan.fileName.split('.').pop();
    let file;
    if (extension === 'pdf') {
      file = await this.createPdfFile(docData, scan.fileName);
    } else {
      file = await this.createImgFile(docData, scan.fileName);
    }

    return {
      file,
      preview: this.createPreview(file),
      fileName: scan.fileName,
      isLocal: false,
      base64data: docData,
      ...doc
    };
  };

  createPdfFile = async (base64Data: any, fileName: string): Promise<any> => {
    const fileURL = `data:application/pdf;base64,${base64Data}`;
    const fetchFile = await fetch(fileURL);
    const blobFile = await fetchFile.blob();
    const file = new File([blobFile], fileName);
    return file;
  };

  createImgFile = async (base64Data: any, fileName: string): Promise<any> => {
    const fileURL = `data:image/jpg;base64,${base64Data}`;
    const fetchFile = await fetch(fileURL);
    const blobFile = await fetchFile.blob();
    return new File([blobFile], fileName);
  };

  createPreview = (file: any) => {
    if (file.name.split('.').pop()?.toLocaleLowerCase() === 'pdf') {
      return pdfIcon;
    }
    return URL.createObjectURL(file);
  };

  uploadDoc = async (file: any, regId: number): Promise<void> => {
    const extension = file.name.split('.').pop();
    let base64str;
    if (extension === 'pdf') {
      const pdfData = await getBase64(file);
      base64str = pdfData?.base64StringFile;
    } else {
      const data = await resizeFile(file);
      base64str = data.substring(data.indexOf(',') + 1);
    }
    const payload = {
      docTypeCode: 'UDL',
      data: base64str,
      extension: file?.name?.split('.').pop()
    };
    await api.RegistrationUpdateDoc(regId, payload);
  };

  deleteDoc = async (regId: number, docId: number): Promise<void> => {
    await api.RegistrationDeleteDoc(regId, docId);
  };

  getRegistrationInfo = async (id: number) => {
    const [regData, docs, reqDocs]: Array<any> = await Promise.all([
      api.Registration(id),
      api.RegistrationDocs(id),
      api.RegistrationReqDoc(id)
    ]);
    if (regData?.addressRegistryId > 0) {
      const ar: any = await api.findBuildingInfo(regData?.addressRegistryId, regData?.atsId);
      regData.arInfo = {
        ats: ar.ats,
        geonim: ar.geonim,
        building: Object.entries(ar).reduce((acc: any, [k, v]) => {
          if (k !== 'ats' && k !== 'geonim') {
            acc[k] = v;
          }
          return acc;
        }, {})
      };
    }
    const data = { ...regData, docs: reqDocs.slice() };
    if (Array.isArray(docs) && docs.length > 0) {
      const uploadedDocs = docs.reverse();
      data.docs.forEach((item: any) => {
        item.docs = uploadedDocs.filter((x) => x.docTypeCode === item.code);
      });
      data.uploaded = data.docs.every((x: any) => x.docs && x.docs.length > 0);
    }
    return data;
  };
}
