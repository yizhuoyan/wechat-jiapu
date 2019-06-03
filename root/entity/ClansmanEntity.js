const getService=function(){
  return App.clansmanService();
};

function ClansmanEntity() {
  //唯一标识符
  this._id=null;
  //性别
  this.gender=null;
  //姓名
  this.name=null;
  //生日
  this.birthday=null;
  //手机电话
  this.mobile;
  //居住地
  this.liveWhere;
  //近照
  this.recentPhotoURL;
  //爸爸
  this.fatherId=null;
  //妈妈
  this.motherId=null;
  //我的称谓
  this.myAppellation=null;
  //从我开始的亲戚关系
  this.relationFromMe=null;
  //创建时间
  this.createTime = Date.now();
};

ClansmanEntity.of = function(o) {
  let e = new ClansmanEntity();
  e._id = o._id;
  e.name = o.name||null;
  e.gender = o.gender;
  e.mobile = o.mobile || null;
  e.birthday = o.birthday || null;
  e.liveWhere = o.liveWhere || null;
  e.recentPhotoURL = o.recentPhotoURL || null;
  e.fatherId = Object.ifNOU(o.fatherId,null);
  e.motherId = Object.ifNOU(o.motherId,null);
  e.previousSiblingId = o.previousSiblingId||null;
  e.nextSiblingId = o.nextSiblingId || null;
  e.childOrder = o.childOrder||0;
  e.createTime = o.createTime||null;
  e.myAppellation = o.appellation||null;
  e.relationFromMe = o.relationFromMe||"";  
  return e;
};




//加载父亲
ClansmanEntity.prototype.loadFather = function() {
  if (this.father) {
    return Promise.resolve(this.father);
  }
  if (!this.fatherId) return Promise.resolve(null);
  
 
  return getService()
  .load(this.fatherId).then(father => {
    this.father = father;
    return father;
  });
};
//加载母亲
ClansmanEntity.prototype.loadMother = function() {
  if (this.mother) {
    return Promise.resolve(this.mother);
  }
  if (!this.motherId) return Promise.resolve(null);
  return getService().load(
     this.motherId
  ).then(mother => {
    this.mother = mother;
    return mother;
  });
};

//加载配偶
ClansmanEntity.prototype.loadMates = function() {
  if (this.mates) {
    return Promise.resolve(this.mates);
  }
  return getService().loadMates(this._id).then(mates => {
    this.mates = mates;
    return mates;
  });
 
};

//加载子女
ClansmanEntity.prototype.loadChildren = function() {

  if (this.children) {
    return Promise.resolve(this.children);
  }

  return getService().loadChildren(this._id).then(children => {
    this.children = children;
    return this.children;
  });  
};

module.exports = ClansmanEntity;