const CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz'.split('');
String.uuid = function (len = 32, radix) {
  let chars = CHARS;
  radix = radix || chars.length;
  
  const uuid = [];
  for (let i = len; i-- > 0; uuid[i] = chars[0 | Math.random() * radix]);
  return uuid.join("");

};
String.trim = function (s) {
  if (typeof s === "string") {
    if((s=s.trim()).length===0)return null;
    return s;
  }
  return s;
};
