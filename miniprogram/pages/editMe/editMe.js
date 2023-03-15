const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        nickName: "",
        phoneNumber: "",
        avatar: "",
        realName: "",
        department: "",
        phoneNumber: "",
        phone: "",
        info: "",
        infotype: ""
    },

    // 获取手机号函数
    getPhoneNumber(e) {
        if (e.detail.errMsg == "getPhoneNumber:ok") {
            wx.showLoading({
                title: '获取手机号',
            })
            wx.cloud.callFunction({
                name: 'getPhoneNumber',
                data: {
                    code: e.detail.code
                },
                success: (res) => {
                    this.setData({
                        phoneNumber: res.result.phoneInfo.phoneNumber
                    })
                    wx.hideLoading()
                }
            })
        } else {
            this.setData({
                infotype: "error",
                info: "用户拒绝授权"
            })
        }
    },

    // 从缓存中读取个人信息
    getUserInfoFromStorage() {
        let user = wx.getStorageSync('user')
        this.setData({
            nickName: user.nickName,
            avatar: user.avatar,
            realName: user.realName,
            department: user.department,
            phoneNumber: user.mobilephone,
            phone: user.phone
        })
    },

    // 从数据库获取信息至缓存
    getUserInfoFromDb() {
        let userid = wx.getStorageSync('user')._id
        db.collection('user').doc(userid).get().then(res => {
            wx.setStorageSync('user', res.data)
            this.setData({
                nickName: res.data.nickName,
                avatar: res.data.avatar,
                realName: res.data.realName,
                department: res.data.department,
                phoneNumber: res.data.mobilephone,
                phone: res.data.phone
            })
        })
    },

    // 提交按钮
    submitForm() {
        var that = this
        wx.showLoading({
            title: '资料更新中',
        })
        let userid = wx.getStorageSync('user')._id
        db.collection('user').doc(userid).update({
            data: {
                nickName: this.data.nickName,
                avatar: this.data.avatar,
                realName: this.data.realName,
                department: this.data.department,
                mobilephone: this.data.phoneNumber,
                phone: String(this.data.phone)
            },
            success: function (res) {
                db.collection('user').doc(userid).get().then(res => {
                    wx.setStorageSync('user', res.data)
                    that.setData({
                        infotype: "success",
                        info: "资料更新成功"
                    })
                    wx.hideLoading()
                })
            }
        })
    },

    // 获取头像及昵称
    getNameAvatar() {
        wx.getUserProfile({
            desc: '用于完善会员资料',
            success: (res) => {
                this.setData({
                    nickName: res.userInfo.nickName,
                    avatar: res.userInfo.avatarUrl,
                })
            },
            fail: (res) => {
                this.setData({
                    infotype: "error",
                    info: "用户拒绝授权"
                })
            }
        })
    },

    // 重置表单
    resetForm() {
        this.getUserInfoFromStorage()
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        this.getUserInfoFromDb()
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