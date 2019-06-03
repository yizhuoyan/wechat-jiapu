let id;
const service = App.clansmanService();
const MATE_ORDER_ARRAY = Array.matesOrderArray;
Page({

  data: {
    noPhotoURL:App.noPhotoURL,
    mates:null,
    mateOrderArray: MATE_ORDER_ARRAY
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
     id = options.id;
  },
  onShow:function(){
    service.load(id).then(cm => {
      wx.setNavigationBarTitle({
        title: cm.name+'的配偶管理'        
      });
      this.setData({
        gender: cm.gender ? "男" : "女",
        name:cm.name
      });
      cm.loadMates().then(mates => {
        this.setData({ mates });
      });
    });
  },
  onMateAddDone: function (newMate) {
    let mates = this.data.mates;
    mates.push(newMate);
   
    this.setData({ mates });
  },



  handleAddBtnTap: function (evt) {
    
      wx.navigateTo({
        url: 'add-mate/add-mate?id=' + id
      });

  },
  handleMateViewTap: function (evt) {

    let mateId = evt.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: 'mod-mate/mod-mate?id=' + mateId
    });
  },
  onMateModDone:function(mate){
     let mates=this.data.mates.map(m=>m._id===mate._id?mate:m); 
     this.setData({mates});
  },
  handleDeleteBtnTap:function(evt){
    let that=this;
    wx.showModal({
      title: '警告',
      content: '删除后不可恢复，确认删除?',
      success:function(res){
          if(res.confirm){
            console.log(evt);
            let mateId = evt.target.dataset.mateid;
            doDeleteMate.call(that,mateId);
          }
      }
    })

    
  }
});


const doDeleteMate=function(mateId){
  
  wx.showLoading({
    title: '操作中...'
  });
  service.deleteMate(id, mateId).then(resp => {
    wx.hideLoading();
    
    console.log(id,mateId);

    let mates = this.data.mates.filter(m => m._id !== mateId);

    this.setData({ mates });

    wx.showToast({
      title: '操作成功'
    });
  }).catch(e => {
    wx.hideLoading();
    App.handleError(e);
  });
}