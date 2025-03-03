import { OSICoreModelsEnumsAreaTypeCodes } from '@shared/api/swaggerTypes/data-contracts';
import { AreaTypeCodes } from '@shared/types/dictionaries';
import { Abonent } from '@shared/types/osi/abonents';

export interface OsiServiceRequest {
  /** @format int32 */
  osiId: number;
  nameRu: string;
  nameKz?: string | null;
  /** @format int32 */
  serviceGroupId?: number;
  /** @format int32 */
  accuralMethodId?: number;
  /** @format double */
  amount?: number;
}

export interface OsiServiceResponse {
  /** @format int32 */
  id?: number;
  nameRu?: string | null;
  nameKz?: string | null;
  /** @format int32 */
  serviceGroupId?: number;
  /** @format int32 */
  accuralMethodId?: number;
  /** @format double */
  amount?: number;
  isOsiBilling?: boolean;
  isActive?: boolean;
  /** @format int32 */
  countAllAbonents?: number;
  /** @format int32 */
  countActiveAbonents?: number;
}

export interface ServiceGroupResponse {
  /** @format int32 */
  id?: number;
  groupNameRu?: string | null;
  groupNameKz?: string | null;
  canChangeName?: boolean;
  justOne?: boolean;
  canEditAbonents?: boolean;
  canCreateFixes?: boolean;
  accuralMethods?: AccuralMethod[] | null;
  serviceNameExamples?: ServiceNameExample[] | null;
  services?: OsiServiceResponse[] | null;
}

export interface AccuralMethod {
  /** @format int32 */
  id?: number;
  descriptionRu?: string | null;
  descriptionKz?: string | null;
}

export interface ServiceNameExample {
  /** @maxLength 100 */
  nameRu: string;
  /** @maxLength 100 */
  nameKz: string;
}

export interface EditServiceFormValues {
  service: {
    code: string;
    nameRu: string;
    nameKz: string;
  };
  serviceGroupId: number;
  accrualMethodId: number;
  amount: number;
}

export interface AddServiceFormValues {
  service: {
    code: string;
    nameRu: string;
    nameKz: string;
  };
  serviceGroupId: number;
  accrualMethodId: number;
  amount: number;
}

export interface AddAdditionalServiceFormValues extends AddServiceFormValues {
  arendator: {
    inputValue: string;
    value: Abonent | string;
  };
}

export interface OsiService {
  /** @format int32 */
  osiId: number;
  nameRu: string;
  nameKz?: string | null;
  /** @format int32 */
  serviceGroupId?: number;
  /** @format int32 */
  accuralMethodId?: number;
  /** @format double */
  amount?: number;
  /** @format int32 */
  id?: number;
  isOsibilling: boolean;
  isActive: boolean;
  serviceGroupNameRu?: string | null;
  serviceGroupNameKz?: string | null;
  copyToNextPeriod?: boolean;
}

export interface AbonentOnServiceResponse {
  /** @format int32 */
  osiId?: number;
  /** @maxLength 100 */
  name?: string | null;
  /** @maxLength 200 */
  flat: string;
  idn?: string | null;
  areaTypeCode: AreaTypeCodes;
  /**
   * @maxLength 15
   * @pattern ^7\d{9}$
   */
  phone?: string | null;
  /** @format int32 */
  floor: number;
  /** @format double */
  square: number;
  /** @format int32 */
  livingJur: number;
  /** @format int32 */
  livingFact: number;
  owner?: string | null;
  external?: boolean;
  /** @format double */
  effectiveSquare?: number | null;
  /** @format int32 */
  id?: number;
  isActive?: boolean;
  /** @maxLength 20 */
  ercAccount?: string | null;
  areaTypeNameRu?: string | null;
  areaTypeNameKz?: string | null;
  osiName?: string | null;
  address?: string | null;
  invoiceNum?: string | null;
  checked?: boolean;
  /** @format int32 */
  parkingPlaces?: number;
}

export interface AbonentOnServiceRequest {
  /** @format int32 */
  abonentId?: number;
  checked?: boolean;
  /** @format int32 */
  parkingPlaces?: number;
}
