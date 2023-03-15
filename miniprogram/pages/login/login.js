// pages/login/login.js
Page({

    /**
     * 页面的初始数据
     */
    data: {
        loading: false
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        if(wx.getStorageSync('user')){
            wx.switchTab({
                url: '../index/index',
            })
        }
    },

    // 登陆函数
    Login() {
        this.setData({
            loading: true
        })
        wx.getUserProfile({
            desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
            success: (res) => {
                // console.log(res.userInfo)
                // 判断用户是否首次授权，并将用户资料写入数据库
                wx.cloud.database().collection('user')
                    .where({
                        _openid: wx.getStorageSync('openid')
                    })
                    .get()
                    .then(ress => {
                        if (ress.data.length == 0) {
                            // 写入数据库
                            wx.cloud.database().collection('user')
                                .add({
                                    data: {
                                        avatar: res.userInfo.avatarUrl,
                                        address: [],
                                        department: "",
                                        mobilephone: "",
                                        realName: "",
                                        phone: "",
                                        userClass: "customer",
                                        nickName: res.userInfo.nickName
                                    }
                                })
                                .then(userData => {
                                    wx.cloud.database().collection('user')
                                        .where({
                                            _openid: wx.getStorageSync('openid')
                                        })
                                        .get()
                                        .then(resss => {
                                            wx.setStorageSync('user', resss.data[0])
                                        })
                                })
                        } else {
                            wx.setStorageSync('user', ress.data[0])
                        }
                        wx.switchTab({
                            url: '/pages/index/index'
                        })
                    })
            },
            complete: () => {
                this.setData({
                    loading: false
                })
            }
        })
    },
})