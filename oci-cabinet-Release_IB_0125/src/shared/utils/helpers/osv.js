import { sumBy } from 'lodash';
import { LOCALES } from '@shared/utils/i18n/locales';
import i18next from 'i18next';
import makeFlat from './makeFlat';

export function getOsvRows(abonents, langKey) {
  const translatedField = langKey === LOCALES.RU ? 'serviceName' : 'serviceNameKz';

  const rows = abonents.reduce(
    (acc, item) => [
      ...acc,
      {
        level: 0,
        abonentName: item.abonentName,
        owner: item.owner,
        flat: [makeFlat(item)],
        totalBegin: sumBy(item.services, 'begin'),
        totalDebet: sumBy(item.services, 'sumOfAccurals'),
        totalFixes: sumBy(item.services, 'sumOfFixes'),
        totalKredit: sumBy(item.services, 'kredit'),
        totalFine: sumBy(item.services, 'sumOfFines'),
        totalEnd: sumBy(item.services, 'end')
      },
      ...item.services.map((e) => ({
        ...e,
        level: 1,
        flat: [makeFlat(item), e?.[translatedField]],
        totalBegin: e.begin,
        totalDebet: e.sumOfAccurals,
        totalFixes: e.sumOfFixes,
        totalKredit: e.kredit,
        totalFine: e.sumOfFines,
        totalEnd: e.end
      }))
    ],
    []
  );
  const total = [
    sumBy(rows, 'begin'),
    sumBy(rows, 'sumOfAccurals'),
    sumBy(rows, 'sumOfFixes'),
    sumBy(rows, 'kredit'),
    sumBy(rows, 'end'),
    sumBy(rows, 'sumOfFines')
  ];
  return [rows, total];
}

export function getOsvRowsByFlat(data, moment) {
  const translatedField = i18next.language === 'ru' ? 'serviceName' : 'serviceNameKz';

  const rows = data.reduce((acc, item) => {
    const period = translatePeriod(item.period, moment);

    const res = [
      ...acc,
      {
        level: 0,
        period: [period],
        totalBegin: sumBy(item.services, 'begin'),
        totalDebet: sumBy(item.services, 'sumOfAccurals'),
        totalFixes: sumBy(item.services, 'sumOfFixes'),
        totalKredit: sumBy(item.services, 'kredit'),
        totalFine: sumBy(item.services, 'sumOfFines'),
        totalEnd: sumBy(item.services, 'end')
      },
      // eslint-disable-next-line no-unsafe-optional-chaining
      ...item.services?.map((e) => ({
        ...e,
        level: 1,
        period: [period, e?.[translatedField]],
        totalBegin: e.begin,
        totalDebet: e.sumOfAccurals,
        totalFixes: e.sumOfFixes,
        totalKredit: e.kredit,
        totalFine: e.sumOfFines,
        totalEnd: e.end
      }))
    ];

    return res;
  }, []);

  const totals = rows.filter((e) => e.level === 0);
  const total = [
    totals.length ? totals[0].totalBegin : 0,
    sumBy(rows, 'sumOfAccurals'),
    sumBy(rows, 'sumOfFixes'),
    sumBy(rows, 'kredit'),
    totals.length ? totals[totals.length - 1].totalEnd : 0
  ];
  return [rows, total];
}

const translatePeriod = (date, m) => {
  const ru = m().locale('ru');
  const kk = m().locale('kk');

  const arrRu = ru.localeData().months();
  const arrKk = kk.localeData().months();

  const month = date.slice(0, -5).toLowerCase();

  const monthRu = arrRu[arrRu.indexOf(month)];
  const monthKk = arrKk[arrRu.indexOf(month)];

  if (i18next.language === 'kk') {
    const translatedDate = `${monthKk[0].toUpperCase() + monthKk.slice(1)} ${date.slice(-4)}`;
    return translatedDate;
  }

  const translatedDate = `${monthRu[0].toUpperCase() + monthRu.slice(1)} ${date.slice(-4)}`;

  return translatedDate;
};
