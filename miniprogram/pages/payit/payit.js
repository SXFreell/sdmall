// pages/payit/payit.js
const db = wx.cloud.database();
const _ = db.command

Page({

    /**
     * 页面的初始数据
     */
    data: {
        paylist: {},
        orderid: 0,
        addressList: [],
        address: 0,
        goodslist: [],
        totalpay: 0,
        beizhu: "",
        SystemInfo: "",
        show: false,
        showd: false
    },

    editaddress() {
        this.setData({
            show: true
        });
    },

    selectAddress(data) {
        this.setData({
            address: data.currentTarget.dataset.index,
            show: false
        });
    },

    newAddress() {
        wx.navigateTo({
            url: '../address/address'
        })
    },

    payit() {
        this.setData({
            showd: true
        });
    },

    confirmpay() {
        var that = this;
        var orderinfo = {};
        orderinfo['orderid'] = this.data.orderid;
        orderinfo['totalmoney'] = this.data.totalpay;
        orderinfo['address'] = this.data.addressList[this.data.address];
        orderinfo['goodnum'] = this.data.paylist;
        orderinfo['goodslist'] = this.data.goodslist;
        orderinfo['beizhu'] = this.data.beizhu;
        orderinfo['state'] = "待收货";
        var date = new Date();
        orderinfo['time'] = String(date.getFullYear()) + '-' + String(date.getMonth() + 1) + '-' + String(date.getDate()) + ' ' + String(date.getHours()).padStart(2,'0') + ':' + String(date.getMinutes()).padStart(2,'0') + ':' + String(date.getSeconds()).padStart(2,'0');

        // 此处放通知API



        db.collection('orders').add({
            data: orderinfo,
            success: function (res) {
                db.collection("shoppingcar").where({
                        _openid: wx.getStorageSync('openid')
                    }).get()
                    .then(res => {
                        var nowcarlist = res.data[0].cartlist;
                        for (let i = 0; i < nowcarlist.length; i++) {
                            if (nowcarlist[i].good_id in that.data.paylist) {
                                nowcarlist.splice(i, 1);
                                i--;
                            }
                        }
                        db.collection("shoppingcar").doc(res.data[0]._id).set({
                            data: {
                                cartlist: nowcarlist
                            },
                            success: function (res) {
                                wx.navigateBack();
                            }
                        })
                    })
            }
        })
    },

    onClose() {
        this.setData({
            show: false
        });
    },

    onClosed() {
        this.setData({
            showd: false
        });
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.setData({
            SystemInfo: wx.getSystemInfoSync(),
        });
        var that = this;
        const eventChannel = this.getOpenerEventChannel()
        // eventChannel.emit('acceptDataFromOpenedPage', {data: 'test'});
        // eventChannel.emit('someEvent', {data: 'test'});
        // 监听 acceptDataFromOpenerPage 事件，获取上一页面通过 eventChannel 传送到当前页面的数据
        eventChannel.on('acceptDataFromOpenerPage', function (data) {
            that.setData({
                paylist: data['paylist'],
                orderid: parseInt(options.orderid)
            });
            var goodslist = Object.keys(data['paylist'])
            db.collection('good').where({
                    // gt 方法用于指定一个 "大于" 条件，此处 _.gt(30) 是一个 "大于 30" 的条件
                    code: _.in(goodslist)
                })
                .get({
                    success: function (res) {
                        var goods = res.data;
                        goods.sort((a, b) => {
                            return goodslist.indexOf(a.code) - goodslist.indexOf(b.code);
                        })
                        var totalpay = 0;
                        for (let i of goods) {
                            totalpay += i['price'] * data['paylist'][i['code']];
                        }
                        that.setData({
                            goodslist: goods,
                            totalpay: totalpay
                        });
                    }
                })
        })
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady() {

    },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow() {
        db.collection("user").doc(wx.getStorageSync('user')._id).get().then(res => {
            var tempaddress = res.data.address;
            var nowaddressid = 0;
            for (let i = 0; i < tempaddress.length; i++) {
                if (tempaddress[i]["default"]) {
                    nowaddressid = i;
                    break;
                }
            }
            this.setData({
                addressList: res.data.address,
                address: nowaddressid
            })
        })
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide() {

    },

    /**
     * 生命周期函数--监听页面卸载
     */
    onUnload() {

    },

    /**
     * 页面相关事件处理函数--监听用户下拉动作
     */
    onPullDownRefresh() {

    },

    /**
     * 页面上拉触底事件的处理函数
     */
    onReachBottom() {

    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage() {

    }
})