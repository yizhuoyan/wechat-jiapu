const service = App.clansmanService();
let id = null;
Page({

  /**
   * 页面的初始数据
   */
  data: {
    noPhotoURL: App.noPhotoURL,
    id: null,
    recentPhotoURL: null,
    showText: "",
    fatherId: null,
    motherId: null,
    mateId: null
  },

  onLoad: function (options) {
    id = this.data.id = options.id;
  },

  onShow: function () {
    service.load(this.data.id).then(u => {

      this.setData(u);
      
    });
  },
  handleCheckFatherBtnTap: function (evt) {
    wx.navigateTo({
      url: '/pages/clansman/mod-father/mod-father?id=' + this.data.fatherId
    });
  },
  handleAddFatherBtnTap: function (evt) {
    wx.navigateTo({
      url: '/pages/clansman/add-father/add-father?id=' + id
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
    console.log("id", id);
    wx.navigateTo({
      url: '/pages/clansman/mate-manage/list?id=' + id
    });
  },

  handleModBaseBtnTap: function (evt) {
    wx.navigateTo({
      url: '/pages/clansman/mod-base/mod-base?id=' + id
    });
  },
  handleChildrenManageBtnTap: function (evt) {
    wx.navigateTo({
      url: '/pages/clansman/children-manage/list?id=' + id
    });
  },
  handleBackBtnTap: function (evt) {
    wx.navigateBack();
  },
  handleCheckClantreeBtnTap: function (evt) {
    wx.switchTab({
      url: '/pages/clantree/my'
    });

  }





})