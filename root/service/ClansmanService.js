const ClansmanDao = require("../repository/ClansmanDao");
const MateRelationDao = require("../repository/MateRelationDao");

const FileUploader=require("FileUploader.js");

function ClansmanService() {
  this.manDao = new ClansmanDao();
  this.mateDao=new MateRelationDao();
  this.uploader=new FileUploader();
}


ClansmanService.prototype.updateRecentPhoto=function(file){
  return this.uploader.uploadRecentPhoto(file);
};

ClansmanService.prototype.addClansman=function(ao){
   
  //先上传近照
  const photoURL = ao.recentPhotoURL;
 
  let uploadResult = Promise.resolve(null);
  if (photoURL != null) {
    uploadResult = this.updateRecentPhoto(photoURL);
  }

  return uploadResult.then(url => {
    let e=ao2entity(ao);
    e.recentPhotoURL = url;
    return this.manDao.insert(e);
  });
  return this.manDao.insert(ao);
};

ClansmanService.prototype.modClansman = function (id,ao) {
  
  //特殊处理下性别
  if("gender" in ao){
      ao.gender=ao.gender==="1";
  }
  //console.log(2, ao)
  return this.manDao.selectById(id).then(man=>{
    let map={};
    //获取可修改字段值
    let updateFiledArray ="name,gender,birthday,mobile,liveWhere,recentPhotoURL,fatherId,motherId".split(",");
    for(let i=updateFiledArray.length,f;i-->0;){
        f=updateFiledArray[i];
        
      if(typeof ao[f]!=="undefined"){
       // console.log(man[f],ao[f]);
        //如果旧值和新值不等，则更新
          if(man[f]!==ao[f]){
            map[f]=ao[f];
            man[f]=ao[f];
          }
      }
    }

    //先上传近照
    const newPhotoURL = map.recentPhotoURL;
    let uploadResult = Promise.resolve(man.recentPhotoURL);
    if (newPhotoURL){
       uploadResult = this.updateRecentPhoto(newPhotoURL);
    }
     return uploadResult.then(url=>{
       if (map.recentPhotoURL){
          map.recentPhotoURL = url;
       }
       if(Object.keys(map).length===0){
         return Promise.resolve(man);
       }
       
      return this.manDao.update(id, map).then(yes=>{
        return man;
      });
    });
    
  })
};


ClansmanService.prototype.deleteClansman = function (id) {
   if(!id){
     throw new Error("id未传入");
   }
    return this.manDao.selectById(id).then(man=>{
        //查看是否可以删除
        man.loadChildren().then(count=>{
          if(count===0){
            return Promise.reject(new AppError("存在子女，无法删除"));
          }
          //可以删除
          //删除近照
          if(man.recentPhotoURL){
            this.uploader.deleteFile(man.recentPhotoURL);
          }
          return this.manDao.delete(man._id);
          
        });
        

    })
}
ClansmanService.prototype.addMyself = function(ao) {
  return getApp().getUserInfo().then(user=>{
    ao._id = user.unionid;
    ao.relationFromMe="我";
    ao.myAppellation="自己";
    return this.addClansman(ao);
  });
   
};


/**
 * 添加母亲
 */
ClansmanService.prototype.addMother = function (id,mother) {
  
  //查找当前族人
  return this.manDao.selectById(id).then(cm=>{
    
    mother.relationFromMe = cm.relationFromMe+"的妈妈";
    mother.gender="0";
    return this.addClansman(mother).then(m=>{
      //是否有父亲
      return cm.loadFather().then(father => {
          if(father){
              this.mateDao.insert({
                husbandId:father._id,
                wifeId:m._id
              });
          }
       
          return this.manDao.update(id, { motherId: m._id })

        });
      });
    });
            
   
};

/**
 * 添加父亲
 */
ClansmanService.prototype.addFather = function (id,father) {
  //查找当前族人
  return this.manDao.selectById(id).then(cm => {
    father.relationFromMe = cm.relationFromMe + "的爸爸";
    father.gender="1";
      //新增父亲      
      return this.addClansman(father).then(f=>{
        //是否有母亲
        cm.loadMother().then(mother=>{
          if (mother) {
            //添加配偶关系
            this.mateDao.insert({
              husbandId: f._id,
              wifeId: mother._id
            });
          }
        });
        
        return this.manDao.update(id,{fatherId:f._id});
      });
  });
};

/**
 * 添加配偶
 */
ClansmanService.prototype.addMate = function (_id,mate) {
  return this.manDao.selectById(_id).then(cm=>{
    if(cm.gender){
      mate.relationFromMe = cm.relationFromMe + "的妻子";
    }else{
      mate.relationFromMe = cm.relationFromMe + "的丈夫";
    }
    mate.gender=!cm.gender;
    return this.addClansman(mate).then(mate=>{
      let husbandId=_id,wifeId=mate._id;
      if(mate.gender){ 
          husbandId=mate._id;
          wifeId=_id;
      }
      this.mateDao.insert({husbandId,wifeId});
      return mate;
    });
  });
};

/**
 * 删除配偶
 * @param id
 * @param mateId
 */
ClansmanService.prototype.deleteMate = function (id, mateId) {

  return this.mateDao.deleteByHusbandAndWife(id,mateId).then(yes=>{
    if(!yes){
      this.mateDao.deleteByHusbandAndWife(mateId, id);
    }
    return this.deleteClansman(mateId);
  });
};
/**
 * 修改配偶
 */
ClansmanService.prototype.modMate = function (id,ao) {
   return this.modClansman(id,ao);
};
/**
 * 加载配偶
 */
ClansmanService.prototype.loadMates = function (id) {
  
  return this.manDao.selectById(id).then(man=>{
    if(man.gender){
      return this.mateDao.selectWifesByHusbandId(id).then(idArray => {
        return this.manDao.selectByIds(idArray);
      });
    }else{

      return this.mateDao.selectHusbandsByWifeId(id).then(idArray => {
        console.log("idArray",idArray,id);
        return this.manDao.selectByIds(idArray);
      });
    }
  })  
};

/**
 * 添加子女
 */
ClansmanService.prototype.addChild = function (child) {
   if(!child.fatherId&&!child.motherId){
      throw new Error("节点无父无母");
   }
   let parentId=child.fatherId||child.motherId;
   return this.manDao.selectById(parentId).then(cm=>{
    
    if (child.gender==="1") {
      child.relationFromMe = cm.relationFromMe + "的儿子";
    } else {
      child.relationFromMe = cm.relationFromMe + "的女儿";
    }
    return this.addClansman(child);
  });
  
};
ClansmanService.prototype.countChildren = function (id){
  return this.manDao.selectById(id).then(man=>{
    if(man.gender){
      return this.manDao.count({
          fatherId:id
      });  
    }else{
      return this.manDao.count({
        motherId: id
      });  
    }
    
  });
  
};
ClansmanService.prototype.loadChildren = function (id) {

  return this.manDao.selectById(id).then(man=>{
    if(man.gender){
      return this.manDao.selectMany({
        fatherId:id
      }, [["birthday", "asc"]]);
    }else{
      return this.manDao.selectMany({
        motherId: id
      }, [["birthday", "asc"]]);
    }
  })
};
/**
 * 加载所有老祖宗
 */
ClansmanService.prototype.listRoots = function(id) {
  
  const loadFather=function(dao,id){
    return dao.selectById(id).then(man => {
      
      if(man.fatherId){
        return loadFather(dao, man.fatherId, man.relationInput);
      }
      return man;
    })
  };
  
  return getApp().getUserInfo().then(u=>{
    return loadFather(this.manDao,id||u.unionid);
  });
};

/**
 * 加载一个族人信息
 */
ClansmanService.prototype.load = function(id) {
  const manDao=this.manDao;
  return new Promise(function(ok,fail){
     manDao.selectById(id).then(u=>{
        ok(u);
     }).catch(e=>{
        
        ok(null);
     });
  });
  
};



/**
 * 最近生日家人
 */
ClansmanService.prototype.listRecentBirthday = function () {
    return this.manDao.selectMany();
};

const getAppellation=function(relation){

  let gender = App.wechartAccount.gender;
  let result=App.relationship({
    
    text: relation,
    sex: gender===1 ? 1 : 0,
      reverse: false,
      type: 'default'
    
  });
  if(result.length===0){
      return "未知";
  }
  return result[0];
}






const ao2entity = function (ao) {
  if (!ao) return null;
  const e = new App.ClansmanEntity();
  //必须项
  e._id = ao._id;
  e.name = ao.name;
  e.mobile = ao.mobile;
  e.gender=ao.gender==="1";
  e.relationFromMe = ao.relationFromMe;
  e.myAppellation = getAppellation(ao.relationFromMe);
  //可选项
  e.birthday = ao.birthday || null;

  e.liveWhere = ao.liveWhere || null;
  e.recentPhotoURL = ao.recentPhotoURL || null;
  e.fatherId = Object.ifNOU(ao.fatherId, null);
  e.motherId = Object.ifNOU(ao.motherId, null);
  e.currentMateId = Object.ifNOU(ao.currentMateId, null) ;
  e.previousSiblingId = ao.previousSiblingId || null;
  e.nextSiblingId = ao.nextSiblingId || null;
  e.childOrder = ao.childOrder || 0;
  e.createTime = ao.createTime ||new Date();
  return e;
};

module.exports = ClansmanService;