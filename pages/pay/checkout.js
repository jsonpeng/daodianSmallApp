// pages/pay/checkout.js
var app=getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    switch: app.ext.config,
    //结算提交信息
    inputs: {
      items: [

      ],
      customer_name: '',
      customer_phone: '',
      coupon_id: 0,
      credits: 0,
      user_money_pay: 0,
      prom_type: 0,
      prom_id: 0,
      remark: ''
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //console.log('options信息为：' + options);
    //检查主题是否存在
    app.getFileWhetherHas(that, app.ext.theme);
    that.setData({
      'themeData.produtsInfo' : app.conf.product.product
    })
    let product = app.conf.product.products;
    let myself = {};
    let inputs = that.data.inputs;
    //个人信息
    app.AutoVarifyCache('myself', function (e) {
      if (e) {
        myself = e;
      }
    });

    //处理items
    inputs['items'] = [
      {
        id: product.product.id,//product_id _ spec_id
        name: product.product.name,//product_name spec_key_name
        qty: 1,//数量默认是1
        price: product.product.price,//单价
        total: product.product.price,//总计多少钱
        types: 0,//类型0不带规格 1带规格
      }
    ];

    //处理姓名电话
    inputs['customer_name'] = myself.user.nickname;
    inputs['customer_phone'] = myself.user.mobile;

    that.setData({
      'themeData.produtsInfo': product,
      'themeData.inputs': inputs,
      'themeData.needMoney': product.product.price 
    });

  },
  /**
   * 支付
   */
  pay:function(){
    app.payToOrder(this.data.inputs,function(res){
        app.alert('下订单成功,请等待支付');
        wx.redirectTo({
          url: '../orders/orders',
        })
    });
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