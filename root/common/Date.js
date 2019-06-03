const fill0 = function (n) {
  return n > 9 ? String(n) : '0' + n;
};

Date.formatTime = function (date) {
  return [date.getFullYear(),
  date.getMonth() + 1,
  date.getDate()]
    .map(fill0)
    .join('-')
    + ' '
    + [date.getHours(),
    date.getMinutes(),
    date.getSeconds()].map(fill0).join(':');
};

/**
 * 格式化日期为1990-01-10格式
 */
Date.formatDate = function (date) {
  return [date.getFullYear(),
  date.getMonth() + 1,
  date.getDate()]
    .map(fill0)
    .join('-');
};

const MS_ONE_DAY = 24 * 60 * 60 * 1000;
const MS_ONE_YEAR = 24 * 60 * 60 * 1000;
/**
 *计算日期天数之差
 */
Date.betweenDay = function (a, b) {
  a.setHours(0);
  a.setMinutes(0);
  a.setSeconds(0);
  a.setMilliseconds(0);
  b.setHours(0);
  b.setMinutes(0);
  b.setSeconds(0);
  b.setMilliseconds(0);

  let betweenMS = a.getTime() - b.getTime();
  return Math.floor(betweenMS/ MS_ONE_DAY);
};
/**
 *计算年龄
 */
Date.getAge=function(birthDate){
  if(typeof birthDate==="string"){
    birthDate=new Date(Date.parse(birthDate));
  }
  const now=new Date();  
  let arr = "FullYear,Month,Date".split(",")
  .map(x=>"get"+x)
  .map(x=>now[x]()-birthDate[x]());
 return arr[1] < 0 || (arr[1] == 0 && arr[2] < 0)?arr[0] - 1: arr[0];     
};
/**
 * 获取生日月份和日期
 */
Date.getMonthDay = function (date) {
  if (typeof date==="undefined") {
    return undefined;
  }
  if(date===null){
    return null;
  }
  if (typeof date === "string") {
    date = new Date(Date.parse(date));
  }
  return (date.getMonth() + 1) * 100 + date.getDate();
};

Date.changeYear=function(date,offset){
  if(typeof date==="string"){
    date=new Date(Date.parse(date));
    date.setFullYear(date.getFullYear()+offset);
    return Date.formatDate(date);
  }
  if(date instanceof Date){
    date.setFullYear(date.getFullYear() + offset);
    return date;
  }
  
}

