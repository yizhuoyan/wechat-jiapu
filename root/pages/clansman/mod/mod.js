const service = App.clansmanService();
let id=null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showDeleteBtn:false,
    noPhotoURL: App.noPhotoURL,
      id:null,
      recentPhotoURL:null,
      showText:"",
      fatherId:null,
      motherId:null,
      mateId:null
  },

  onLoad: function (options) {
    id = this.data.id = options.id;
  
  },

  onShow: function () {
    service.load(this.data.id).then(u => {
      this.setData(u);
            
      wx.setNavigationBarTitle({
        title:u.myAppellation+u.name 
      });
    });

    //是否显示删除按钮
    service.countChildren(this.data.id).then(count=>{
      if(count==0){
        this.setData({showDeleteBtn:true});
      }
    })
  },
  handleCheckFatherBtnTap:function(evt){
      wx.navigateTo({
        url: '/pages/clansman/mod-father/mod-father?id='+this.data.fatherId
      });
  },
  handleAddFatherBtnTap: function (evt) {
    wx.navigateTo({
      url: '/pages/clansman/add-father/add-father?id='+id
    });
  },
  
  handleCheckMotherBtnTap: function (evt) {
    wx.navigateTo({
      url: '/pages/clansman/mod-mother/mod-mother?id=' + this.data.motherId
    });
  },
  handleAddMotherBtnTap: function (evt) {
    wx.navigateTo({
      url: '/pages/clansman/add-mother/add-mother?id=' + id
    });
  },
  handleMateManageBtnTap: function (evt) {
    console.log("id",id);
    wx.navigateTo({
      url: '/pages/clansman/mate-manage/list?id=' + id
    });
  },

  handleModBaseBtnTap: function (evt) {
    wx.navigateTo({
      url: '/pages/clansman/mod-base/mod-base?id=' + id
    });
  },
  handleChildrenManageBtnTap:function(evt){
    wx.navigateTo({
      url: '/pages/clansman/children-manage/list?id=' + id
    });
  },
  handleBackBtnTap:function(evt){
      wx.navigateBack();
  },
  handleCheckClantreeBtnTap:function(evt){
    //console.log(id);
    wx.redirectTo({
       url: '/pages/clantree/index?id='+id
     });
     
  },
  handledeleteBtnTap:function(evt){
    wx.showModal({
      title: '警告',
      content: '删除会丢失所有数据，确认删除?',
      success(res){
        if(res.confirm){
          wx.showLoading({
            title: '处理中...'
          });
          doDeleteClansman().then(ok=>{
            wx.hideLoading();
            wx.showModal({
              title: '提示',
              content: '删除成功',
              showCancel: false,
              success(res) {
                wx.navigateBack();
              }
            });
          }).catch(e=>{
            App.handleError(e);
          })

        }
      }
    })
    

  
  },

});

const doDeleteClansman=function() {
  return service.deleteClansman(id);
}