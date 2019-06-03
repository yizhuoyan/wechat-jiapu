const app = getApp();
const service = App.clansmanService();

Page({
  data: {
    roots:[],
    bootId:null
  },
  onLoad:function(){
    getApp().getUserInfo().then(user => {
      console.log("登录用户", user);
      //是否已有家谱树
      hasClanstree(user).then(yes => {
        if (!yes) {
          //否则展示欢迎界面
          wx.redirectTo({
            url: 'welcome/welcome'
          });
        }else{
          this.data.bootId=user.unionid;
          wx.startPullDownRefresh();
        }
      });
    });
   
  },

  onHide:function(){
    //console.log("page-hide");
  },
  onPullDownRefresh:function(){
    this.setData({roots:[]});
    wx.showLoading({
      title: '加载中...',
      icon: 'loading'
    });
    
    loadTree.call(this, this.data.bootId).then(done=>{
      wx.stopPullDownRefresh();
      wx.hideLoading();
    });
  }
  
});

const loadTree = function (bootId) {
  return service.listRoots(bootId).then(root => {
    console.log("root", root._id+"("+root.name+")");
    if (root) {
      this.setData({
        roots: [root],
        bootId: bootId
      });
      return true;
    } else {
      //跳转添加页面
      wx.redirectTo({
        url: '/pages/mine/add-self/add-self'
      })
    }
    return false;
  });
};

/**是否已有家谱树 */
const hasClanstree = function (user) {
  return service.load(user.unionid).then(u => {
    return u != null;
  });
};