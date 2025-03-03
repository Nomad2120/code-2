const areaTypes = [
  {
    code: 'NON_RESIDENTIAL',
    nameRu: 'Нежилое',
    nameKz: 'Тұрғын емес'
  },
  {
    code: 'RESIDENTIAL',
    nameRu: 'Жилое',
    nameKz: 'Тұрғылықты'
  },
  {
    code: 'BASEMENT',
    nameRu: 'Подвал',
    nameKz: 'Жертөле'
  }
];

export default function makeFlat(e) {
  const areaType = areaTypes.find((a) => a.code === e.areaTypeCode);
  return areaType && areaType.code !== 'RESIDENTIAL' ? `${e.flat}  ${areaType.nameRu}` : e.flat;
}
