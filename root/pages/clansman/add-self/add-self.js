const service = App.clansmanService();
const Assert = App.Assert;

Page({
  data: {
    genderArray:"女,男".split(","),
    myself:{
      name: '',
      mobile: "",
      gender:"0",
      birthday:Date.formatDate(new Date()),
      endBirthday: Date.formatDate(new Date()),
      liveWhere: "",
      recentPhotoURL: null
    },
  },
  onLoad:function(options){
    //获取微信账号性别
    getApp().getUserInfo().then(u=>{
      //默认男性(未知默认男性)
      let myselfGender="1";
      //女性
      if(u.gender===2){
        myselfGender="0";
      }
      //国家省市
      let liveWhere=[];
      liveWhere.push(u.country||"");
      liveWhere.push(u.province||"");
      liveWhere.push(u.city||"");
      this.setData({
        "myself.gender": myselfGender,
        "myself.liveWhere":liveWhere.join("")
      });
    });
  },
  handleSelectRecentPhoto: function () {
    wx.chooseImage({
      count: 1,
      success: (res) => {
        this.setData({
          "myself.recentPhotoURL": res.tempFilePaths[0]
        });
      }
    });
  },
  handleBirthDayChange: function (evt) {
    let newValue = evt.detail.value;
    this.setData({
      "myself.birthday": newValue      
    });
  },
  handleGenderChange: function (evt) {
    let newValue = evt.detail.value;
    this.setData({
      "myself.gender": newValue
      
    })
  },
  
  handleFormSubmit: function (evt) {
    const formData = evt.detail.value;
    formData.recentPhotoURL = this.data.myself.recentPhotoURL;
    const ao = validateFormData2ao(formData);
    if (ao) {
      wx.showLoading({
        title: '处理中',
      });
      service.addMyself(ao).then(myself=>{
        wx.hideLoading();
        wx.showToast({
          title: "录入成功!"
        });
       
        setTimeout(function(){
          wx.redirectTo({
            url: 'add-self2?id=' + myself._id
          })
        },500);
        
      }).catch(err=>{
        wx.hideLoading();
        App.handleError(err);
      })
    }
  },
 
});


const validateFormData2ao = function (data) {
  try {
    let name = Assert.stringNotBlank("我的姓名必须填写", data.name);
    Assert.isTrue("我的姓名应该两个字或以上", name.length >= 2);
    let gender=data.gender;
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

