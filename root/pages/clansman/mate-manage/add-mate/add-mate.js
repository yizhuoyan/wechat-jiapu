const MATE_ORDER_ARRAY = Array.matesOrderArray;
const Assert = App.Assert;
const service = App.clansmanService();
let id;
Page({

 data: {
    genderArray: "女,男".split(","),
    mateOrderArray: MATE_ORDER_ARRAY,
    mateOrder: 0,
    name: '',
    mobile: "",
   gender: "0",
   endBirthday: Date.formatDate(new Date()),
    birthday: Date.formatDate(new Date()),
    liveWhere: "",
    recentPhotoURL: null
  },
  onLoad: function(options) {
    id=options.id;
    service.load(id).then(cm=>{
      //配偶应该年龄相当
      this.setData({
        birthday: cm.birthday,
        liveWhere:cm.liveWhere
      })
    })
  },
  handleSelectRecentPhoto: function () {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({
          recentPhotoURL: res.tempFilePaths[0]
        });
      }
    });
  },
  handleMateOrderChange:function(evt){
    let newValue = evt.detail.value;
    this.setData({
      "mateOrder": newValue
    })
  },
  handleBirthDayChange: function (evt) {
    let newValue = evt.detail.value;
    this.setData({
      birthday: newValue
    })
  },
  handleFormSubmit: function (evt) {
    const formData = evt.detail.value;
    formData.recentPhotoURL = this.data.recentPhotoURL;
    const ao = validateFormData2ao(formData);
    if (!ao) {
      return;
    }
    wx.showLoading({
      title: '处理中'
    });

    //插入数据
    service.addMate(id,ao).then(man => {
      wx.hideLoading();
      wx.showToast({
        title: "添加配偶成功!"
      });
      setTimeout(function () {
        notifyFromPage(man);
        wx.navigateBack();
      }, 1000);

    }).catch(e => {
      wx.hideLoading();
      App.handleError(e);
    });
  }
  

});

const notifyFromPage=function(newMate) {
  let pages = getCurrentPages();
  let fromPage = pages[pages.length - 2];
  if (fromPage && fromPage.onMateAddDone) {
    fromPage.onMateAddDone(newMate);
  }
}

const validateFormData2ao = function (data) {
  try {
    let name = Assert.stringNotBlank("配偶姓名必须填写", data.name);
    Assert.isTrue("配偶姓名应该两个字或以上", name.length >= 2);
    let mateOrder=data.mateOrder;

    let birthday = data.birthday;

    let mobile = String.trim(data.mobile);
    if (mobile) {
      Assert.isMobileNumber("手机号码格式不正确", mobile);
    }
    let liveWhere = String.trim(data.liveWhere);
    let recentPhotoURL = String.trim(data.recentPhotoURL);
    

    return {
      name,
      mateOrder,
      birthday,
      mobile,
      recentPhotoURL,
      liveWhere

    };
  } catch (e) {
    App.handleError(e);

  }
  return null;
};