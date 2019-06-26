// pages/pay/pay.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
      themeData:{
        consu_price:'',
        no_dis_price:'',
        request_data:{
          price:0,//实付金额
          orgin_price:0,//消费总额
          no_discount_price:0,//不参与优惠金额
          use_user_money:0,//使用余额
          user_level_money:0,//会员等级优惠金额
          coupon_id:0,//使用coupon_id
          coupon_price:0//优惠券优惠金额
        }
      }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this;
    //检查主题是否存在
    app.getFileWhetherHas(that, app.ext.theme);
    app.AutoVarifyCache('myself', function (e) {
      if (e) {
        that.setData({
          'themeData.myself': e
        })
      }
      else {
        app.meInfo(that);
      }
    });
    // 获取优惠券信息
    //app.getCoupons(this, this.data.themeData.couponsTab);
  },
  showCoupon:function(){
    let that = this;
    let request_data = {price: that.data.themeData.request_data.price};
    app.request('/api/coupons_canuse',function(res){
        if(res && !app.empty(res)){
                that.setData({
                  'themeData.couponStatus':true,
                  'themeData.coupons':res
                })
        }
        else{
          app.alert('没有可使用的优惠券!');
        }
    },request_data,true);


  },
  chooseCoupon:function(){
    this.setData({
      'themeData.couponStatus': false
    })
  },
  useCoupon:function(e){
    this.setData({
      'themeData.couponStatus': false,
      'themeData.request_data.coupon_id':e.currentTarget.dataset.id,
      'themeData.request_data.coupon_price': e.currentTarget.dataset.price,
      'themeData.coupon_text': e.currentTarget.dataset.text
    })
  },
  // 消费总额
  input1:function(e){
    var value = e.detail.value;
    if (app.isContains(value,'¥')){
      value = value.slice(1);
    };
    console.log(value);
    if (!app.empty(value)) {
      this.setData({
        'themeData.consu_price': '¥' + value,
        'themeData.request_data.orgin_price':value
      })
    }
    this.countDisPrice();
  },
  // 不参与优惠金额
  input2: function (e) {
    var value = e.detail.value;
    if (app.isContains(value, '¥')) {
      value = value.slice(1);
    };
    console.log(value);
    if (!app.empty(value)) {
      this.setData({
        'themeData.no_dis_price': '¥' + value,
        'themeData.request_data.no_discount_price': value
      })
    }
    this.countDisPrice();
  },
  //余额加
  numAdd:function(e){
    let user_money = this.data.themeData.myself.user.user_money;
    let now_money = this.data.themeData.request_data.use_user_money;

    if (now_money < user_money && this.countDisPrice() > 0){
      now_money++;
    }

    this.setData({
      'themeData.request_data.use_user_money': now_money
    });

  },
  numDel:function(e){
    let user_money = this.data.themeData.myself.user.user_money;
    let now_money = this.data.themeData.request_data.use_user_money;

    if (now_money < user_money && this.countDisPrice() > 0 && now_money >=0 ) {
      now_money--;
    }

    this.setData({
      'themeData.request_data.use_user_money': now_money
    });
  },
  //余额减
  // 使用余额支付
  numInput:function(e){
    var balance = e.detail.value;
    let user_money = this.data.themeData.myself.user.user_money;
    if (balance > user_money){
      balance = user_money;
    }
    if (this.countDisPrice()<0){
      balance = this.data.themeData.request_data.use_user_money;
    }
    this.setData({
      'themeData.balance': balance,
      'themeData.request_data.use_user_money': balance
    });
    this.countDisPrice();
  },
  // 计算会员折扣
  discount:function(e){
    var value = e.detail.value;
    
    if (!app.empty(value)) {
    this.setData({
      'themeData.no_dis_price': '¥' + value
    });
    var s1 = this.data.themeData.consu_price.slice(1);
    var s2 = this.data.themeData.no_dis_price.slice(1);
    let userMoney = this.data.themeData.myself.user.user_money;39
    let num =1-this.data.themeData.myself.userLevel.discount/100;
    let payFor = ((s1 - value) *(1-num)).toFixed(0);
    let _discount = ((s1 - value) * num).toFixed(2);
    this.setData({
      'themeData.discount': '-¥'+_discount,
      'themeData.payFor': payFor
    })
    }
  },
  //立即买单
  payNow:function(e){
    let request_data = this.data.themeData.request_data;
    app.request('/api/publish_discount_order',function(res){
      if(res){
        app.alert(res);
        wx.switchTab({
          url: '../usercenter/usercenter',
        })
      }
    },request_data,true)
  },
  //计算优惠金额
  countDisPrice:function(){
    //会员折扣
    let level_count = this.data.themeData.myself.userLevel.discount/100;
    let request_data = this.data.themeData.request_data;
    //原价
    let origin_price = request_data.orgin_price;
    //不参与优惠金额
    let no_discount_price = request_data.no_discount_price;
    //使用余额
    let use_user_money = request_data.use_user_money
    // 优惠券减免
    let coupon_price=this.data.themeData.request_data.coupon_price;
    //会员特惠
    let user_level_money =(origin_price - (origin_price - no_discount_price) * level_count - no_discount_price).toFixed(2);
    let price = (origin_price - use_user_money - user_level_money - coupon_price).toFixed(2);
    //赋值
    request_data.user_level_money = user_level_money;
    request_data.price = price;
    this.setData({
      'themeData.request_data': request_data,
      'themeData.payFor': price
    });
    return price;
  },
  // 选择可使用的优惠券
  choosCoupon:function(){
    
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