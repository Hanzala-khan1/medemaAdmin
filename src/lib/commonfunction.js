export const convertEmptyStringToNull=(obj)=> {
    const newObj = {};
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        newObj[key] = obj[key] === '' ? null : obj[key];
      }
    }
    return newObj;
  }