

const service = App.clansmanService();
const Assert = App.Assert;

let id;

Page({
  data: {

    genderArray: "女,男".split(","),
    gender: "0",
    birthday: null,
    endBirthday: Date.formatDate(new Date()),
  },
  onLoad: function (options) {
    id = options.id;
    service.load(id).then(cm => {
      this.setData({
        name: cm.name,
        gender: cm.gender ? "1" : "0",
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
      service.modClansman(id, ao).then(resp => {

        wx.showToast({
          title: "修改成功!"
        });

        setTimeout(function () {
          wx.navigateBack();
        }, 500);

      }).catch(err => {
        App.handleError(err);
      });
    }
  },
  handleBackBtnTap:function(evt){
    wx.navigateBack();
  }
});


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