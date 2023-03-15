const app = getApp();
const db = wx.cloud.database();
Page({
    /**
     * 页面的初始数据
     */
    data: {
        height: 0,
        gridList: [{
                img: '../img/bgdz.png',
                name: '常用精选'
            },
            {
                img: '../img/zxb.png',
                name: '中性笔'
            },
            {
                img: '../img/qtb.png',
                name: '其它笔'
            },
            {
                img: '../img/zmwj.png',
                name: '桌面文具'
            },
            {
                img: '../img/snzl.png',
                name: '收纳整理'
            },
            {
                img: '../img/dyhc.png',
                name: '打印耗材'
            },
            {
                img: '../img/bgyp.png',
                name: '办公设备'
            },
            {
                img: '../img/glzp.png',
                name: '各类纸品'
            },
            {
                img: '../img/syhc.png',
                name: '实验耗材'
            },
            {
                img: '../img/hyyp.png',
                name: '其他物资'
            }
        ],
        bannerList: ["../images/banner.jpg", "../images/banner0.jpg", "../images/banner1.jpg", "../images/banner2.jpg"],
        array_tuijian: [

        ],
        openid: '',
        search: '',
        search_product: [],
        searching: false
    },

    // 跳转商品详情页
    goToProduct(res) {
        var that = this;
        var id = res.currentTarget.dataset.id;

        wx.navigateTo({
            url: '../product/product?id=' + id,
        })

    },
    // 获取输入框的值
    value(res) {
        var that = this;
        that.setData({
            search_product: null
        })
        var value = res.detail.value;
        if (value == '') {
            that.setData({
                searching: false
            })
        } else {
            that.setData({
                search: value,
                searching: true
            })
        }
    },
    //搜索
    search(res) {

    },
    // 跳转分类页
    selectName(res) {
        wx.switchTab({
            url: '../classify/classify'
        })
    },
    // 跳转掌柜推荐
    BossRecommend(res) {
        
    },

    setContainerHeight: function (e) {
        //图片的原始宽度
        var imgWidth = e.detail.width;
        //图片的原始高度
        var imgHeight = e.detail.height;
        //同步获取设备宽度
        var sysInfo = wx.getSystemInfoSync();
        //获取屏幕的高度
        var screenWidth = sysInfo.screenWidth;
        //获取屏幕和原图的比例
        var scale = screenWidth / imgWidth;
        //设置容器的高度
        this.setData({
            height: imgHeight * scale
        })
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        // swiper设置高度
        var that = this;
        var array = [];
    },

    /**
     * 生命周期函数--监听页面初次渲染完成
     */
    onReady: function () {},
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