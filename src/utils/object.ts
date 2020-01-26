export const getObjectProperty = (obj, path) => {
  if (!obj || !path) {
    return null;
  }
  let paths = path.split('.');
  let temp = obj;
  for (let key of paths) {
    if (!temp[key]) {
      return null;
    }
    temp = temp[key];
  }
  return temp;
};
