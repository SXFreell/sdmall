const db = wx.cloud.database();
// import Toast from '../../vant/miniprogram_npm/@vant/weapp/dist/toast/toast';
Page({

    /**
     * 页面的初始数据
     */
    data: {
        allOrder: [],
        columns: ['待收货', '取消中', '已取消', '已完成'],
        show: false,
        active: "待收货",
        orderId: "",
    },

    updateOrders() {
        var that = this;
        wx.cloud.callFunction({
            name: "getOrdersByOpenid",
            data: {
                openid: 'all'
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

    onClose() {
        this.setData({
            show: false
        });
    },

    changeOrder(data) {
        var index = data.currentTarget.dataset.index;
        var _id = this.data.allOrder[index]._id;
        this.setData({
            show: true,
            orderId: _id
        });
    },

    confirmChange(data) {
        var that = this;
        db.collection('orders').doc(that.data.orderId).update({
            data: {
                state: data.detail.value
            },
            success: function (res) {
                that.setData({
                    show: false,
                    orderId: ""
                });
                that.updateOrders();
                // 这里发送消息到指定账户
            }
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