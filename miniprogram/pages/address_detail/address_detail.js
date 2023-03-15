import {
    areaList
} from '../../vant/miniprogram_npm/@vant/area-data/index';
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        areaList,
        popShow: false,
        name: "",
        phone: "",
        areaCode: "000000",
        area: "",
        areaDetail: "",
        info: "",
        infotype: "error",
        sex: '先生',
        defaultArea: false,
        addressList: [],
        index: -1
    },

    selectArea() {
        this.selectComponent('#van-area').reset(this.data.areaCode)
        this.setData({
            popShow: true
        })
    },

    sexChange(event) {
        this.setData({
            sex: event.detail,
        });
    },

    defaultChange(e) {
        this.setData({
            defaultArea: e.detail
        });
    },

    onClose() {
        this.setData({
            popShow: false
        })
    },

    onConfirm(e) {
        if (e.detail.values[2] == undefined || e.detail.values[2].name == "") {
            this.setData({
                popShow: false,
                info: "地址不完整，请重新选择"
            })
        } else {
            var areaList = []
            for (let i of e.detail.values) {
                areaList.push(i.name)
            }
            this.setData({
                popShow: false,
                area: areaList.join(" "),
                areaCode: e.detail.values[2].code
            })
        }
    },

    submitForm() {
        if (this.data.name == "") {
            this.setData({
                info: "请填写收货人姓名"
            })
        } else if (this.data.phone == "") {
            this.setData({
                info: "请填写收货人电话"
            })
        } else if (this.data.area == "") {
            this.setData({
                info: "请选择所在地区"
            })
        } else if (this.data.areaDetail == "") {
            this.setData({
                info: "请填写详细地址"
            })
        } else {
            var address = {
                PCC: this.data.area,
                PCCcode: this.data.areaCode,
                default: this.data.defaultArea,
                detailAddress: this.data.areaDetail,
                name: this.data.name,
                phone: this.data.phone,
                sex: this.data.sex == '先生' ? '男' : '女'
            }
            var that = this
            if (this.data.defaultArea) {
                var Tindex = this.data.addressList.findIndex(i => i.default == true)
                if(Tindex != -1){
                    this.data.addressList[Tindex].default = false
                }
            }
            if (this.data.index == -1) {
                this.data.addressList.push(address)
            } else {
                this.data.addressList[this.data.index] = address
            }
            db.collection("user").doc(wx.getStorageSync('user')._id).update({
                data: {
                    address: that.data.addressList
                },
                success: function () {
                    db.collection("user").doc(wx.getStorageSync('user')._id).get().then(res => {
                        wx.setStorageSync('user', res.data)
                    })
                    wx.navigateBack()
                }
            })
        }
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        db.collection("user").doc(wx.getStorageSync('user')._id).get().then(res => {
            this.setData({
                addressList: res.data.address
            })
            if (typeof (options) != 'undefined' && Object.keys(options).length != 0) {
                const index = parseInt(options.index)
                const tempList = this.data.addressList
                this.setData({
                    index: index,
                    area: tempList[index].PCC,
                    areaCode: tempList[index].PCCcode,
                    defaultArea: tempList[index].default,
                    areaDetail: tempList[index].detailAddress,
                    name: tempList[index].name,
                    phone: tempList[index].phone,
                    sex: tempList[index].sex == '男' ? '先生' : '女士'
                })
            }
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