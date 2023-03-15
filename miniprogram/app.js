//app.js
App({
    onLaunch: function () {
        if (!wx.cloud) {
            console.error('请使用 2.2.3 或以上的基础库以使用云能力')
        } else {
            wx.cloud.init({
                env: 'xundamall-3gt0xqbp437f5881',
                traceUser: true,
            })
        }

        // 获取openid写入缓存
        if (!wx.getStorageSync('openid')) {
            wx.cloud.callFunction({
                name: "login",
                success(res) {
                    wx.setStorageSync('openid', res.result.openid)
                    wx.cloud.database().collection('user').where({
                            _openid: res.result.openid
                        })
                        .get()
                        .then(res => {
                            if(res.data.length!=0){
                                wx.setStorageSync('user', res.data[0])
                                wx.switchTab({
                                    url: '/pages/index/index',
                                })
                            }
                        })
                }
            })
        } else if(!wx.getStorageSync('user')) {
            let openid = wx.getStorageSync('openid')
            wx.cloud.database().collection('user').where({
                    _openid: openid
                })
                .get()
                .then(res => {
                    if(res.data.length!=0){
                        wx.setStorageSync('user', res.data[0])
                        wx.switchTab({
                            url: '/pages/index/index',
                        })
                    }
                })
        } else {
            wx.switchTab({
                url: '/pages/index/index',
            })
        }
    },

    
    globalData: {
        
    }
})