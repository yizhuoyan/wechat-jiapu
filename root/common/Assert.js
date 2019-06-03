const AppError=require("AppError");

function Assert(){}

Assert.isTrue = function (m, v) {
  if (!v) {
    throw new AppError(m);
  }
}

Assert.isFalse = function (m, v) {
  if (v) {
    throw new AppError(m);
  }
};

Assert.notNull=function(message,s){
	if($(s)){
		throw new AppError(message);
	}
	return s;
};

const $=function(s){
  return typeof s==='undefined'||s===null;
};

Assert.isMobileNumber=function(m,s){
  if($(s))return null;

  s=String(s).trim();
  if (/^1\d{10}$/.test(s)===false){
      throw new AppError(m);
  }
  return null;
};


Assert.stringNotBlank=function(message,s){
	if($(s)||(s=s.trim()).length===0){
		throw new AppError(message);
	}
	return s;
};

Assert.arrayNotEmpty=function(message,arr){
	if(!Array.isArray(arr)||arr.length===0
	){
		throw new AppError(message);
	}
	return arr;
};

if(module){
  module.exports=Assert;
}