const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        SystemInfo: "",
        active: "待收货",
        allOrder: [],
    },

    updateOrders() {
        var that = this;
        wx.cloud.callFunction({
            name: "getOrdersByOpenid",
            data: {
                openid: wx.getStorageSync('openid')
            },
            success(res) {
                var allData = res.result.data;
                that.setData({
                    allOrder: allData
                })
            }
        })
    },

    onChange(event) {
        this.setData({
            active: event.detail.name
        })
    },

    cancelOrder(data) {
        var that = this;
        var index = data.currentTarget.dataset.index;
        var _id = this.data.allOrder[index]._id;
        wx.showModal({
            title: '提示',
            content: '是否提交取消申请',
            success(res) {
                if (res.confirm) {
                    db.collection('orders').doc(_id).update({
                        data: {
                            state: '取消中'
                        },
                        success: function (res) {
                            that.updateOrders();
                            // 这里发送消息到指定账户
                        }
                    })
                }
            }
        })
    },


    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        if(options.state) {
            this.setData({
                active: options.state,
            });
        }
        this.setData({
            SystemInfo: wx.getSystemInfoSync(),
        });
        this.updateOrders();
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