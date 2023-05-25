import { getItemName } from '@/utils/getItemName';

export const sortDate = (arr, title, orderby) => {
  return orderby == 'asc'
    ? arr.sort((a, b) => new Date(a[title]) - new Date(b[title]))
    : arr.sort((a, b) => new Date(b[title]) - new Date(a[title]));
};

export const sortStr = (arr, title, orderby) => {
  return orderby == 'asc'
    ? arr.sort((a, b) =>
        a[title] < b[title]
          ? -1
          : 1 || new Date(a.orderDate).localeCompare(new Date(b.orderDate)),
      )
    : arr.sort((a, b) =>
        a[title] > b[title]
          ? -1
          : 1 || new Date(b.orderDate).localeCompare(new Date(a.orderDate)),
      );
};

export const sortItemId = (arr, title, orderby) => {
  return orderby == 'asc'
    ? arr.sort((a, b) =>
        getItemName(a[title]) < getItemName(b[title])
          ? -1
          : 1 || new Date(a.orderDate).localeCompare(new Date(b.orderDate)),
      )
    : arr.sort((a, b) =>
        getItemName(a[title]) > getItemName(b[title])
          ? -1
          : 1 || new Date(b.orderDate).localeCompare(new Date(a.orderDate)),
      );
};

export const sortOrderList = (arr, title, orderby) => {
  let list;
  title == 'orderDate' || title == 'createdAt'
    ? sortDate(arr, title, orderby)
    : title == 'itemId'
    ? sortItemId(arr, title, orderby)
    : sortStr(arr, title, orderby);
  return list;
};
