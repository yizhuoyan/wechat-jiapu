
const relationship=App.relationship;

Page({
  data: {
    input: "我",
    result: "",
    reverse:false,
    needReset:false,
    firstGender:true,
    currentGender:true
  },
  reset:function(){
    this.data.currentGender = this.data.firstGender;
    this.data.needReset = false;
    
    this.setData({ input: "我", result: "",reverse:false });
  },
  handleGenderSwitchChange: function (evt) {
    
    this.setData({
      firstGender: !this.data.firstGender
    });
    this.reset();
  },
  handleHelpBtnTap: function (evt) {
    wx.navigateTo({
      url: '/pages/appellation/help',
    });
  },
  handleInverseBtnTap: function (evt) {
    if(this.data.needReset){
      this.reset();
      
    }
    const input=this.data.input;
    if(input==="我"){
        return;
    }
    let result = relationship({ 
        text: this.data.input,
        sex: this.data.firstGender?1:0,
        reverse: !this.data.reverse,
        type: 'default' });

    if(result.length===0){
      result="太复杂，无法算出来。"
      this.data.needReset=true;
      
    }  
    
    this.setData({ result, reverse: !this.data.reverse});    
  },  
  handleHusbandBtnTap:function(evt){
    if(this.data.currentGender){
       return;
    }
    this.data.currentGender=true;
 
    this.handleAppellationBtnTap(evt);

  },
  handleWifeBtnTap: function (evt) {
    if (!this.data.currentGender) {
      return;
    }
    this.data.currentGender = false;
    this.handleAppellationBtnTap(evt);
  },

  handleBackBtnTap:function(){
    let input = this.data.input;
    //只有 "我" 则不处理
    if (input === "我") {
      return;
    }
    input = input.substring(0, input.length - 3);
    //需要重新计算关系
    const result = relationship({
      text: input,
      sex: this.data.firstGender?1:0,
      reverse: false,
      type: 'default'
    });
    this.setData({ input, result });
  },
  handleClearBtnTap:function(evt){
    this.reset();
  },
  /**
   * 点击按钮事件
   */
  handleAppellationBtnTap: function (evt) {
    
    const appellation = evt.target.dataset.value;
    if (!appellation){
        return;
    }
    
    if (this.data.needReset) {
      this.reset();
    }
    this.data.currentGender = evt.target.dataset.gender==="1";
    
    let input = this.data.input + "的" + appellation;
    let result = relationship({
        text: input,
      sex: this.data.firstGender?1:0,
        reverse: false,
        type: 'default'});

    
    if(result.length===0){
        result="关系太遥远了，男的叫帅哥，女的叫美女吧!";
        this.data.needReset = true;
    }
    this.setData({ input, result });
  }
  
});

