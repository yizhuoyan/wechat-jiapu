let fromPage = null;
const service = App.clansmanService();
const Assert = App.Assert;
let id;
Page({
  data: {
    endBirthday: Date.formatDate(new Date())
  },

  onLoad: function (options) {
    id = options.id;
    let pages = getCurrentPages();
    //获取上一个page
    fromPage = pages[pages.length - 2];
    service.load(id).then(cm => {
      this.setData(cm);
    });
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
  handleBirthDayChange: function (evt) {
    let newValue = evt.detail.value;
    this.setData({
      birthday: newValue
    });
  },
  handleFormSubmit: function (evt) {
    const formData = evt.detail.value;
    formData.recentPhotoURL = this.data.recentPhotoURL;
    const ao = validateFormData2ao(formData);
    if (!ao) {
      return;
    }
    //save

    wx.showLoading({
      title: '处理中'
    });

    service.modClansman(id, ao).then(man => {
      wx.hideLoading();
      wx.showToast({
        title: "修改母亲成功!"
      });
      setTimeout(function () {
        wx.navigateBack();
      }, 1000);

    }).catch(e => {
      wx.hideLoading();
      App.handleError(e);
    });
  },
  handleBackBtnTap: function () {
    wx.navigateBack();
  }
});

let notifyFromPage = function (father) {
  //回调
  if (fromPage && fromPage.onFatherReady) {
    fromPage.onFatherReady(father);

  }

};

const validateFormData2ao = function (data) {
  try {
    let name = Assert.stringNotBlank("父亲姓名必须填写", data.name);
    Assert.isTrue("父亲姓名应该两个字或以上", name.length >= 2);

    let birthday = data.birthday;

    let mobile = String.trim(data.mobile);
    if (mobile) {
      Assert.isMobileNumber("手机号码格式不正确", mobile);
    }
    let liveWhere = String.trim(data.liveWhere);
    let recentPhotoURL = String.trim(data.recentPhotoURL);



    return {
      name,
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

