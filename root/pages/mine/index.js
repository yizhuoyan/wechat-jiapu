const service = App.clansmanService();

Page({
  data: {
    clansmanName:null
  },
  onLoad: function () {
    getApp().getUserInfo().then(user=>{
      this.setData({
        userInfo:user
      });
      service.load(user.unionid).then(man=>{
        this.setData({clansmanName:man.name})
      })
    });

  }
});
