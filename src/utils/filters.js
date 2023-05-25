export const comma = val => {
  return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};

export const secretId = userId => {
  const secretId =
    userId.length == 0
      ? ''
      : userId.length > 9
      ? `${userId.slice(0, 5)}*****`
      : userId.length > 6
      ? `${userId.slice(0, 3)}*****`
      : `${userId.slice(0, 2)}****`;
  return secretId;
};
