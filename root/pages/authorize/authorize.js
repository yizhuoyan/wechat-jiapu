const app=getApp();
Page({

  data: {
    canIUse: wx.canIUse('button.open-type.getUserInfo')
  },
  onLoad: function (options) {

  },
  handleConfirmBtnTap:function(evt){
    let rawData=evt.detail.rawData;
    if(rawData){
      wx.redirectTo({
        url: '/pages/clantree/welcome/welcome'
      })
    }else{
      wx.showModal({
        title: '提示',
        content: '你没有同意授权哦，请确认',
        showCancel:false
        
      })
    }
      
     
  }
 
})