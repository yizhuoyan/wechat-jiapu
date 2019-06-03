
const service = App.clansmanService();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noPhotoURL: App.noPhotoURL,
    rows:null
  },
  onLoad:function(){
    service.listRecentBirthday().then(rows=>{
      rows = rows.map(entity2vo).sort((a,b)=>{
        if(a.whenDay===b.whenDay){
            return 0;
        }
        if(a.whenDay===0){
          return -1;
        }
        if (b.whenDay === 0) {
          return 1;
        }
        
        return a.whenDay-b.whenDay;
      });
      this.setData({ rows})
    });
  },
  handleBackBtnTap:function(){
    wx.navigateBack();
  }

});

const entity2vo=function(e){
  let name=e.myAppellation+e.name;
  let birthday=e.birthday;
  const now=new Date();
  const birthdayms = Date.parse(birthday);
  let birthdayDate = new Date(birthdayms);
  birthdayDate.setFullYear(now.getFullYear());
  let whenDay=Date.betweenDay(birthdayDate,now);
  let when=null;
  if (whenDay===0){
    when="今天";
  }else if(whenDay>0){
    when=whenDay+"天后";
  }else{
    //已过去了，算下一年
    birthdayDate.setFullYear(now.getFullYear()+1);
    whenDay = Date.betweenDay(birthdayDate, now);
    when=whenDay+"天后";
  }
  const recentPhotoURL=e.recentPhotoURL;
  let age = Date.getAge(new Date(birthdayms));

  return {
    recentPhotoURL,
    name,
    birthday,
    whenDay,
    when,
    age
  }
};