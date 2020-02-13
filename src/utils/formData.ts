export let constructFileFromUri = file => {
  let {uri, type, fileName} = file;
  return {uri, name: fileName, type};
};
