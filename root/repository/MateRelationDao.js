const COLLECTION_TYPE = "rel-mate";

function MateRelationDao() {
  this.db = wx.cloud.database();
};

MateRelationDao.prototype.insert=function(e){
  return this.db.collection(COLLECTION_TYPE).add({
    data: entity2row(e)
  }).then(res => {
    e._id = res._id;
    return e;
  });
};
MateRelationDao.prototype.delete = function (_id) {
  return this.db.collection(COLLECTION_TYPE).doc(_id)
    .remove().then(res => {
      return res.stats.updated===1;
    });
};

MateRelationDao.prototype.deleteByHusbandAndWife = function (hid,wid) {

  return this.db.collection(COLLECTION_TYPE).where({
    husbandId:hid,
    wifeId:wid
  }).get().then(res=>{
    const rows = res.data;
    if (rows && rows.length) {
      return this.delete(rows[0]._id);
    }else{
      return false;
    }
  })
};

MateRelationDao.prototype.deleteByWifeId = function (_id) {
  return this.db.collection(COLLECTION_TYPE).doc(_id)
    .remove().then(res => {
      return res.stats.updated;
    });
};

MateRelationDao.prototype.selectWifesByHusbandId = function (hid) {
  return this.db.collection(COLLECTION_TYPE)
    .where({
      husbandId:hid
    }).orderBy("wifeSeq","asc").get().then(res => {
      const rows = res.data;
      if (rows && rows.length) {
        return rows.map(row => row.wifeId);
      } else {
        return [];
      }
    });
};

MateRelationDao.prototype.selectHusbandsByWifeId = function (wid) {
  
  return this.db.collection(COLLECTION_TYPE)
    .where({
      wifeId: wid
    }).orderBy("husbandSeq", "asc").get().then(res => {
      const rows = res.data;
      if (rows && rows.length) {
        return rows.map(row => row.husbandId);
      } else {
        return [];
      }
    });
};

const entity2row=function(e){
  return {
    husbandId:e.husbandId,
    wifeId:e.wifeId,
    husbandSeq:e.husbandSeq||0,
    wifeSeq:e.wifeSeq||0
  }
};



module.exports = MateRelationDao;