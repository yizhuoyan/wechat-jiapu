const service = App.clansmanService();

Page({
  data: {
    
  },

  /**
   * Lifecycle function--Called when page load
   */
  onLoad: function(options) {
    getApp().getUserInfo().then(user => {
      this.setData({
        avatar:user.avatarUrl,
        nickName:user.nickName
      });
    });
  },
  
  handleCreateMyClantreeBtnTap: function(evt) {
    wx.redirectTo({
      url: '/pages/clansman/add-self/add-self'
    });
  }
});


