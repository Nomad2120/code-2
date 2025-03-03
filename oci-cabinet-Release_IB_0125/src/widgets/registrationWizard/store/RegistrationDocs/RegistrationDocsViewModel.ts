import { injectable } from 'inversify';
import { autorun, makeAutoObservable, reaction } from 'mobx';
import { RegistrationWizardViewModel } from '@widgets/registrationWizard/store/RegistrationWizardViewModel';
import { queryClient } from '@shared/api/reactQuery';
import {
  getDeleteApiRegistrationsIdDocsDocIdMutationOptions,
  getGetApiRegistrationsIdDocsQueryKey,
  getGetApiRegistrationsIdDocsQueryOptions,
  getGetApiRegistrationsReqdocsQueryKey,
  getGetApiRegistrationsReqdocsQueryOptions,
  getPostApiRegistrationsIdDocsMutationOptions
} from '@shared/api/orval/registrations/registrations';
import { fromDocToFile } from '@shared/utils/files';
import { DbRegistrationDoc, ResponsesRequiredDocsResponse } from '@shared/api/orval/models';
import { DocScan, DocTypeCodes, RegistrationDocFile } from '@shared/types/registration';
import logger from 'js-logger';
import notistackExternal from '@shared/utils/helpers/notistackExternal';

@injectable()
export class RegistrationDocsViewModel {
  wizard: RegistrationWizardViewModel | null = null;

  files: any[] = [];

  requiredDocs: ResponsesRequiredDocsResponse[] | null | undefined = null;

  isLoading = false;

  private _mutationCache = queryClient.getMutationCache();

  private _queryCache = queryClient.getQueryCache();

  private _disposeAllReactionsController = new AbortController();

  constructor() {
    makeAutoObservable(this);

    autorun(async () => {
      await this.loadData();
      await this.loadFiles();
    });

    reaction(
      () => this.wizard?.registration,
      async (registration, prev) => {
        if (!registration?.unionTypeId) return;
        if (registration.unionTypeId === prev?.unionTypeId) return;

        await queryClient.invalidateQueries({
          queryKey: getGetApiRegistrationsReqdocsQueryKey({ registrationId: registration.id })
        });
      },
      { signal: this._disposeAllReactionsController.signal }
    );

    // TODO: надо отписываться, но когда добавил отписку в cleanup - перестала отрабатывать эта функция
    this._queryCache.subscribe(async ({ query }) => {
      if (!this.wizard?.registration?.id) return;

      const getRegistrationDocsKey = getGetApiRegistrationsIdDocsQueryKey(this.wizard?.registration.id);
      if (query.queryKey[0] === getRegistrationDocsKey[0]) {
        if (query.state.fetchStatus === 'fetching') this.isLoading = true;
        if (!query.state.data?.result) return;
        await this.prepareFiles(query.state.data.result);
        this.isLoading = false;
      }
    });
  }

  get isRequiredDocsFilled(): boolean {
    const requiredDocTypes = this.requiredDocs?.filter((doc) => doc.isRequired).map((doc) => doc.code);
    const loadedDocTypes = this.files.map((doc) => doc.docTypeCode);

    if (!requiredDocTypes?.length || !loadedDocTypes.length) return false;

    return requiredDocTypes.every((reqDoc) => loadedDocTypes.includes(<DocTypeCodes>reqDoc));
  }

  cleanup = () => {
    this._disposeAllReactionsController.abort();
  };

  uploadScan = async (scan: DocScan) => {
    try {
      if (!this.wizard?.registration?.id) return;

      this.isLoading = true;

      const postScanMutation = this._mutationCache.build(queryClient, getPostApiRegistrationsIdDocsMutationOptions());

      await postScanMutation.execute({ id: this.wizard.registration.id, data: scan });

      await queryClient.refetchQueries({
        queryKey: getGetApiRegistrationsIdDocsQueryKey(this.wizard.registration.id)
      });
    } catch (e) {
      this.isLoading = false;
      logger.error(e);
      notistackExternal.error();
    }
  };

  deleteDoc = async (doc: RegistrationDocFile): Promise<void> => {
    try {
      if (!this.wizard?.registration?.id) return;

      this.isLoading = true;

      const deleteMutation = this._mutationCache.build(
        queryClient,
        getDeleteApiRegistrationsIdDocsDocIdMutationOptions()
      );

      await deleteMutation.execute({ id: this.wizard.registration.id, docId: doc.id });

      await queryClient.refetchQueries({
        queryKey: getGetApiRegistrationsIdDocsQueryKey(this.wizard.registration.id)
      });
    } catch (e: unknown) {
      this.isLoading = false;
      if (typeof e === 'string') {
        console.error(e.toString());
        notistackExternal.error(e);
        return;
      }
      if (e instanceof Error) {
        console.error(e.message);
        notistackExternal.error(e.message);
      }
    }
  };

  private loadData = async () => {
    const registrationId = this.wizard?.registration?.id;
    if (!registrationId) return;
    try {
      this.isLoading = true;
      const requiredDocsResponse = await queryClient.fetchQuery(
        getGetApiRegistrationsReqdocsQueryOptions({ registrationId })
      );

      this.requiredDocs = requiredDocsResponse.result;
    } finally {
      this.isLoading = false;
    }
  };

  private loadFiles = async () => {
    if (!this.wizard?.registration?.id) return;
    try {
      this.isLoading = true;
      await queryClient.fetchQuery(
        getGetApiRegistrationsIdDocsQueryOptions(this.wizard.registration.id, { query: { staleTime: 0 } })
      );
    } catch (e) {
      this.isLoading = false;
    }
  };

  private prepareFiles = async (rawDocs: DbRegistrationDoc[]) => {
    // TODO: эта функция каждый раз вызывается всё больше и больше раз, надо найти причину
    this.files = await Promise.all(rawDocs.map(async (doc) => fromDocToFile(doc, true)));
  };
}

export const token = Symbol.for('IRegistrationDocsViewModel');
