import { Abonent } from '@shared/types/osi/abonents';
import { replace as _replace } from 'lodash';

interface Params {
  (abonentRow: Abonent, OsiId: number | null): Omit<Abonent, 'owner'> & { osiId: number | null; owner: string };
}

export const formatAbonentRow: Params = (abonentRow, osiId) => {
  const formated = {
    phone: abonentRow.phone ? _replace(_replace(abonentRow.phone, '+7 7', '7'), new RegExp(' ', 'g'), '') : '',
    floor: abonentRow.floor ? abonentRow.floor : 0,
    livingJur: abonentRow.livingJur ? abonentRow.livingJur : 0,
    livingFact: abonentRow.livingFact ? abonentRow.livingFact : 0,
    square: abonentRow.square ? abonentRow.square : 0,
    effectiveSquare: abonentRow.effectiveSquare ? abonentRow.effectiveSquare : 0,
    flat: abonentRow.flat,
    name: abonentRow.name,
    idn: abonentRow.idn,
    owner: abonentRow.owner ? abonentRow.owner?.nameRu : '',
    areaTypeCode: abonentRow.areaTypeCode,
    external: abonentRow.external,
    id: abonentRow.id,
    osiId
  };

  return formated;
};
