let id;
const Assert = App.Assert;
const service = App.clansmanService();
Page({

  data: {
    disabledSubmit:true,
    genderArray: "女,男".split(","),
    motherIndex: 0,
    motherArray:[],
    motherNameArray:["加载中..."],
    gender: "0",
    name: '',
    mobile: "",
    endBirthday: Date.formatDate(new Date()),
    birthday: Date.formatDate(new Date()),
    liveWhere: "",
    recentPhotoURL: null
  },
  onLoad: function (options) {
    id=options.id;
    service.load(id).then(father=>{
      this.setData({
        fatherName: father.name,
        name:father.name.charAt(0),
        birthday: Date.changeYear(father.birthday, 20),
        liveWhere:father.liveWhere
      });
        father.loadMates().then(mates=>{
          this.setData({
              motherArray: mates,
              motherNameArray:mates.map(m=>m.name),
              disabledSubmit:false
            });
        });
        
      });
    
  },
  handleMotherChange:function(evt){
    let newValue = evt.detail.value;
    this.setData({
      "motherIndex": newValue
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
  handleGenderChange: function (evt) {
    let newValue = evt.detail.value;
    this.setData({
      "gender": newValue
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
    formData.fatherId = id;
    let selectMate = this.data.motherArray[this.data.motherIndex];
    if (selectMate){
      formData.motherId =selectMate._id;
    }
    
    const ao = validateFormData2ao(formData);
      if (!ao) {
        return;
      }
      
      
      wx.showLoading({
        title: '处理中'
      });
          
      //插入数据
      service.addChild(ao).then(man => {
        wx.hideLoading();
        wx.showToast({
          title: "添加成功!"
        });
        this.nofifyOtherPage(man);
        setTimeout(function () {
          wx.navigateBack();
        }, 1000);

      }).catch(e => {
        wx.hideLoading();
        App.handleError(e);
      });
     
  },
  nofifyOtherPage: function (newChild){
    let pages = getCurrentPages();
    let fromPage = pages[pages.length - 2];
    if (fromPage && fromPage.onChildrenAdd) {
      fromPage.onChildrenAdd(newChild);
    }
    
  }
  

});



const validateFormData2ao = function (data) {
  try {

    let motherId = data.motherId;

    let fatherId=data.fatherId;

    let name = Assert.stringNotBlank("子女姓名必须填写", data.name);
    Assert.isTrue("子女姓名应该两个字或以上", name.length >= 2);
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
      liveWhere,
      motherId,
      fatherId
    };
  } catch (e) {
    App.handleError(e);

  }
  return null;
};