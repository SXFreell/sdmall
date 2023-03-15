const db = wx.cloud.database();

Page({

    /**
     * 页面的初始数据
     */
    data: {
        SystemInfo: "",
        addressList: []
    },

    editAddress(e) {
        wx.navigateTo({
            url: '../address_detail/address_detail?index='+e.target.dataset.index
        })
    },

    deleteAddress(e) {
        var that = this
        var address = this.data.addressList
        address.splice(e.target.dataset.index, 1)
        this.setData({
            addressList: address
        })
        db.collection("user").doc(wx.getStorageSync('user')._id).update({
            data: {
                address: that.data.addressList
            },
            success: function () {
                db.collection("user").doc(wx.getStorageSync('user')._id).get().then(res => {
                    wx.setStorageSync('user', res.data)
                })
            }
        })
    },

    newAddress() {
        wx.navigateTo({
            url: '../address_detail/address_detail'
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            SystemInfo: wx.getSystemInfoSync()
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
        db.collection("user").doc(wx.getStorageSync('user')._id).get().then(res => {
            this.setData({
                addressList: res.data.address
            })
        })
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