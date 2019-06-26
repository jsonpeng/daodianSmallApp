// pages/credits_mall/credits_mall.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      themeData:{
        credits_products:[
          {
            'image':'../../images/p1.jpg',
            'name':'肯德基豪华套餐',
            'price':'1000',
            'sales_count':'378'
          },
          {
            'image': '../../images/p2.jpg',
            'name': '肯德基豪华套餐',
            'price': '1000',
            'sales_count': '378'
          },
          {
            'image': '../../images/p3.jpg',
            'name': '肯德基豪华套餐',
            'price': '1000',
            'sales_count': '378'
          }
        ]
      }
  },
  creditRedirect:function(e){
  let creditShop = e.currentTarget.dataset.url;
  console.log(creditShop);
  wx.navigateTo({
    url: '../product/product?credit_shop_id=' + creditShop.id,
  })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //检查主题是否存在
    app.getFileWhetherHas(that, app.ext.theme);
    app.request('/api/credits_shop_list',function(res){
      if(res){
        that.setData({
          'themeData.credits_products':res
        });
        app.saveStorageName('credits_products',res);
      }
    },{},true)
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