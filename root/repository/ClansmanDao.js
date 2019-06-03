const COLLECTION_TYPE = "clansman";
const CacheManage = require("CacheManage");
const cache = new CacheManage();

function ClansmanDao() {
  this.db = wx.cloud.database();
 
};


ClansmanDao.prototype.insert = function (e) {
  return this.db.collection(COLLECTION_TYPE).add({
      data: entity2row(e)
  }).then(res => {
    e._id = res._id;
    cache.put(e._id,e);
    return e;
  });
};

ClansmanDao.prototype.update = function(_id, map) {
  if(map.birthday){
    map._birthday=Date.getMonthDay(map.birthday);
  }
  return this.db.collection(COLLECTION_TYPE).doc(_id)
  .update({
    data:map
  }).then(res=>{
    if (res.stats.updated === 1){
      cache.remove(_id);
      return true;
    }
    
    return false;
  });
};

ClansmanDao.prototype.delete= function(_id) {
  return this.db.collection(COLLECTION_TYPE).doc(_id)
    .remove().then(res => {
      //console.log(res.stats)
      if(res.stats.removed===1){
        cache.remove(_id);
        return true;
      }
      return false;
    });
};

ClansmanDao.prototype.selectById = function (_id) {
  let t=cache.get(_id);
  if(t){
    return Promise.resolve(t);
  }

  return this.db.collection(COLLECTION_TYPE).doc(_id)
  .get().then(res => {
    return row2entity(res.data);
  });
};

ClansmanDao.prototype.count = function (where) {
  let query = this.db.collection(COLLECTION_TYPE);
  if(where){
    query=query.where(where);
  }
  return query.count().then(res => {
      return res.total;
  });
};


ClansmanDao.prototype.selectByIds = function(idArray) {
  //console.log("idArray",idArray);  
  if (!idArray||idArray.length===0){
      return Promise.resolve([]);
  }
  const _ = this.db.command;
  return this.db.collection(COLLECTION_TYPE)
      .where({
        _id: _.in(idArray)
      }).get().then(res => {
        const rows = res.data;
        if (rows && rows.length) {
          return rows.map(row2entity);
        } else {
          return [];
        }
      });
};

ClansmanDao.prototype.selectOne = function (where) {
  return this.db.collection(COLLECTION_TYPE)
    .where(
      where
    ).limit(1).get().then(res => {
      const rows = res.data;
      if (rows && rows.length) {
        return row2entity(rows[0]);
      } else {
        return null;
      }
    });
};

ClansmanDao.prototype.selectMany = function(where, orderBys) {
  //console.log("where",where);
  let query = this.db.collection(COLLECTION_TYPE);
  if (where){
    query=query.where(where);
  }
    
  if (orderBys) {
    for (let ob of orderBys) {
      query=query.orderBy(ob[0], ob[1] || "asc");
    }
  }
  return query.get().then(res => {
    const rows = res.data;
    
    if (rows && rows.length) {
      return rows.map(row2entity);
    } else {
      return [];
    }
  });
};

/**
 * 查找生日大于指定时间的族人
 */
ClansmanDao.prototype.selectByBirthdayGreateThan=function(bn){
  let _=this.db.command;
  return this.db.collection(COLLECTION_TYPE).where({
    _birthday:_.gte(bn)
  }).orderBy("_birthday","asc").limit(10).get().then(res=>{
    let rows=res.data;
    if (rows && rows.length) {
      return rows.map(row2entity);
    } else {
      return [];
    }
  });
};

ClansmanDao.prototype.selectPagination=function(pageNo,pageSize){
  let _ = this.db.command;
  return this.db.collection(COLLECTION_TYPE).where({
    birthday: _.neq(null)
  }).orderBy("name", "asc").skip((pageNo-1)*pageSize).limit(pageSize).get().then(res => {
    let rows = res.data;
    if (rows && rows.length) {
      return rows.map(row2entity);
    } else {
      return [];
    }
  });
};


/**
 * 把记录row转换为entity，便于业务处理
 */
const row2entity = function(o) {
  let e = new App.ClansmanEntity();
  e._id=o._id;
  e.name = o.name;
  e.gender = o.gender;
  e.mobile = o.mobile; 
  e.birthday = o.birthday;
  e.liveWhere = o.liveWhere;
  e.recentPhotoURL = o.recentPhotoURL;
  e.fatherId = o.fatherId;
  e.motherId = o.motherId;
  e.currentMateId = o.currentMateId;
  e.childOrder = o.childOrder;
  e.createTime = o.createTime;
  e.myAppellation = o.myAppellation;
  e.relationFromMe = o.relationFromMe; 
  cache.put(e._id, e);
  return e;
};

const entity2row=function(e){
  return {
    //必须项
    _id:e._id,
    name:e.name,
    mobile :e.mobile||null,
    gender:e.gender,
    relationFromMe: e.relationFromMe||"",
    myAppellation: e.myAppellation,
    //可选项
    birthday: e.birthday || null,
    _birthday: Date.getMonthDay(e.birthday),
    liveWhere :e.liveWhere || null,
    recentPhotoURL :e.recentPhotoURL || null,
    fatherId: Object.ifNOU(e.fatherId, null),
    motherId :Object.ifNOU(e.motherId, null),
    currentMateId : Object.ifNOU(e.currentMateId, null) ,
    previousSiblingId: e.previousSiblingId || null,
    nextSiblingId :e.nextSiblingId || null,
    childOrder :e.childOrder || 0,
    createTime :e.createTime || new Date(),
  }

  
};



module.exports = ClansmanDao;