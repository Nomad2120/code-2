import { filter } from 'lodash';

export const applyFilter = (array: any[], query: string) => {
  let arr = array;
  if (query) {
    arr = filter(
      array,
      (_item) =>
        _item.name.toLowerCase().indexOf(query.toLowerCase()) !== -1 ||
        _item.address.toLowerCase().indexOf(query.toLowerCase()) !== -1
    );
  }
  return arr;
};
