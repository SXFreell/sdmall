const app = getApp()
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        SystemInfo: "",
        navHeight: "",
        user: "",
        array: [],
        openid: '',
    },

    toEditMe() {
        wx.navigateTo({
            url: '../editMe/editMe'
        })
    },

    dsh() {
        wx.navigateTo({
            url: '../myOrder/myOrder?state=待收货'
          })
    },

    qxz() {
        wx.navigateTo({
            url: '../myOrder/myOrder?state=取消中'
          })
    },

    ywc() {
        wx.navigateTo({
            url: '../myOrder/myOrder?state=已完成'
          })
    },

    allorder() {
        wx.navigateTo({
            url: '../myOrder/myOrder?state=全部订单'
          })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // console.log(this.data.SystemInfo)
        this.setData({
            SystemInfo: wx.getSystemInfoSync(),
            user: wx.getStorageSync("user")
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