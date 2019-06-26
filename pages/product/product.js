// pages/product/product.js
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    themeData:{
      indicatorDots: false, //是否显示面板指示点，默认为false;
      //autoplay: true, //是否自动切换，默认为false;
      //interval: 3000,//自动切换时间间隔，默认5000ms;
      circular: true,//是否采用衔接滑动
      duration: 1000,//滑动动画时长，默认为1000ms;
      shareCode: false,
      //店铺列表
      shops: [],
      //对应shop的数据
      shop_tab: '',
      shareCode:false,
      flag:false
    }
  },
  // 分享
  // showCode:function(){
  //   this.setData({
  //     'themeData.shareCode':true
  //   })
  // },
  // hidepop:function(){
  //   this.setData({
  //     'themeData.shareCode': false
  //   })
  // },
  //积分兑换
  creditDuiHuan:function(e){
    let id = this.data.themeData.credits_product.id;
    app.request('/api/publish_credits_ex', function (res) {
      if(res == '兑换成功'){
        app.alert(res);
        wx.redirectTo({
          url: '../conversion/conversion',
        })
        app.meInfo();
      }
    }, { credit_service_id: id}, true, 'POST',true);
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that = this;
    //检查主题是否存在
    app.getFileWhetherHas(that, app.ext.theme);
    app.bindShareRel(options);
    wx.getSystemInfo({
      success: function (res) {
        //获取屏幕的宽度并保存
        that.setData({
          'themeData.scrollWidth': res.windowWidth
        });
      }
    });
    app.AutoVarifyCache('myself', function (e) {
      if (e) {
        that.setData({
          'themeData.myself': e
        })
      }
    });

    app.getUserInfo(null, function () {
      //获取店铺列表
     
    });

    let types = 'product';
    // console.log(options.product_id);
    if (typeof (options.product_id) != 'undefined') {
          app.getProductContentById(that, options.product_id)
    }

    if (typeof (options.credit_shop_id) != 'undefined' ){
      types = 'credit';
      let credits_products = app.getStorageName('credits_products');
      let credits_product_obj = null;
      for (var i = credits_products.length -1 ; i>= 0 ;i --){
        if (options.credit_shop_id == credits_products[i]['id']){
          credits_product_obj = credits_products[i];
        }
      }
      console.log(credits_product_obj);
      that.setData({
        'themeData.credits_product': credits_product_obj
      });
    }
    else{
      //如果是服务 就取服务

      //如果是礼品就直接显示礼品
    }
    that.setData({
      'themeData.types':types
    })
  },
  show: function () {
    this.setData({ 'themeData.flag': true, });
  },
  hide: function () {
    this.setData({ 'themeData.flag': false });
  },
  downLoadImg: function (netUrl, storageKeyUrl) {
    wx.getImageInfo({
      src: netUrl,    //请求的网络图片路径
      success: function (res) {
        //请求成功后将会生成一个本地路径即res.path,然后将该路径缓存到storageKeyUrl关键字中
        wx.setStorage({
          key: storageKeyUrl,
          data: res.path,
        });

      }
    })
  },
  showCode: function () {
    wx.showToast({
      title: '图片生成中...',
      duration: 5000,
    });
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          'themeData.windowWID': res.windowWidth - 30,
          'themeData.windowHEI': res.windowHeight * 0.9
        })
      }
    });
    setTimeout(function () {
      that.setData({
        'themeData.ifShowCode': true
      });
    }, 5500) //延迟时间 这里是5.5秒  
    // 绘制分享图片
    var context = wx.createCanvasContext('shareCanvas');
    var path = "../../images/share-prod.png";
    var userImg = that.data.themeData.myself.user.head_image;
    var usrName = that.data.themeData.myself.user.nickname;
    var proName = that.data.themeData.products.product.name;
    var wordsNum = parseInt(that.data.windowWID / 14);
    var proName1 = proName.slice(0, wordsNum);
    var proName2 = proName.slice(wordsNum);
    var proPic = that.data.themeData.products.product.image;
    var proCode = that.data.product_code;
    var code = "../../images/default/white-print.png";
    console.log('可显示字数为' + proCode);
    console.log('用户名' + usrName);
    context.stroke;
    context.drawImage(path, 15, 0, that.data.themeData.windowWID, that.data.themeData.windowHEI * 0.9);
    // 用户头像  
    that.downLoadImg(userImg, 'uImg')
    var _userImg = wx.getStorageSync('uImg');
    context.drawImage(_userImg, that.data.themeData.windowWID / 2 - 65, 45, 65, 65);
    // 用户名
    context.setFillStyle('#fff');
    context.setTextAlign('left');
    context.setFontSize(15);
    context.fillText(usrName, that.data.themeData.windowWID / 2 + 15, 70, );

    context.setFillStyle('#fff');
    context.setTextAlign('left');
    context.setFontSize(14);
    context.fillText('给你发送一个好物', that.data.themeData.windowWID / 2 + 15, 90, );
    // 商品名
    context.setFillStyle('#fff');
    context.setTextAlign('left');
    context.setFontSize(15);
    context.fillText(proName1, 15 + 15, 150, );
    context.fillText(proName2, 15 + 15, 170, );
    // 商品图
    that.downLoadImg(proPic, 'ProdImg');
    var _proPic = wx.getStorageSync('ProdImg');
    context.drawImage(_proPic, that.data.themeData.windowWID / 2 - 65, 200, 150, 150);
    // 商品二维码
    that.downLoadImg(proCode, 'productCode');
    var _proCode = wx.getStorageSync('productCode');
    context.drawImage(_proCode, that.data.themeData.windowWID / 2 - 65, that.data.themeData.windowHEI * 0.9 - 115, 65, 65);
    // 指纹图片
    context.drawImage(code, that.data.themeData.windowWID / 2 + 15, that.data.themeData.windowHEI * 0.9 - 115, 65, 65);
    // 底部文字
    context.setFillStyle('#fff');
    context.setTextAlign('center');
    context.setFontSize(14);
    context.fillText('长按识别小程序码进行购买', that.data.themeData.windowWID / 2 + 15, that.data.themeData.windowHEI * 0.9 - 20);

    context.draw();

  },
  hideCode: function () {
    this.setData({
      'themeData.ifShowCode': false
    })
  },
  // 保存分享图片到本地相册
  //获取临时路径
  // 保存至相册
  save: function () {
    var that = this;
    wx.canvasToTempFilePath({
      canvasId: 'shareCanvas',
      success: function (res) {
        that.setData({
          sharePic: res.tempFilePath
        })
        wx.saveImageToPhotosAlbum({
          filePath: res.tempFilePath,
          success: function (res) {
            wx.showToast({
              title: '保存成功',
              duration: 1500,
            })
          },
          fail: function (res) {
            console.log(res)
            if (res.errMsg === "saveImageToPhotosAlbum:fail:auth denied") {
              console.log("打开设置窗口");
              wx.openSetting({
                success(settingdata) {
                  console.log(settingdata)
                  if (settingdata.authSetting["scope.writePhotosAlbum"]) {
                    console.log("获取权限成功，再次点击图片保存到相册")
                  } else {
                    console.log("获取权限失败")
                  }
                }
              })
            }
          }
        })
        console.log("生成的图片路径为" + that.data.sharePic);
      }
    })
  },
  imageLoad:function(e){
    //获取图片真实宽度  
    var imgwidth = e.detail.width,
      imgheight = e.detail.height,
      //宽高比  
      ratio = imgwidth / imgheight;
    //console.log(imgwidth, imgheight);
    //计算的高度值  
    var viewHeight = parseInt(this.data.scrollWidth) / ratio;
    var _imgheight = viewHeight.toFixed(0);
    // var imgheightarray = this.data.imgheights;
    //把每一张图片的高度记录到数组里
    // imgheightarray.push(imgheight);

    this.setData({
      imgheight: _imgheight,
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
  // 分享给好友
  shareDefault:function(){
    console.log('分享成功了吗');
    Page.onShareAppMessage();
  },
  // 拷贝分享链接
  copyLink:function(){
    console.log('开始拷分享链接');
    app.copyShareLink(this.data.themeData.products.product.id,);
  },
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }
})