const db = wx.cloud.database();
Page({

    /**
     * 页面的初始数据
     */
    data: {
        classifyList: [],
        maxId: 0
    },

    addClassify() {
        var newDict = {
            classifyId: this.data.maxId + 1,
            classifyName: "未命名",
            maxCode: 0
        }
        var newList = this.data.classifyList;
        newList.push(newDict);
        this.setData({
            classifyList: newList,
            maxId: this.data.maxId + 1
        })
        db.collection('classify').doc('8f75309d6295dda70655f25d1be15954').update({
            data: {
                classifyList: newList
            },
        })
    },

    deleteClassify(e) {
        var index = e.target.dataset.index;
        var that = this;
        wx.showModal({
            title: this.data.classifyList[index].classifyName,
            content: '是否删除该分类',
            success(res) {
                if (res.confirm) {
                    db.collection('good').where({
                        classification: that.data.classifyList[index].classifyId
                    }).get().then(res => {
                        if (res.data.length != 0) {
                            wx.showToast({
                                title: '该分类下有商品',
                                icon: 'error',
                                duration: 1500
                            })
                        } else {
                            var newList = that.data.classifyList;
                            newList.splice(index, 1);
                            that.setData({
                                classifyList: newList
                            })
                            db.collection('classify').doc('8f75309d6295dda70655f25d1be15954').update({
                                data: {
                                    classifyList: newList
                                },
                            })
                            wx.showToast({
                                title: '成功',
                                icon: 'success',
                                duration: 1000
                            })
                        }
                    })
                }
            }
        })
    },

    editClassify(e) {
        var index = e.target.dataset.index;
        var that = this;
        wx.showModal({
            title: '修改分类名称',
            content: this.data.classifyList[index].classifyName,
            placeholderText: this.data.classifyList[index].classifyName,
            editable: true,
            success(res) {
                if (res.confirm) {
                    if(res.content==''){
                        wx.showToast({
                            title: '分类名不能为空',
                            icon: 'error',
                            duration: 1500
                        })
                    } else {
                        that.setData({
                            [`classifyList[${index}].classifyName`]: res.content
                        })
                        db.collection('classify').doc('8f75309d6295dda70655f25d1be15954').update({
                            data: {
                                classifyList: that.data.classifyList
                            },
                        })
                    }
                }
            }
        })
    },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad(options) {
        db.collection('classify').doc('8f75309d6295dda70655f25d1be15954').get()
            .then(res => {
                // console.log(res.data.classifyList);
                var idList = [];
                for (let i of res.data.classifyList) {
                    idList.push(parseInt(i.classifyId));
                }
                this.setData({
                    classifyList: res.data.classifyList,
                    maxId: Math.max.apply(null, idList)
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