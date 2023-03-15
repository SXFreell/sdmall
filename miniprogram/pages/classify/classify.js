const db = wx.cloud.database();
const app = getApp();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        SystemInfo: {},
        originClassifyList: [],
        classifyList: [],
        classifyIndex: 0,
        goodList: [],
        showLoading: false,
        pop: {
            "img": "",
            "name": "NULL",
            "price": -1,
            "good_id": "00-00000"
        },
        show: false,
        cart_num: 1,
        goodTotal: 0,
        goodNow: 0,
    },

    // // 跳转商品详情页
    // GoToProduct(res) {
    //     var that = this;
    //     var id = res.currentTarget.dataset.id;

    //     wx.navigateTo({
    //         url: '../product/product?id=' + id,
    //     })
    // },

    // 打开面板
    cart(e) {
        var cart_data = e.detail;
        this.setData({
            show: true,
            pop: {
                "img": cart_data.img,
                "name": cart_data.name,
                "price": cart_data.price,
                "good_id": cart_data.good_id,
                "detail": cart_data.brief
            }
        });
    },

    // 关闭面板
    onClose() {
        this.setData({
            show: false,
            cart_num: 1
        });
    },

    // 步进器变化
    numChange(e) {
        this.setData({
            cart_num: e.detail
        })
    },

    // 显示对应分类的商品
    selectId(res) {
        var nowIndex = res.currentTarget.dataset.index
        var classifyId = this.data.originClassifyList[nowIndex].classifyId
        this.setData({
            goodList: [],
            classifyIndex: nowIndex,
            showLoading: true
        })
        db.collection("good").where({
            classification: classifyId,
            shangJia: true
        }).count().then(res => {
            this.setData({
                goodTotal: res.total
            })
        })
        db.collection('good').where({
            classification: classifyId,
            shangJia: true
        }).get().then(res => {
            this.setData({
                goodList: res.data,
                showLoading: false,
                goodNow: res.data.length
            })
        })
    },

    moreGoods() {
        if (this.data.goodNow != this.data.goodTotal) {
            var classifyId = this.data.originClassifyList[this.data.classifyIndex].classifyId
            this.setData({
                showLoading: true
            })
            db.collection('good').where({
                classification: classifyId,
                shangJia: true
            }).skip(this.data.goodNow).get().then(res => {
                var newList = this.data.goodList.concat(res.data)
                this.setData({
                    goodList: newList,
                    showLoading: false,
                    goodNow: res.data.length + this.data.goodNow
                })
            })
        }
    },

    test() {

    },

    pushCart(e) {
        wx.showLoading({
            title: '正在加入购物车',
        })
        var that = this
        var nowgood = e.currentTarget.dataset.good
        var nownum = 0
        db.collection("shoppingcar").where({
            _openid: wx.getStorageSync('openid')
        }).get().then(res => {
            if (res.data.length == 0) {
                db.collection("shoppingcar")
                    .add({
                        data: {
                            cartlist: [{
                                good_id: nowgood.good_id,
                                good_num: this.data.cart_num
                            }]
                        }
                    })
                    .then(res => {
                        wx.hideLoading()
                        that.setData({
                            show: false,
                            cart_num: 1
                        })
                    })
            } else {
                var _id = res.data[0]._id
                var cartL = res.data[0].cartlist
                for (let i = 0; i < cartL.length; i++) {
                    if (cartL[i].good_id == nowgood.good_id) {
                        nownum = cartL[i].good_num
                        cartL.splice(i, 1)
                        break
                    }
                }
                var cartGood = {
                    good_id: nowgood.good_id,
                    good_num: this.data.cart_num + nownum
                }
                cartL.unshift(cartGood)
                db.collection("shoppingcar").doc(_id).set({
                    data: {
                        cartlist: cartL
                    },
                    success: function (res) {
                        wx.hideLoading()
                        that.setData({
                            show: false,
                            cart_num: 1
                        })
                    }
                })
            }
        })
    },



    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            SystemInfo: wx.getSystemInfoSync()
        })
        var that = this
        db.collection('classify').doc('8f75309d6295dda70655f25d1be15954').get()
            .then(res => {
                var List = []
                for (let i of res.data.classifyList) {
                    List.push(i["classifyName"])
                }
                that.setData({
                    originClassifyList: res.data.classifyList,
                    classifyList: List
                })
            })
            .then(res => {
                this.selectId({
                    currentTarget: {
                        dataset: {
                            index: this.data.classifyIndex
                        }
                    }
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
        this.setData({
            originClassifyList: [],
            classifyList: [],
            classifyIndex: 0,
            goodList: [],
            pop: {
                "img": "",
                "name": "NULL",
                "price": -1,
                "good_id": "00-00000"
            },
            show: false,
            cart_num: 1
        })
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