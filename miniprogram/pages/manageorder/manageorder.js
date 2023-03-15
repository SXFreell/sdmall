const app = getApp();
const db = wx.cloud.database();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:[],
    openid:'',
    Money:0
  },

  // 送货
  songhuo(res){
    var that = this;
   
    var tid = res.currentTarget.dataset.id;
  
    //var productAll = JSON.stringify(product);
   
    db.collection('order').doc(tid).update({
    data:{
        state:"待收货"
     },
     success: function(res) {
    }
    })
    wx.navigateTo({
      url: '../manageorder/manageorder'
    })

  },

  // 一键清空
  deleteAll(res){
    var that = this;
    var array = that.data.array;
    for(var i = 0; i < array.length; i++){
      wx.cloud.callFunction({
        name:'delete',
        data:{
          id:array[i]._id
        },
        success(res){
          that.onLoad();
          wx.showToast({
            title: '删除成功',
          })
        },
        fail(res){
          console.log("删除失败",res);
        }
      })
    }
  },

  // 选中或不选
  checked(res){
    var that = this;
    var checked = res.detail.value;
    var id = res.currentTarget.dataset.id;
    if(checked.length == 0){
      for(var i = 0; i < that.data.array.length; i++){
          if(that.data.array[i]._id == id){
            that.data.array[i].checked = false;
            that.setData({
              array:that.data.array
            })
            that.countMoney();
          }
      }
    }else {
      for(var i = 0; i < that.data.array.length; i++){
        if(that.data.array[i]._id == id){
          that.data.array[i].checked = true;
          that.setData({
            array:that.data.array
          })
          that.countMoney();
        }
    }
    }
  },

  // 减少商品数量
  reduce(res){
    var that = this;
    var id = res.currentTarget.dataset.id;
    var array = that.data.array;
    for(var i = 0; i < array.length; i++){
      if(array[i]._id == id){
        if(array[i].goods_number <= 1 ){
          wx.showToast({
            title: '已经最少了',
          })
          break;
        }
        array[i].goods_number = array[i].goods_number - 1;
        that.setData({
          array:array
        })
        that.countMoney();
      }
    }
  },

  // 增加商品数量
  add(res){
    var that  = this;
    var id = res.currentTarget.dataset.id;
    var array = that.data.array;
    for(var i = 0; i < array.length; i++){
      if(array[i]._id == id){
        array[i].goods_number= array[i].goods_number + 1;
        that.setData({
          array:array
        })
        that.countMoney();
      }
    }
  },
  countMoney(){
    var that = this;
    var array = that.data.array;
    var Money = 0;
    for(var i = 0; i < array.length; i++){
      if(array[i].checked == true){
        Money += array[i].goods_price * array[i].goods_number;
      }
    }
    that.setData({
      Money:Money
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var orderlist=[];
       var array = [];
  



      
        db.collection('order').where({
          state:'未处理',
            }).get().then(res => {
          this.setData({
            orderlist: res.data
               })
              
              })

  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.onLoad();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})