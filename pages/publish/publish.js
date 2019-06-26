// pages/publish/publish.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeData:{
      post_images: [],
      product_spec: [],
      selected_product:[],
      content:'',
      //全部分类
      cats: [],
      //对应分类的商品tab 默认0是全部商品
      productTab: -1,
      pay_status: false,
      cancel_status: false,
    }
  },
  contentInput:function(e){
        this.setData({
          'themeData.content':e.detail.value
        })
  },
  publishPosts:function(e){
    let selected_product = this.data.themeData.selected_product;
    let product_spec = [];
    for (var i in selected_product){
      product_spec.push(selected_product[i]['id']+'_0');
    }

    if (app.empty(this.data.themeData.content)){
        app.alert('请输入内容');
        return false;
    }
  
    if (app.empty(this.data.themeData.post_images) ){
        app.alert('请选择图片');
        return false;
    }

    if (app.empty(product_spec)) {
        app.alert('请选择商品');
        return false;
    }

    let input = {
      post_images: this.data.themeData.post_images,
      content: this.data.themeData.content,
      product_spec: product_spec
    };

    console.log(input);

    app.request('/api/publish_post',function(res){
          if(res){
            app.alert(res);
            wx.redirectTo({
              url: '../issue/issue',
            })
          }
    },input,true);

  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let that = this;
    //检查主题是否存在
    app.getFileWhetherHas(that, app.ext.theme);

    //获取全部分类
    app.getCatsAll(that);
    //获取全部产品
    app.getProductsAll(that,0,100,true);
  },
  // 点击取消返回个人中心
  backTo: function(){
    wx.navigateBack();
  },
  chooseImageTap: function () {
    let _this = this;
    wx.showActionSheet({
      itemList: ['从相册中选择', '拍照'],
      itemColor: "#f7982a",
      success: function (res) {
        if (!res.cancel) {
          if (res.tapIndex == 0) {
            _this.chooseWxImage('album')
          } else if (res.tapIndex == 1) {
            _this.chooseWxImage('camera')
          }
        }
      }
    })

  },
  chooseWxImage: function (type) {
    let _this = this;
    wx.chooseImage({
      sizeType: ['original', 'compressed'],
      sourceType: [type],
      success: function (res) {
        console.log(res);
        _this.setData({
          logo: res.tempFilePaths[0],
        });
        let img_arr = _this.data.themeData.post_images;
        if (img_arr.length >= 6){
          app.alert('已超过最大上传数量');
          return false;
        }
        //上传图片请求
        app.upload_file('/api/upload_images', res.tempFilePaths[0],function(res){
          console.log(res);
          res = JSON.parse(res);
         
          img_arr.push(res.data.src);
          _this.setData({
            'themeData.post_images':img_arr
          })
          //把数据动态传递到视图
        });
      }
    })
  },
  //预览图片
  previewImage: function (e) {
    if (this.endTime - this.startTime < 350) {
    app.previewImage(this.data.themeData.post_images, e.currentTarget.dataset.index);
    }
  },
  bindTouchStart: function (e) {
    this.startTime = e.timeStamp;
  },
  bindTouchEnd: function (e) {
    this.endTime = e.timeStamp;
  },
  //长按删除图片
  delImage:function(e){
    let that =this;
    let img_arr = that.data.themeData.post_images;
    wx.showModal({
      content: '确定要删除该图片吗',
      cancelText: '取消',
      confirmText: '确定',
      confirmColor: '#ff4e44',
      success: function (res) {
        if (res.confirm) {
          let index = e.currentTarget.dataset.index;
          img_arr.splice(index,1);
          that.setData({
            'themeData.post_images': img_arr
          })
        }
      }
    });
  },
  //选择商品
  selectProducts:function(e){
    let products = this.data.themeData.products;
    let index = e.currentTarget.dataset.index;
    products[index]['selected'] = !products[index]['selected'];
    this.setData({
      'themeData.products':products
    });
  },
  //确认商品选择
  enterProduct:function(e){
    let products = this.data.themeData.products;
    let selected_product = this.data.themeData.selected_product;
    for(var i = products.length -1 ; i >=0 ; i--){
      if (products[i]['selected']){
        selected_product.push(products[i]);
      }
    }
    this.setData({
      'themeData.selected_product': selected_product
    });
    this.exitAction();
  },
  //切换tab
  switchTab: function (e) {
    var cat_id = e.currentTarget.dataset.id;
    var nowtab = e.currentTarget.dataset.index;
    if (nowtab != -1) {
      this.setData({
        'themeData.productTab': nowtab
      })
      app.getCatProductByCatId(this, cat_id, nowtab,true);
    }
    else {
      app.getProductsAll(this, 0, 100, true);
      this.setData({
        'themeData.productTab': nowtab
      })
    }
  },
  showList:function(){
    this.setData({
      'themeData.cancel_status': true
    });
  },
  exitAction: function () {
    //把商品选中状态注销下
    let products = this.data.themeData.products;
    for (var i = products.length -1;i>=0;i--){
      products[i]['selected'] = false
    }
    this.setData({
      'themeData.cancel_status': false,
      'themeData.products': products
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