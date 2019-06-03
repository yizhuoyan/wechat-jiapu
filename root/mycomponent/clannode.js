const ClansmanEntity=App.ClansmanEntity;
const service=App.clansmanService();
Component({
  options: {
    addGlobalClass: true,
  },
  properties: {
    "clansman":Object,
    "index":Number,
    "maxIndex":Number,
    "bootId":String
  },
  data: {

  }, 
  pageLifetimes:{
    show: function () {
      //console.log("node-show");
      updateNodeView.call(this);
    },
    hide: function () {
      //console.log("node-hide");
    },
  },
  lifetimes:{
    attached:function(){
     // console.log("node-attached");
      updateNodeView.call(this);
      
    }
    
  },
  methods: {
    handleMainNodeTap:function(evt){
       let nodeId=evt.currentTarget.dataset.id;
     
      wx.navigateTo({
         url: '/pages/clansman/mod/mod?id='+nodeId
       });
    },
    handleMateNodeTap:function(evt){
      let nodeId = evt.currentTarget.dataset.id;
      wx.navigateTo({
     
        url: '/pages/clansman/mod/mod?id=' + nodeId
      });
    },
    loadData: function (clansman,index,maxIndex) {
        const bootId=this.data.bootId;
        clansman=ClansmanEntity.of(clansman);
     
       //是否是中心节点
       let   nodeCenterClass="";
       if(clansman._id===this.data.bootId){
         nodeCenterClass=" boot-node";
        
         this.setData({nodeCenterClass});
       }else{
       }
      let nodeOrderClass = "";
        //独子
        if(maxIndex===0){
          nodeOrderClass += " only-child";
        }else{
          //老大
          if (index == 0) {
            nodeOrderClass += " first-child";
             //老幺
          }else  if (index=== maxIndex) {
             nodeOrderClass += " last-child";
          }
        }
        
      this.setData({nodeOrderClass});
        //加载配偶
      
      clansman.loadMates().then(mates=>{
       // console.log("mates",mates);
        this.setData({mates});
      }); 
      //加载子女 
      clansman.loadChildren().then(children => {
           //console.log("children",children); 
           this.setData({ children });
        }).catch(e=>{
          console.log(e);
        });
    }
  }
});

const updateNodeView=function(){
  const clansman = this.data.clansman;
  const index = this.data.index;
  const maxIndex = this.data.maxIndex;
  if (clansman) {
    //console.log("attached-clansman",clansman);
    this.loadData(clansman, index, maxIndex);
  }
};