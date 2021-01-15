//加载扩展工具API
require("common/Object");
require("common/String");
require("common/Date");
require("common/Array");
App.Assert = require("common/Assert");



//默认无照片头像
App.noPhotoURL="/images/no-photo.png";

//用户微信账号数据
App.wechartAccount=null;
//用户微信账号唯一id
App.unionid=function(){
  if (App.wechartAccount){
    return App.wechartAccount.unionid;
  }
  throw new Error("无法获取unionid");
};

App({
  onLaunch: function() {
    
    //初始化云开发环境
    wx.cloud.init({
      env:"test-gj990",
      traceUser:false
    });
    //加载实体
    App.ClansmanEntity = require("entity/ClansmanEntity");

    //初始化服务
    App.clansmanService = (function () {
      const ClansmanService = require("service/ClansmanService");
      const s = new ClansmanService();
      return function () {
        return s;
      }
    })();

    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage"],
  });
 

    
  },
  /**
   * 全局获取用户信息方法
   */
  getUserInfo: function() {
    //如果用户存在，则直接返回
    if (App.wechartAccount){
      return Promise.resolve(App.wechartAccount);
    }
    
    return new Promise(function(ok,fail){
      wx.getSetting({
        success:function(res){
          if (!res.authSetting['scope.userInfo']) {
            //跳到授权界面
            wx.redirectTo({
              url: '/pages/authorize/authorize',
            });
            return;
          }
          //获取用户所有信息(头像，昵称，openId，unionId等)
          getUserAllInfo(ok,fail);

        }
      });
    });
  }
  
});
/**
 * 当用户授权后获取用户信息的核心方法
 */
const getUserAllInfo=function(ok,fail){
    // 获取用户信息
    wx.getUserInfo({
      withCredentials:true,
      success:function(userInfoResp){
        App.wechartAccount = userInfoResp.userInfo;
        //调用云函数获取unionId
        wx.cloud.callFunction({
          name: 'getUserOpenId',
          data: {},
          success:function(userUnionIdResp){
            
            App.wechartAccount.unionid = userUnionIdResp.result.unionid;
            
            ok(App.wechartAccount);
          },
          fail:function(e){
            console.log("调用云函数获取unionId",e)
            fail(e);
          }
        });
      }
    });
};
/**
 * 全局处理异常的方法
 */
const AppError=require("common/AppError");

App.handleError=function(e){
  console.error(e);
  if(e instanceof AppError){
    wx.showModal({
      title: "错误",
      content: e.message,
      showCancel: false
    });
  }else{
    wx.showModal({
      title: "提示",
      content: '系统繁忙，请稍后再试。',
      showCancel: false
    });
  }
};
const relationship = require("common/relationship");
App.relationship = relationship;