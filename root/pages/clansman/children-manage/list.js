let id;
let parent=null;
const service = App.clansmanService();
Page({

  data: {
    noPhotoURL:App.noPhotoURL,
    children:null
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    id = options.id;

    service.load(id).then(cm=>{
      parent=cm;
      this.setData({name:cm.name})
      cm.loadChildren().then(children=>{
        this.setData({ children});
      });
    });
  },
  onChildrenAdd:function(child){
    let children = this.data.children;
    children.push(child);
    children.sort((a,b)=>{
      return a.birthday > b.birthday;
    });
    this.setData({ children});
  },
  


  handleAddBtnTap:function(evt){
    if(parent.gender){
      wx.navigateTo({
        url: 'add-child/father-add-child?id=' + id
      });
    }else{
      wx.navigateTo({
        url: 'add-child/mother-add-child?id=' + id
      });
    }
      
  },
  handleChildViewTap:function(evt){
    let childId=evt.currentTarget.dataset.id;
    wx.navigateTo({
      url: 'check-child/check-child?id='+childId
    })
  }
})