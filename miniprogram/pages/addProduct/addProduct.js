const util = require('../util.js');
const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        error: "",
        files: [],
        name: "",
        price: "",
        oneprice: "",
        // brief: "",
        detail: "",
        originClassifyList: [],
        classifyList: [],
        classifyIndex: 0,
        shangJia: true,
        tuiJian: false,
        imgLoading: ""
    },
    shangJiaChange: function (e) {
        this.setData({
            shangJia: e.detail.value
        })
    },
    tuiJianChange: function (e) {
        this.setData({
            tuiJian: e.detail.value
        })
    },
    bindClassifyChange: function (e) {
        this.setData({
            classifyIndex: e.detail.value
        })
    },
    formInputChange(e) {
        const {
            field
        } = e.currentTarget.dataset
        this.setData({
            [`${field}`]: e.detail.value
        })
    },
    resetForm(e) {
        this.setData({
            name: "",
            price: "",
            oneprice: "",
            // brief: "",
            detail: "",
            classifyIndex: 0,
            shangJia: true,
            tuiJian: false,
            files: []
        })
    },
    chooseImage: function (e) {
        var that = this;
        wx.chooseImage({
            sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
            sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
            success: function (res) {
                // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
                that.setData({
                    files: that.data.files.concat(res.tempFilePaths)
                });
            }
        })
    },
    previewImage: function (e) {
        wx.previewImage({
            current: e.currentTarget.id, // 当前显示图片的http链接
            urls: this.data.files // 需要预览的图片http链接列表
        })
    },
    selectFile(files) {
        // console.log('files', files)
        // 返回false可以阻止某次文件上传
    },
    uplaodFile(filess) {

        // 文件上传的函数，返回一个promise
        return new Promise((resolve, reject) => {
            this.setData({
                imgLoading: "图片上传中..."
            })
            wx.cloud.uploadFile({
                // 指定上传到的云路径
                cloudPath: 'goodsImg/' + filess.tempFilePaths[0].split('//tmp/')[1],
                // 指定要上传的文件的小程序临时文件路径
                filePath: filess.tempFilePaths[0],
                // 成功回调
                success: res => {
                    var file = this.data.files
                    file.push({
                        url: res.fileID
                    })
                    this.setData({
                        files: file,
                        imgLoading: ""
                    })
                },
            })
        })
    },
    uploadError(e) {
        console.log('upload error', e.detail)
    },
    uploadSuccess(e) {
        console.log('upload success', e.detail)
    },
    test() {
        console.log(this.data.files)
    },
    submitForm() {
        var that = this
        if (this.data.name == "") {
            this.setData({
                error: "商品名称是必填项"
            })
        } else if (this.data.price == "") {
            this.setData({
                error: "商品售价是必填项"
            })
        } else if (this.data.oneprice == "") {
            this.setData({
                error: "商品进价是必填项"
            })
        }
        // else if(this.data.brief=="") {this.setData({error: "商品简介是必填项"})}
        else if (this.data.detail == "") {
            this.setData({
                error: "商品描述是必填项"
            })
        } else if (this.data.files.length == 0) {
            this.setData({
                error: "未上传商品图片"
            })
        } else {
            wx.showLoading({
                title: '数据存储中'
            })
            var nowClassify = this.data.originClassifyList[this.data.classifyIndex]
            if(nowClassify["maxCode"]>=99999) {
                setTimeout(function () {
                    this.setData({
                        error: "该类别商品id已达最大值"
                    })
                    this.setData({
                        error: ""
                    })
                }, 2000)
                return
            }
            var newCode = String(nowClassify["classifyId"]).padStart(2, '0') + "-" + String(nowClassify["maxCode"]+1).padStart(5, '0')
            db.collection('good').add({
                    // data 字段表示需新增的 JSON 数据
                    data: {
                        code: newCode,
                        files: this.data.files,
                        name: this.data.name,
                        price: this.data.price,
                        oneprice: this.data.oneprice,
                        // brief: this.data.brief,
                        detail: this.data.detail,
                        classification: nowClassify["classifyId"],
                        good_id: nowClassify["maxCode"]+1,
                        shangJia: this.data.shangJia,
                        tuiJian: this.data.tuiJian
                    }
                })
                .then(res => {
                    db.collection('classify').doc('8f75309d6295dda70655f25d1be15954').update({
                        data: {
                            ['classifyList.' + String(that.data.classifyIndex) + '.maxCode']: nowClassify["maxCode"]+1
                        },
                    })
                    wx.hideLoading({
                        success: (res) => {
                            wx.showModal({
                                title: '成功',
                                content: '是否继续录入商品',
                                success(res) {
                                    if (res.confirm) {
                                        that.resetForm()
                                    } else if (res.cancel) {
                                        wx.navigateBack({
                                            delta: 0
                                        })
                                    }
                                }
                            })
                        }
                    })
                })
        }
        if (this.data.error) {
            setTimeout(function () {
                that.setData({
                    error: ""
                })
            }, 2000)
        }
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        var that = this
        this.setData({
            selectFile: this.selectFile.bind(this),
            uplaodFile: this.uplaodFile.bind(this)
        })
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