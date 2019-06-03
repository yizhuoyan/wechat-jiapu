const app = getApp();
const service = App.clansmanService();

Page({
  data: {
    roots:[],
    bootId:null
  },
  onLoad:function(options){

    this.data.bootId = options.id;
    
  },
 
  onShow: function () {
    //console.log("page-show");
    loadTree.call(this,this.data.bootId);
  },
  handleBackMyClansBtnTap: function () {
      wx.switchTab({
        url: '/pages/clantree/my'
      });
  }
  
});

const loadTree = function (bootId){
  service.listRoots(bootId).then(root => {
    console.log("root", root);
    if (root) {
      this.setData({
        roots: [root],
        bootId: bootId
      });
    } else {
      //跳转添加页面
      wx.redirectTo({
        url: '/pages/mine/add-self/add-self'
      })
    }
  });
};
