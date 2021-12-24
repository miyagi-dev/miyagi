export default function getMediaQueries(obj) {
  var result = [];

  if (obj instanceof Array) {
    for (var i = 0; i < obj.length; i++) {
      result = [...result, ...getMediaQueries(obj[i])];
    }
  } else {
    for (const prop in obj) {
      if (prop == "type") {
        if (obj[prop] === "media") {
          result.push(obj.media);
        }
      }
      if (obj[prop] instanceof Object || obj[prop] instanceof Array) {
        result = [...result, ...getMediaQueries(obj[prop])];
      }
    }
  }

  return result.filter((v, i, a) => a.indexOf(v) === i);
}
