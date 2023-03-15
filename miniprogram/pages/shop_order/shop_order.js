const db = wx.cloud.database();
const util = require('../util.js');
Page({

  /**
   * 页面的初始数据
   */
  data: {
    array:[],
    product:[],
    allMoney:0,
    openid:''
  },

  // 支付
  pay(res){
    var that = this;
    var time = Date.parse(new Date());
    // var num = Math.floor(Math.random()*1000);
    var id = time/1000 ;
    console.log(id);
    var timeNow = util.formatTime(new Date());
    var productName = that.data.product[0].name + ' x ' + that.data.product[0].num;
    for(var x = 1; x < that.data.product.length; x++){
      productName += ' '+that.data.product[x].name + ' x ' + that.data.product[x].num
    }
    console.log(productName);
    for(var i = 0; i < that.data.product.length; i++){
      wx.cloud.callFunction({
        name:'delete',
        data:{
          id:that.data.product[i]._id
        },
        success(res){
          console.log("删除成功");
        },
        fail(res){
          console.log("失败",res)
        }
      })
    }


    if (wx.requestSubscribeMessage) {
      wx.requestSubscribeMessage({
          tmplIds: ["oQBPz5LPnspKVPI_TyyRIe6n48fg"],
          success: function(res) {
              wx.showToast({
                  title: '订阅OK！',
              });
              console.log(res)
          },
          fail(err) {
              wx.showToast({
                  title: '订阅失败！',
              })
              console.log(err)
          }
      });
  } else {
      // 如果希望用户在最新版本的客户端上体验您的小程序，可以这样子提示
      wx.showModal({
          title: '提示',
          content: '当前微信版本过低，无法使用订阅功能，请升级到最新微信版本后重试。'
      })
  }


    db.collection("order").add({
      data:{
        id:id,
        product:that.data.product,
        address:that.data.array,
        time:timeNow,
        state:'未处理',
        allMoney:that.data.allMoney
      },
      success(res){
        console.log("订单成功上传");
        wx.showToast({
          title: '支付成功',
          duration:3000,
          success(res){
            wx.switchTab({
              url: '../me/me',
            })
          }
        })
      },
      fail(res){
        console.log("订单上传失败",res);
      }
    })
   
   

   
   
   // wx.requestSubscribeMessage({
   //    tmplIds: ['oQBPz5JOLsGSb-2vfIT9M-ftlrAI'],
    //   success(res){
    //     wx.cloud.callFunction({
    //       name:'WxTuiSong',
    //       data:{
    //         openid:that.data.openid,
     //        id:id,
      //       name:that.data.array.name,
       //      address:that.data.array.address,
      //     productName:productName,
       //      phoneNum:that.data.array.phoneNum
      //     },
       //    success(res){
        //     console.log("推送成功");
           
        //   },
       //    fail(res){
        //     console.log("推送失败",res);
        //   }
      //   })
     //  }
    // })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    var array = JSON.parse(options.array);
    console.log("推送dh",array);
    var productAll = JSON.parse(options.productAll);
    var product = [];
    var allMoney = 0;
    console.log("商品:",productAll);
   
    for(var i = 0; i < productAll.length; i++){
      product.push(JSON.parse(productAll[i]))
    }
    console.log("product",product);
    console.log("dshao:",product.length);
    for(var x = 0; x < product.length; x++){
      allMoney += parseInt(product[x].goods_price) * product[x].goods_number;
    }
    console.log(allMoney);
    
    that.setData({
      array:array,
      product:product,
      allMoney:allMoney
    })
    wx.cloud.callFunction({
      name:'OpenId',
      success(res){
        that.setData({
          openid:res.result.openid
        })
      }
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