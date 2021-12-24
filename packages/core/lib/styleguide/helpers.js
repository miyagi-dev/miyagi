export const getCustomProperties = function (obj, property, endsWith) {
  var result = [];

  if (obj instanceof Array) {
    for (var i = 0; i < obj.length; i++) {
      result = [...result, ...getCustomProperties(obj[i], property, endsWith)];
    }
  } else {
    for (const prop in obj) {
      if (prop == "property") {
        if (endsWith) {
          if (obj[prop].endsWith(`-${property}`)) {
            result.push({
              property: obj.property,
              value: obj.value,
            });
          }
        } else {
          if (obj[prop].startsWith(`--${property}-`)) {
            result.push({
              property: obj.property,
              value: obj.value,
            });
          }
        }
      }
      if (obj[prop] instanceof Object || obj[prop] instanceof Array) {
        result = [
          ...result,
          ...getCustomProperties(obj[prop], property, endsWith),
        ];
      }
    }
  }

  return result;
};
