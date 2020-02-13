export const SET = 'SET';
export const SET_MULTIPLE = 'SET_MULTIPLE';
export const MERGE_LIST = 'MERGE_LIST';

export const reducer = (state, {type, name, value, values, names}) => {
  switch (type) {
    case SET:
      return {...state, [name]: value};
    case SET_MULTIPLE:
      let temp = state;
      names.forEach((key, i) => {
        temp[key] = values[i];
      });
      return {...state, ...temp};
    case MERGE_LIST:
      return {...state, [name]: [...state[name], ...value]};
    default:
      return state;
  }
};
