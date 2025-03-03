import { tokens } from '@shared/utils/i18n';
import { Facility, Material } from '@shared/types/osi';

export const materials: Material[] = [
  { code: 'empty', labelRu: 'Не заполнять', labelKz: 'Толтырмау' },
  { code: 'Кирпичный', labelRu: 'Кирпичный', labelKz: 'Кірпішті' },
  { code: 'Панельный', labelRu: 'Панельный', labelKz: 'Панельді' },
  { code: 'Блочный', labelRu: 'Блочный', labelKz: 'Блокты' },
  { code: 'Монолитный', labelRu: 'Монолитный', labelKz: 'Монолитті' },
  { code: 'Деревянный', labelRu: 'Деревянный', labelKz: 'Ағаш ' }
];
export const facilities: Facility[] = [
  {
    value: 'personalElectricPower',
    label: 'Электроснабжение собственное',
    labelToken: tokens.osiInfo.mainInfo.electro
  },
  {
    value: 'personalHeating',
    label: 'Отопление собственное',
    labelToken: tokens.osiInfo.mainInfo.heating
  },
  { value: 'personalHotWater', label: 'Горячая вода собственная', labelToken: tokens.osiInfo.mainInfo.hotWater },
  {
    value: 'gasified',
    label: 'Газифицирован',
    labelToken: tokens.osiInfo.mainInfo.gasified
  }
];
