// 云函数入口文件
const cloud = require('wx-server-sdk')

cloud.init()

// 云函数入口函数
exports.main = async (event, context) => {
    let code = event.code
    try {
        const result = await cloud.openapi.phonenumber.getPhoneNumber({code})
        return result
    } catch (err) {
        throw err
    }
}