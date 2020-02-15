export let constructFileFromUri = file => {
  let { uri, type, fileName, name } = file;
  return { uri, name: fileName || name, type };
};

export let formData = rawData => {
  let form = new FormData();
  Object.keys(rawData).forEach(key => {
    form.append(key, rawData[key]);
  });
  return form;
};