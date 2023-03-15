const app = getApp();
const db = wx.cloud.database();
const _ = db.command
Page({

    /**
     * 页面的初始数据
     */
    data: {
        SystemInfo: "",
        checkedAll: false,
        result: [],
        cartList: [],
        goodsInfo: {},
        totalMoney: 0
    },

    // 全选
    onChangeSA(event) {
        var cartList = this.data.cartList
        var result = []
        if (event.detail) {
            for (let i of cartList) {
                if(this.data.goodsInfo[i.good_id].shangJia){
                    result.push(i.good_id)
                }
            }
        }
        this.setData({
            checkedAll: event.detail,
            result: result
        })
        this.countMoney()
    },

    // 勾选复选框
    onChangeMain(event) {
        this.setData({
            result: event.detail,
        });
        this.countMoney()
    },


    // 更改商品数量
    numChange(e) {
        var good_id = e.currentTarget.dataset.good
        var cartList = this.data.cartList
        for (let i = 0; i < cartList.length; i++) {
            if (cartList[i].good_id == good_id) {
                cartList[i].good_num = e.detail
            }
        }
        this.countMoney()
    },

    // 删除单个商品
    deleteGood(e) {
        var that = this
        var good = e.currentTarget.dataset.good
        var cartList = this.data.cartList
        var result = this.data.result
        wx.showModal({
            title: '是否删除商品',
            content: '商品: ' + this.data.goodsInfo[good.good_id]['name'],
            success(res) {
                if (res.confirm) {
                    for (let i = 0; i < cartList.length; i++) {
                        if (cartList[i].good_id == good.good_id) {
                            cartList.splice(i, 1)
                        }
                    }
                    for (let i = 0; i < result.length; i++) {
                        if (result[i] == good.good_id) {
                            result.splice(i, 1)
                        }
                    }
                    that.setData({
                        cartList: cartList,
                        result: result
                    })
                    that.countMoney()
                } else if (res.cancel) {
                    // console.log('用户点击取消')
                }
            }
        })
    },

    // 删除选中商品
    selectDelete() {
        var that = this
        var cartList = this.data.cartList
        var result = this.data.result
        wx.showModal({
            title: '删除商品',
            content: '是否删除所选商品',
            success(res) {
                if (res.confirm) {
                    var listNum = cartList.length
                    for (let i = listNum - 1; i >= 0; i--) {
                        if (result.indexOf(cartList[i].good_id) != -1) {
                            cartList.splice(i, 1)
                        }
                    }
                    that.setData({
                        cartList: cartList,
                        result: []
                    })
                    that.countMoney()
                } else if (res.cancel) {
                    // console.log('用户点击取消')
                }
            }
        })
    },

    // 计算总金额
    countMoney() {
        var money = 0;
        var cartList = this.data.cartList
        var result = this.data.result
        for (let i of cartList) {
            if (result.indexOf(i.good_id) != -1) {
                money += this.data.goodsInfo[i.good_id]['price'] * i.good_num
            }
        }
        this.setData({
            totalMoney: Math.round(money * 10) / 10
        })
    },

    // 更新购物车数据库信息
    updataCloud() {
        db.collection("shoppingcar").where({
                _openid: wx.getStorageSync('openid')
            }).get()
            .then(res => {
                db.collection("shoppingcar").doc(res.data[0]._id).set({
                    data: {
                        cartlist: this.data.cartList
                    },
                    success: function (res) {
                        this.getCartList()
                    }
                })
            })
    },

    // 获取商品信息
    getGoodList() {
        var that = this
        var codeList = []
        for (let i of this.data.cartList) {
            codeList.push(i.good_id)
        }
        wx.cloud.callFunction({
            name: "getGoodsByIdList",
            data: {
                codeList: codeList
            },
            success(res) {
                var allData = res.result.data
                var goodsInfo = {}
                for (let i of allData) {
                    goodsInfo[i.code] = i
                }
                that.setData({
                    goodsInfo: goodsInfo
                })
                wx.hideLoading();
                wx.hideNavigationBarLoading();
                wx.stopPullDownRefresh();
            }
        })
    },

    // 结算
    payit() {
        var result = this.data.result;
        var paylist = {};
        for (let paygood of this.data.cartList) {
            if (result.findIndex(function (val) {
                    return val == paygood["good_id"]
                }) != -1) {
                paylist[paygood["good_id"]] = paygood["good_num"];
            }
        }
        var ndate = new Date;
        var nsecond = new Date(new Date().setHours(0, 0, 0, 0)).getTime()
        var fdate = ndate.getFullYear() % 100 * 10000 + (ndate.getMonth() + 1) * 100 + ndate.getDate();
        var oid = fdate * 1e8 + (ndate.getTime() - nsecond);
        wx.navigateTo({
            url: '../payit/payit?orderid=' + oid,
            events: {
                // 为指定事件添加一个监听器，获取被打开页面传送到当前页面的数据
            },
            success: function (res) {
                // 通过 eventChannel 向被打开页面传送数据
                res.eventChannel.emit('acceptDataFromOpenerPage', {
                    paylist: paylist
                })
            }
        })
    },

    // 获取购物车数据库信息
    getCartList() {
        db.collection("shoppingcar").where({
                _openid: wx.getStorageSync('openid')
            }).get().then(res => {
                if (res.data.length == 0) {
                    db.collection("shoppingcar")
                        .add({
                            data: {
                                cartlist: []
                            }
                        })
                } else {
                    var cartL = res.data[0].cartlist
                    this.setData({
                        totalCart: cartL.length,
                        cartList: cartL
                    })
                }
            })
            .then(res => {
                this.getGoodList()
                this.countMoney()
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
        wx.showNavigationBarLoading();
        wx.showLoading({
            title: '刷新中...',
        })
        this.setData({
            checkedAll: false,
            result: [],
            cartList: [],
            totalMoney: 0
        })
        this.getCartList()
    },

    /**
     * 生命周期函数--监听页面隐藏
     */
    onHide: function () {
        this.updataCloud()
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