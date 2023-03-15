// components/Tabs/Tabs.js
Component({
  /**
   * 组件的属性列表
   */
  properties: {
    name: {
      type: String,
      value: "商品"
    },
    price: {
      type: Number,
      value: -1
    },
    img: {
      type: String,
      value: ""
    },
    brief: {
      type: String,
      value: "NULL"
    },
    good_id: {
      type: String,
      value: "000000"
    }
  },

  /**
   * 组件的初始数据
   */
  data: {

  },

  /**
   * 组件的方法列表
   */
  methods: {
    cart(){
      this.triggerEvent('cart',this.properties)
    }
  }
})
