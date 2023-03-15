const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        error: "",
        goodTotal: 0,
        goodList: [],
        goodNow: 0,
        showLoading: false,
        originClassifyList: [],
        classifyList: [],
        classifyDict: {},
        show: false,
        Pcode: "",
        Pname: "",
        Pprice: "",
        Poneprice: "",
        Pdetail: "",
        PshangJia: true,
        PtuiJian: false,
        Pfiles: [],
        // Pclassification: "",
        classifyIndex: 0
    },
    shangJiaChange: function (e) {
        this.setData({
            PshangJia: e.detail.value
        })
    },
    tuiJianChange: function (e) {
        this.setData({
            PtuiJian: e.detail.value
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
    moreGoods() {
        if (this.data.goodNow != this.data.goodTotal) {
            this.setData({
                showLoading: true
            })
            db.collection('good').skip(this.data.goodNow).limit(20).get().then(res => {
                var newList = this.data.goodList.concat(res.data)
                this.setData({
                    goodList: newList,
                    showLoading: false,
                    goodNow: res.data.length + this.data.goodNow
                })
                // console.log(newList)
            })
        }
    },
    edit(event) {
        var index = event.target.dataset["index"]
        // console.log(index)
        var goodList = this.data.goodList
        var originClassifyList = this.data.originClassifyList
        for(let i=0;i<originClassifyList.length;i++){
            if(originClassifyList[i].classifyId == goodList[index].classification){
                var classifyIndex = i
                break
            }
        }
        this.setData({
            nowIndex: index,
            Pname: goodList[index].name,
            Pcode: goodList[index].code,
            Pprice: goodList[index].price,
            Poneprice: goodList[index].oneprice,
            Pdetail: goodList[index].detail,
            PshangJia: goodList[index].shangJia,
            PtuiJian: goodList[index].tuiJian,
            Pfiles: goodList[index].files,
            // Pclassification: goodList[index].classification,
            classifyIndex: classifyIndex,
            show: true
        })
    },
    onClose() {
        this.setData({
            show: false
        })
    },
    submitForm() {
        var that = this
        if (this.data.Pname == "") {
            this.setData({
                error: "商品名称是必填项"
            })
        } else if (this.data.Pprice == "") {
            this.setData({
                error: "商品售价是必填项"
            })
        } else if (this.data.Poneprice == "") {
            this.setData({
                error: "商品进价是必填项"
            })
        }
        // else if(this.data.brief=="") {this.setData({error: "商品简介是必填项"})}
        else if (this.data.Pdetail == "") {
            this.setData({
                error: "商品描述是必填项"
            })
        } else if (this.data.Pfiles.length == 0) {
            this.setData({
                error: "未上传商品图片"
            })
        } else {
            var nowClassify = this.data.originClassifyList[this.data.classifyIndex]
            var nowdoc = this.data.goodList[this.data.nowIndex]._id
            db.collection('good').doc(nowdoc).update({
                data: {
                    files: this.data.Pfiles,
                    name: this.data.Pname,
                    price: this.data.Pprice,
                    oneprice: this.data.Poneprice,
                    detail: this.data.Pdetail,
                    classification: nowClassify["classifyId"],
                    shangJia: this.data.PshangJia,
                    tuiJian: this.data.PtuiJian
                },
            })
            // .then(res=>{
            //     console.log(res)
            // })
            var nowgood = this.data.goodList[this.data.nowIndex]
            nowgood.files = this.data.Pfiles
            nowgood.name = this.data.Pname
            nowgood.price = this.data.Pprice
            nowgood.oneprice = this.data.Poneprice
            nowgood.detail = this.data.Pdetail
            nowgood.classification = nowClassify["classifyId"]
            nowgood.shangJia = this.data.PshangJia
            nowgood.tuiJian = this.data.PtuiJian
            this.setData({
                ['goodList['+String(this.data.nowIndex)+']']: nowgood,
                show: false
            })
            // console.log(this.data.goodList[this.data.nowIndex])
        }
    },
    //   update(res){
    //     var that = this;
    //     var id = res.currentTarget.dataset.id;
    //     var array = [];
    //     for(var i = 0; i < that.data.product.length; i++){
    //       if(that.data.product[i]._id == id){
    //         array = JSON.stringify(that.data.product[i]);
    //       }
    //     }
    //     wx.redirectTo({
    //       url: '../addProduct/addProduct?data=' + array,
    //     })
    //   },
    //   delete(res){
    //     var that = this;
    //     var id = res.currentTarget.dataset.id;
    //     var fileID = res.currentTarget.dataset.fileid;
    //     wx.showLoading({
    //       title: '处理中',
    //     })
    //     wx.cloud.callFunction({
    //       name:'deleteProduct',
    //       data:{
    //         id:id
    //       },
    //       success(res){
    //         wx.cloud.deleteFile({
    //           fileList:[fileID],
    //           success(res){
    //             wx.hideLoading({
    //               success: (res) => {
    //                 wx.showToast({
    //                   title: '删除成功',
    //                 })
    //                 that.onLoad();
    //               },
    //             })
    //           },
    //           fail(res){
    //             console.log("商品图片删除失败",res);
    //           }
    //         })
    //       },
    //       fail(res){
    //         console.log("商品信息删除失败",res);
    //       }
    //     })
    //   },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
        this.setData({
            showLoading: true
        })
        db.collection("good").count().then(res => {
            this.setData({
                goodTotal: res.total
            })
        })
        db.collection('good').limit(20).get().then(res => {
            this.setData({
                goodList: res.data,
                showLoading: false,
                goodNow: res.data.length
            })
            // console.log(this.data.goodList)
        })
        db.collection('classify').doc('8f75309d6295dda70655f25d1be15954').get().then(res => {
            var List = []
            var Dict = {}
            for (let i of res.data.classifyList) {
                List.push(i["classifyName"])
                Dict[i["classifyId"]] = i["classifyName"]
            }
            this.setData({
                originClassifyList: res.data.classifyList,
                classifyList: List,
                classifyDict: Dict
            })
        })
        // var that = this;
        // wx.cloud.callFunction({
        //   name:'findProduct',
        //   success(res){
        //     that.setData({
        //       product:res.result.data
        //     })
        //   }
        // })
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
        this.moreGoods()
    },

    /**
     * 用户点击右上角分享
     */
    onShareAppMessage: function () {

    }
})