/**
 * 如果o是undfined,则返回o
 */
Object.ifUndefined = function (o, d) {
  return typeof o === "undefined" ? d : o;
};
/**
 * 如果o是null或者undefined，则默认为d
 */
Object.ifNOU = function (o, d) {
  return typeof o === "undefined" || o === null ? d : o;
};