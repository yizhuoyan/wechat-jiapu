const CacheManage=function(){
   this.cacheMap={};
};

CacheManage.prototype.put=function(id,obj){
  this.cacheMap[id]=obj;
}

CacheManage.prototype.get= function (id) {
  return this.cacheMap[id];
}

CacheManage.prototype.remove = function (id) {
  delete this.cacheMap[id];
  
}
CacheManage.prototype.clear = function () {
  this.cacheMap={};
}

module.exports=CacheManage;