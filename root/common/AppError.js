/**
 * 全局异常
 */
function AppError(message,causeError){
	this.message=message;
	this.cause=causeError;
  this.appError=true;
}

AppError.prototype.toString=function(){
	return this.message;
}

module.exports=AppError;