const service = App.clansmanService();
const Assert = App.Assert;
const MATE_ORDER_ARRAY = Array.matesOrderArray;
let id;

Page({
  data: {

    genderArray: "女,男".split(","),
    mateOrderArray: MATE_ORDER_ARRAY,
    mateOrder: 0,
    endBirthday: Date.formatDate(new Date()),
    gender: "0"
    

  },
  onLoad: function (options) {
    id = options.id;
    service.load(id).then(cm => {
      this.setData({
        name: cm.name,
        gender: cm.gender ?"1" : "0",
        birthday: cm.birthday,
        mobile: cm.mobile,
        liveWhere: cm.liveWhere,
        recentPhotoURL: cm.recentPhotoURL
      });
    });
  },
  handleSelectRecentPhoto: function () {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({
          "recentPhotoURL": res.tempFilePaths
        });
      }
    });
  },
  handleMateOrderChange: function (evt) {
    let newValue = evt.detail.value;
    this.setData({
      "mateOrder": newValue
    });
  },
  handleBirthDayChange: function (evt) {
    let newValue = evt.detail.value;
    this.setData({
      "birthday": newValue

    })
  },
  handleGenderChange: function (evt) {
    let newValue = evt.detail.value;
    this.setData({
      "gender": newValue
    })
  },

  handleFormSubmit: function (evt) {
    const formData = evt.detail.value;
    formData.recentPhotoURL = this.data.recentPhotoURL;
    const ao = validateFormData2ao(formData);
    if (ao) {
      wx.showLoading({
        title: '操作中...',
      });
      service.modMate(id, ao).then(newMate => {
        wx.hideLoading();
        wx.showToast({
          title: "修改成功!"
        });

        setTimeout(function () {
          notifyFromPage(newMate);
          wx.navigateBack();
        }, 500);

      }).catch(err => {
        wx.hideLoading();
        App.handleError(err);
      });
    }
  },
  handleBackBtnTap:function(){
    wx.navigateBack();
  }
});
const notifyFromPage = function (newMate) {
  let pages = getCurrentPages();
  let fromPage = pages[pages.length - 2];
  if (fromPage && fromPage.onMateModDone) {
    fromPage.onMateModDone(newMate);

  }
}

const validateFormData2ao = function (data) {
  try {
    let name = Assert.stringNotBlank("姓名必须填写", data.name);
    Assert.isTrue("姓名应该两个字或以上", name.length >= 2);
    let gender = data.gender;
    let birthday = data.birthday;

    let mobile = String.trim(data.mobile);
    if (mobile) {
      Assert.isMobileNumber("手机号码格式不正确", mobile);
    }
    let liveWhere = String.trim(data.liveWhere);
    let recentPhotoURL = String.trim(data.recentPhotoURL);


    return {
      name,
      gender,
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