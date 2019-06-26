var zcjy = require('zcjy/index.js');
//引入图片预加载组件
const ImgLoader = require('template/common/img-loader/img-loader.js');
//html解析
var WxParse = require('wxParse/wxParse.js');
App({
  onLaunch: function () {
    //获取ext第三方平台配置数据
    var extConfig = zcjy.getExtJsons();
    this.ext = extConfig;
    this.conf.server = extConfig.server
    this.getUserInfo();
    //隐藏tabbar
    // wx.hideTabBar();
    //启动先清除缓存
    //this.removeCache(['token']);
    //获取主题
    // this.getFuncSwithList();
    //获取所有的功能配置
    // this.getAllFunc();
    //获取系统的宽高度
    this.getSystemHeightAndWidth();

    // let that = this;
    // setTimeout(function(){
    //   that.request('/api/publish_credits_ex', function (res) {
    //     console.log(res);
    //   },{credit_service_id: 1}, true, 'POST',true);
    // },3000);

  },
  onShow: function () {
    //再次回来
    this.onLaunch();
    console.log('onShow');
  },
  onHide: function () {
    //用户退出小程序
    this.AutoCacheSet();
    console.log('onHide');
  },
  //重置checknow状态
  checknowStatus: function (status) {
    this.conf.checknow = status;
  },
  isContains: function (str, substr) {
    return zcjy.isContains(str, substr);
  },
  //判断主题是否存在
  getFileWhetherHas: function (obj = null, theme) {
    var that = this;
    wx.getFileInfo({
      filePath: 'template/' + theme,
      success: function (res) {
        // res.errMsg//接口调用结果
        // res.createTime//文件的保存时的时间戳，从1970/01/01 08:00:00 到当前时间的秒数
        // res.size//文件大小，单位B
      },
      complete: function (res) {
        console.log(theme);
        console.log(res);
        if (that.isContains(res.errMsg, 'fail file not exist')) {
          theme = that.ext.theme.parent;
        }
        if (!that.empty(obj)) {
          obj.setData({
            'themeData.theme': theme
          });
        }
      }
    });
  },
  /**
   * 定时任务
   */
  autoTask: function (types, times, task_name = 'cache_task') {
    var that = this;
    times = parseInt(times);
    if (types == "sec") {
      times = times * 1000;
    }
    if (types == "min") {
      times = times * 1000 * 60;
    }
    if (types == "hour") {
      times = times * 1000 * 60 * 60;
    }
    var timer = setInterval(function () {
      if (task_name == 'token_task') {
        that.getUserInfo();
      } else if (task_name == 'cache_task') {
        that.AutoCacheSet();
      }
    }, times);
    return timer;
  },
  /**
   * 退出登录
   */
  lougout: function () {
    wx.removeStorageSync('token');
    this.saveStorageName('hasLogin', false);
  },
  /**
   * 获取对应缓存的名称
   */
  getStorageName: function (name) {
    return zcjy.getStorageName(name);
  },
  /**
   * 存入任意缓存
   */
  saveStorageName: function (name, value) {
    return zcjy.saveStorageName(name, value);
  },
  //获取购物车的缓存
  getShopCartStorage: function () {
    var ShopCart = wx.getStorageSync('ShopCart') || [];
    //ShopCart=this.
    return ShopCart;
  },
  //直接存入购物车缓存 强制替换之前的
  saveShopCartStorage: function (shopcartlist) {
    wx.setStorageSync('ShopCart', shopcartlist);
  },
  //添加购物车缓存 可继续加
  addShopCartStorage: function (shopcartlist) {
    var ShopCart = wx.getStorageSync('ShopCart') || [];
    ShopCart.push(shopcartlist[0]);
    this.saveShopCartStorage(ShopCart);
    return ShopCart;
  },
  /**
   *获取用户信息及注册用户信息登录到系统
   */
  getUserInfo: function (parent_id = null, callback = null) {
    var that = this;
    //调用登录接口
    wx.login({
      success: function (loginCode) {
        console.log(loginCode);
        //基本用户信息
        var userInfo = {
          nickName: 'zcjytest',
          avatarUrl: 'http://thirdwx.qlogo.cn/mmopen/vi_32/Q0j4TwGTfTIK1sNKnrxOUFRnLZgAOsIrvmcoX7beYzDicFxGag8jqPsxtpsZuQ1ecLWJaeSd1RM3pngy6Sve8IA/132',
          gender: 1,
          province: '湖北',
          city: '武汉'
        }
        //线上版本直接使用哈
        if (that.conf.version != 'local') {
          wx.getUserInfo({
            success: function (res) {
              console.log(res.userInfo);
              userInfo = res.userInfo;
            }
          })
        }
        that.globalData.userInfo = userInfo;
        var login_data = {
          userInfo: {
            nickname: that.globalData.userInfo.nickName,
            head_image: that.globalData.userInfo.avatarUrl,
            sex: that.globalData.userInfo.gender == 1 ? '男' : '女',
            province: that.globalData.userInfo.province,
            city: that.globalData.userInfo.city,
          },
          code: loginCode.code,
          parent_id: parent_id
        };
        console.log('login_data:' + JSON.stringify(login_data));

        zcjy.request(that, '/api/mini_program/login', function (res) {
          console.log(res);
          if (!that.errorRes(res)) {
            that.globalData.token = res.data.data.token;
            that.saveStorageName('token', that.globalData.token);
            //登陆成功
            that.globalData.hasLogin = true;
            that.meInfo();
            if (typeof (callback) == 'function') {
              callback();
            }
          }
        }, login_data);

      }
    });
  },
  /**
   * 获取横幅
   * 传入参数[obj,slug](js对象,别名)
   */
  getBanners: function (obj, slug) {
    var that = this;
    var data = { slug: slug };
    zcjy.request(that, '/api/banners', function (res) {
      if (!that.errorRes(res)) {
        obj.setData({
          'themeData.imgUrls': res.data.data
        });
      } else {
        setTimeout(function () {
          that.getBanners(obj, slug);
        }, 1000);
      }
    }, data);
  },
  /**
   * 获取店铺列表
   * 传入参数[obj](js对象)
   */
  getShops: function (obj,callback=null) {
    var that = this;
    wx.getLocation({
      success: function (res) {
        console.log('longitude:' + res.longitude);
        console.log('latitude:' + res.latitude);
        let location = { jindu: res.longitude, 'weidu': res.latitude };
        zcjy.request(that, '/api/shops_all', function (res) {
          if (!that.errorRes(res)) {
            let shops = res.data.data;
            let min_index = 0;
            //处理最近的店铺
            for (var i in shops) {
              if (shops[i]['distance'] == shops['min_distance']) {
                min_index = i;
                shops[i]['min'] = true;
                that.globalData.shop_id = shops[i]['id'];
                that.saveStorageName('now_shop', shops[i]);
              }
            }
            obj.setData({
              'themeData.shops': shops,
              'themeData.shop_tab': min_index
            });
            that.saveStorageName('shops', res.data.data);
            if (typeof (callback) == 'function'){
              callback(res.data.data);
            }
          }
        }, location, true);
      }
    });
  },
  /**
   * 获取站内消息
   */
  getMessage: function (obj, unread = true) {
    var that = this;
    let api_data = unread
      ? {
        unread: true
      }
      : {

      };
    zcjy.request(that, '/api/auth_notices', function (res) {
      if (!that.errorRes(res)) {
        obj.setData({
          'themeData.messages': res.data.data
        });
      }
    }, api_data, true);
  },
  /**
   * 批量设置未读消息为已读
   */
  setMessageRead: function () {
    let that = this;
    zcjy.request(that, '/api/read_notices', function (res) {
      if (!that.errorRes(res)) {

      }
    }, {}, true);
  },
  /**
   * 用户服务
   */
  getServices: function (obj, status = '待使用') {
    var that = this;
    let api_data = { status: status };
    zcjy.request(that, '/api/auth_services', function (res) {
      if (!that.errorRes(res)) {
        obj.setData({
          'themeData.serives': res.data.data
        });
        that.saveStorageName('serives',res.data.data);
      }
    }, api_data, true);
  },
  /** 
  根据服务id获取对应二维码
  **/
  
  /**
   * 获取所有分类
   */
  getCatsAll: function (obj) {
    var that = this;
    zcjy.request(that, '/api/cats_all', function (res) {
      if (!that.errorRes(res)) {
        obj.setData({
          'themeData.cats': res.data.data
        });
      }
    });
  },
  /**
   * 获取所有公告消息
   */
  getNoticesAll: function (obj) {
    var that = this;
    zcjy.request(that, '/api/getNotices', function (res) {
      if (!that.errorRes(res)) {
        obj.setData({
          'themeData.gonggao': res.data.data
        });
        that.saveStorageName('gonggao', res.data.data);
      }
    });
  },
  // 根据消息id获取对应消息
  getNoticeById: function (obj) {
    var that = this;
    zcjy.request(that, '/api/getNotices', function (res) {
      if (!that.errorRes(res)) {
        obj.setData({
          'themeData.gonggao': res.data.data
        });
      }
    });
  },
  /**
   * 获取全部产品
   */
  getProductsAll: function (obj, skip = 0, take = this.conf.pageTake, select = false) {
    var that = this;
    var data = {
      skip: skip,
      take: take
    };
    zcjy.request(that, '/api/products', function (res) {
      if (!that.errorRes(res)) {
        let products = res.data.data;
        if (select) {
          for (var i = products.length - 1; i >= 0; i--) {
            products[i]['selected'] = false;
          }
        }
        obj.setData({
          'themeData.products': products
        });

      }
    }, data);
  },

  /**
   * 根据分类id获取当前的商品
   * 传入参数[obj,cat_id](js对象,分类id)
   */
  getCatProductByCatId: function (obj, cat_id, nowtab, select = false) {
    var that = this;
    that.loading();
    zcjy.request(that, '/api/products_of_cat?cat_id=' + cat_id, function (res2) {
      if (!that.errorRes(res2, obj)) {
        let products = res2.data.data;
        if (select) {
          for (var i = products.length - 1; i >= 0; i--) {
            products[i]['selected'] = false;
          }
        }
        obj.setData({
          'themeData.products': products,
          'themeData.productTab': nowtab
        });
        that.hideLoading();
      }
    });
  },
  /**
   * 根据产品id获取产品详情
   * 传入参数[obj,product_id](js对象,产品id)
   */
  getProductContentById: function (obj, product_id) {
    var that = this;
    that.loading();
    zcjy.request(that, '/api/product?id=' + product_id, function (res2) {
      if (!that.errorRes(res2, obj)) {
        that.conf.product.products = res2.data.data;

        obj.setData({

          'themeData.products': that.conf.product.products,

        });

        WxParse.wxParse('themeData.contents', 'html', that.conf.product.products.product.intro, obj, 5);
        that.hideLoading();
      }
    });
  },
  /* 根据产品id获取当前产品二维码 */
  getProductsCodeById: function (obj, product_id) {
    var that = this;
    zcjy.request(that, '/api/mini_program/product_code?product_id=' + product_id + '&token=' + that.globalData.token, function (res) {
      if (!that.errorRes(res, obj)) {
        obj.setData({
          product_code: 'https://shop-model.yunlike.cn' + res.data.data
        })
      }
    })
  },

  /**
   *函数描述:获取不同类型的产品 带分页
   *请求url:https://shop-model.yunlike.cn/api/types?/
   *传入参数[obj,skip,types,take](js对象,跳过多少个,类型默认不传入获取所有商品,一次拿多少)
   *说明1：types=new_products 新品推荐
   *说明2：types=team_sales 拼团产品
   *说明3：types=flash_sales 秒杀商品
   *请求成功更新对应页面的商品列表
   */
  getProducts: function (obj, skip = 0, types = '', time_beign = false, take = this.conf.pageTake) {
    var that = this;
    var product = types == '' ? 'products' : types;
    that.loading();
    var data = !time_beign ? {
      skip: skip,
      take: take
    } : {
        skip: skip,
        take: take,
        time_begin: time_beign
      };
    zcjy.request(that, '/api/' + product, function (res) {
      if (!that.errorRes(res)) {
        if (product == 'products') {
          console.log(res.data.data);
          if (res.data.data.length == 0) {
            obj.data.whetherShowMore = true;
            obj.setData({
              'themeData.whetherShowMore': true
            });
          }
          //obj.data.themeData = {},
          obj.setData({
            // allProduct: that.autoPushData(that.conf.index.allProduct, res.data.data),
            'themeData.allProduct': that.autoPushData(that.conf.index.allProduct, res.data.data)
          });
          //同时发起全部图片的加载
          that.startManyImagesLoad(obj.data.themeData.allProduct, obj);

          that.saveStorageName('index', obj.data);
        } else if (product == 'new_products') {
          that.conf.index.newProduct = res.data.data;
          obj.setData({
            'themeData.newProduct': that.conf.index.newProduct
          });
          that.startManyImagesLoad(obj.data.themeData.newProduct, obj);
        } else if (product == 'flash_sales') {
          that.conf.index.flash_sale_product = res.data.data;
          //秒杀专场页面中
          if (time_beign) {
            obj.setData({
              flash_sale_product: that.conf.index.flash_sale_product
            });
          } else {
            //首页
            obj.setData({
              'themeData.flash_sale_product': that.conf.index.flash_sale_product
            });
          }
        } else if (product == 'team_sales') {
          that.conf.index.team_sale_product = res.data.data;
          obj.setData({
            team_sale_product: that.conf.index.team_sale_product,
            'themeData.team_sale_product': that.conf.index.team_sale_product
          });
        } else if (product == 'sales_count_products') {
          obj.setData({
            sales_count_products: res.data.data,
            'themeData.sales_count_products': res.data.data
          });
          that.startManyImagesLoad(obj.data.themeData.sales_count_products, obj);
        }
        that.hideLoading();
      }
      else {
        setTimeout(function () {
          that.getProducts(obj, skip, types, time_beign, take);
        }, 1000);
      }
    }, data);
  },

  /**
   * 倒计时
   * 传入参数[end_time_detail,types](结束时间,类型默认是返回字符串)
   * 返回值[array或string](对应小时分钟秒)
   */
  ShowCountDown: function (end_time_detail, types) {
    end_time_detail = end_time_detail.replace(/-/g, '/');
    // console.log(end_time_detail);
    var dates = new Date(Date.parse(end_time_detail));
    // console.log(dates);
    var year = dates.getFullYear();
    // console.log('year:'+year);
    var month = dates.getMonth() + 1;
    var day = dates.getDate();
    var hour = dates.getHours();
    var min = dates.getMinutes();
    var sec = dates.getSeconds();
    var now = new Date();
    var endDate = new Date(year, month - 1, day, hour, min, sec);
    var leftTime = endDate.getTime() - now.getTime();
    var leftsecond = parseInt(leftTime / 1000);
    //如果时间小于0就过期
    if (leftsecond <= 0) {
      return false;
    }
    var day1 = Math.floor(leftsecond / (60 * 60 * 24));
    var hour = Math.floor((leftsecond - day1 * 24 * 60 * 60) / 3600);
    var minute = Math.floor((leftsecond - day1 * 24 * 60 * 60 - hour * 3600) / 60);
    var second = Math.floor(leftsecond - day1 * 24 * 60 * 60 - hour * 3600 - minute * 60);

    //"距离"+year+"年"+month+"月"+day+"日还有："+day1+"天"+hour+"小时"+minute+"分"+second+"秒"; 
    if (hour < 10) {
      hour = "0" + hour;
    }
    if (minute < 10) {
      minute = "0" + minute;
    }
    if (second < 10) {
      second = "0" + second;
    }

    if (types == 'index') {
      return [hour, minute, second];
    } else {
      return hour + ':' + minute + ':' + second;
    }
  },
  /**
   * 分割当前时间为偶数
   */
  countAllTimeByDetail: function (obj = '', type = 'hour') {
    var that = this;
    var myDate = new Date();
    if (type == 'hour') {
      var hour = myDate.getHours();
      if (hour % 2 != 0) {
        hour = hour - 1
      }
      var hour_arr = [hour, hour + 2, hour + 2 * 2, hour + 2 * 3, hour + 2 * 4];
      if (!that.empty(obj)) {
        obj.setData({
          time_arr: that.varifyTimeDisplay(hour_arr)
        });
      }
      return hour_arr;
    }
    else if (type == 'day') {
      var day = myDate.getDate();

      var month = myDate.getMonth() + 1;
      if (month < 10) {
        month = '0' + month;
      }
      month = month.toString();
      var day_arr = [month + '-' + day, month + '-' + (day + 1), month + '-' + (day + 2), month + '-' + (day + 3), month + '-' + (day + 4)];
      if (!that.empty(obj)) {
        obj.setData({
          time_arr: day_arr
        });
      }
      return day_arr;
    }

  },
  /**
   * 优化时间数组显示
   */
  varifyTimeDisplay: function (arr) {
    for (var i in arr) {
      if (arr[i] < 10) {
        arr[i] = "0" + arr[i]
      }
    }
    return arr;
  },

  /**
   * 倒计时接口
   * 传入参数[obj,end_time_detail,types](js对象,倒计时的时间,类型)
   * 返回值[timer](即定时的timer可用来重置销毁定时器)
   */
  returnTimer: function (obj, end_time_detail, types = 'defalut', index = false) {
    var that = this;
    var timer = setInterval(function () {
      if (!index) {

        obj.setData({
          timer: that.ShowCountDown(end_time_detail, types),
          delay: !that.ShowCountDown(end_time_detail, types) ? true : false
        });
      } else {
        obj.setData({
          'themeData.timer': that.ShowCountDown(end_time_detail, types)
        });
      }
    }, 1000);
    return timer;
  },

  /**
   * 倒计时开启
   * 传入参数[obj,types](js对象,类型)
   * 返回值[timer](即定时的timer可用来重置销毁定时器)
   */
  StartTimerApi: function (obj, types = 'defalut', index = false) {
    var that = this;
    zcjy.request(that, '/api/timer', function (res) {
      if (!that.errorRes(res)) {
        var date = res.data.data.date;
        //console.log(date);
        //console.log(that.ShowCountDown(date));
        return that.returnTimer(obj, date, types, index);
      } else {
        setTimeout(function () {
          that.StartTimerApi(obj, types, index);
        }, 1000);
      }
    });
  },
  /**
   * 整理购物车相同的商品
   */
  mergeCart: function (cart_list, one_item) {
    return zcjy.mergeCart(cart_list, one_item);
  },
  /**
 * 根据购物车列表对象
 * 计算购物车的总价及数量[shopCartList OBJECT](购车车列表对象)
 */
  countAllNumAndPrice: function (obj, shopCartList) {
    zcjy.countAllNumAndPrice(obj, shopCartList);
  },

  //加载中动画
  loading: function (times = this.conf.networkTimeout.request, without_delay = false, delay_time = this.conf.delay_time) {

    var that = this;
    that.load = true;
    if (!without_delay) {
      setTimeout(function () {

        if (that.load) {
          wx.showToast({
            title: '加载中',
            icon: 'loading',
            duration: times
          });
        }

      }, delay_time);
    }
  },
  //操作成功提示
  alert: function (title, success = 'success') {
    wx.showToast({
      title: title,
      icon: success,
      duration: 1000
    });
  },
  // 未选择商品时提交订单提示
  openAlert: function () {
    wx.showModal({
      content: '请选择商品',
      showCancel: false,
      success: function (res) {
        if (res.confirm) {
          console.log('用户点击确定')
        }
      }
    });
  },
  //隐藏加载动画
  hideLoading: function (delay_time = this.conf.delay_time) {
    //setTimeout(function () {
    this.load = false;
    wx.hideToast();
    //}, delay_time);
  },

  /**
   * 根据request返回的status_code处理401错误500错误(请求频率过高,高并发,服务器等问题)
   * 用户个人中心带token验证的用得到 
   * 传入参数:[wx_response object,obj object](reques返回的参数,js对象[列表页建议传入])
   **/
  errorRes: function (wx_response, obj = '') {
    var that = this;
    var status_code = parseInt(wx_response.data.status_code);
    var status = false;
    if (status_code == 401) {
      if (status_code == 401) {
        //存在401就重新拿一次token
        this.getUserInfo();
      }
      status = true;
      if (!that.empty(obj)) {
        //重载页面
        setTimeout(function () {
          obj.onLoad();
        }, 1000);
      }
    }
    if (status_code == 500) {
      wx.showModal({
        // title: '芸来商城提示',
        content: '服务器开了小差,请再等等',
        showCancel: false,
        confirmColor: that.conf.themeColor,
        success: function (res) {
          if (res.confirm) {
            // wx.navigateBack({
            //   delta: 1
            // });
          }
        },
      });
    }
    //console.log("response code:" + status_code);
    //后台发送过来的话就报错显示提示
    if (status_code == 1) {
      wx.showModal({
        // title: '芸来商城提示',
        content: wx_response.data.data,
        showCancel: false,
        confirmColor: that.conf.themeColor,
      });
    }
    return status;
  },
  /**
   * 用户积分记录
   * 传入参数(js对象,跳过多少个,一次拿多少个)
   */
  getCredits: function (obj, skip = 0, take = this.conf.pageTake) {
    var that = this;
    that.loading();
    wx.request({
      url: that.conf.server + '/api/credits?skip=' + skip + '&take=' + take + '&token=' + that.globalData.token,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (!that.errorRes(res, obj)) {
          obj.setData({
            'themeData.credits': res.data.data,
          });
          that.hideLoading();
        }
      }
    });
  },
  /**
   * 用户余额记录
   * 传入参数(js对象,跳过多少个,一次拿多少个)
   */
  getFunds: function (obj, skip = 0, take = this.conf.pageTake) {
    var that = this;
    that.loading();
    wx.request({
      url: that.conf.server + '/api/funds?skip=' + skip + '&take=' + take + '&token=' + that.globalData.token,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (!that.errorRes(res, obj)) {
          obj.setData({
            'themeData.funds': res.data.data,
            'themeData.myself': that.getStorageName('myself')
          });
          that.hideLoading();
        }
      }
    });
  },
  /**
   * 用户分佣记录
   * 传入参数(js对象,跳过多少个,一次拿多少)
   */
  getBouns: function (obj, skip = 0, take = this.conf.pageTake) {
    var that = this;
    that.loading();
    wx.request({
      url: that.conf.server + '/api/bouns?skip=' + skip + '&take=' + take + '&token=' + that.globalData.token,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (!that.errorRes(res, obj)) {
          obj.setData({
            bouns: res.data.data,
            user: that.getStorageName('myself')
          });
          that.hideLoading();
        }
      }
    });
  },
  /**
   * 推荐人列表
   * 传入参数(js对象,跳过多少个,一次拿多少个)
   */
  getParterners: function (obj, skip = 0, take = this.conf.pageTake) {
    var that = this;
    that.loading();
    wx.request({
      url: that.conf.server + '/api/parterners?skip=' + skip + '&take=' + take + '&token=' + that.globalData.token,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (!that.errorRes(res, obj)) {
          obj.setData({
            parterners: res.data.data
          });
          that.hideLoading();
        }
      }
    });
  },
  /**
 * 整理列表 加上状态位
 */
  autoAttachStatusForData: function (coupon_list) {
    return zcjy.autoAttachStatusForData(coupon_list);
  },
  /**
   * 优惠券列表
   * 传入参数(js对象,获取类型,跳过多少个,一次拿多少个)
   * types获取类型 -1所有 0未使用 1冻结 2已使用 3过期 4作废
   */
  getCoupons: function (obj, types, use_pay = false, skip = 0, take = this.conf.pageTake) {
    var that = this;
    that.loading();
    wx.request({
      url: that.conf.server + '/api/coupons' + '?skip=' + skip + '&type=' + types + '&take=' + that.conf.pageTake + '&token=' + that.globalData.token,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (!that.errorRes(res, obj)) {
          that.hideLoading();
          that.conf.coupons = res.data.data;
          obj.setData({
            'themeData.coupons': that.autoAttachStatusForData(res.data.data),
            'themeData.couponsTab': parseInt(types),
          });

          if (use_pay) {
            if (that.conf.coupons.length > 0) {
              obj.setData({
                'themeData.couponStatus': true
              });
            } else {
              that.alert('没有优惠券');
            }

          }

        }
      }
    });
  },
  /**
   * 订单列表
   * types 1全部 2待付款 3待发货 4待确认 5退换货
   */
  getOrdersList: function (obj, types, skip = 0) {
    types = parseInt(types);
    var currentTab = types - 1;
    var that = this;
    that.loading();
    var data = {
      type: types,
      skip: skip,
      take: that.conf.pageTake
    };
    zcjy.request(that, '/api/orders', function (res) {
      if (!that.errorRes(res, obj)) {
        that.hideLoading();
        //切换类型后要置空然后累加
        if (that.conf.orders.type != types) {
          that.conf.orders.orders = [];
          obj.setData({
            'themeData.whetherShowMore': false
          })
        }
        if (res.data.data.length == 0) {
          obj.setData({
            'themeData.whetherShowMore': true
          });
        }
        obj.setData({
          'themeData.orders': that.autoPushData(that.conf.orders.orders, res.data.data),
          'themeData.currentTab': currentTab
        });
        //给予对应的状态更新
        that.conf.orders.type = types;
      }
    }, data, true);
  },
  /*
   * 自动拆分合并两个数组或对象
   * 
   */
  autoPushData: function (data, res_data) {
    return zcjy.autoContactArr(data, res_data);
  },
  /**
   * 单个订单详情
   */
  getOrderById: function (obj, order_id) {
    var that = this;
    that.loading();
    wx.request({
      url: that.conf.server + '/api/order/' + order_id + '?token=' + that.globalData.token,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (!that.errorRes(res, obj)) {
          that.hideLoading();
          obj.setData({
            order: res.data.data
          });
        }
      }
    });
  },
  /**
   * 创建订单
   * 
   */
  payToOrder: function (inputs, callback) {
    var that = this;
    inputs['items'] = JSON.stringify(inputs['items']);//.replace('\\', '')
    wx.request({
      url: that.conf.server + '/api/order/create?token=' + that.globalData.token,
      header: {
        "Content-Type": "application/x-www-form-urlencoded"
      },
      method: "POST",
      data: inputs,
      success: function (res) {
        if (!that.errorRes(res)) {
          console.log('加入订单成功');
          // that.meInfo();
          // //跳转到订单支付
          // wx.redirectTo({
          //   url: '../orders/order_detail?order_id=' + res.data.data + '&pay_now=true',
          // });
          callback(res.data.data);
          //inputs['items'] = JSON.parse(inputs['items']);

        }
      }
    });
  },
  /**
   * 处理已经勾选的商品并且更新到购物车(只用在结算创建订单成功后)
   */
  dealWithSelectedProduct: function (items) {
    var that = this;
    //先获取购物车的缓存
    var shopcart = that.getShopCartStorage();
    for (var i in shopcart) {
      for (var k in items) {
        //删除选中的商品
        if (shopcart[i]['id'] == items[k]['id']) {
          shopcart.splice(i, 1);
        }
      }
    }
    console.log(shopcart);
    //然后存入缓存中去
    that.saveShopCartStorage(shopcart);
  },
  /**
   * 验证是true还是false
   */
  varifyDefault: function (status) {
    return zcjy.varifyDefault(status);
  },
  /**
   *过滤购物车中未选中的商品并且去除product和spec 
   *返回选中的商品列表
   */
  filterShopCart: function (shopcartlist) {
    var that = this;
    var shoplist = [];
    for (var i in shopcartlist) {
      if (shopcartlist[i]['selected']) {
        shoplist.push({
          id: shopcartlist[i]['id'],
          name: shopcartlist[i]['name'],
          qty: shopcartlist[i]['qty'],
          price: shopcartlist[i]['price'],
          total: shopcartlist[i]['total'],
          types: shopcartlist[i]['types']
        });
      }
    }
    return shoplist;
  },
  /**
   * 取消订单
   */
  cancelOrder: function (order_id, reason) {
    var that = this;
    wx.request({
      url: that.conf.server + '/api/order/cancel/' + order_id + '?reason=' + reason + '&token=' + that.globalData.token,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (res.data.code == 0) {
          wx.redirectTo({
            url: '../orders/orders',
          });
        }
      }
    });
  },
  /**
   * 用户个人信息
   * 传入参数(js对象)
   */
  meInfo: function (obj = null, callback = null) {
    var that = this;
    that.loading();
    that.request('/api/me',function(res){
      that.saveStorageName('myself', res);
        that.conf.user = res;
        if (!that.empty(obj)) {
          obj.setData({
            myself: that.conf.user,
            'themeData.myself': that.conf.user
          });
        } else {
          if (typeof (callback) == 'function') {
            callback(res);
          }
        }
        that.hideLoading();
    },{},true);
    /*
    wx.request({
      url: that.conf.server + '/api/me?token=' + that.globalData.token,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
     
      }
    });
    */
  },
  /**
   * 获取系统的高度及宽度
   * 传入参数(js对象)
   * 成功设置对应页面的winWidth和winHeight
   */
  getSystemHeightAndWidth: function (obj = '', is_theme = false) {
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.winWidth = res.windowWidth;
        that.winHeight = res.windowHeight;
        if (!that.empty(obj)) {
          is_theme ? obj.setData({
            'themeData.winWidth': res.windowWidth,
            'themeData.winHeight': res.windowHeight,
          })
            : obj.setData({
              'themeData.winWidth': res.windowWidth,
              'themeData.winHeight': res.windowHeight,
            });

        }
      }
    });
  },
  /**
   * 微信支付
   * 传入参数(js对象,订单id)
   * 成功跳转到订单列表
   */
  wechatPay: function (obj, order_id) {
    var that = this;
    that.loading();
    wx.request({
      url: that.conf.server + '/api/pay_weixin?order_id=' + order_id + '&token=' + that.globalData.token,
      header: {
        'content-type': 'application/json'
      },
      success: function (res) {
        if (!that.errorRes(res, obj)) {
          that.hideLoading();

          that.alert('支付成功');
          that.meInfo();
          wx.redirectTo({
            url: '../orders/orders',
          });
          //线上版本直接使用哈
          if (that.conf.version != 'local') {

            var wechat = JSON.parse(res.data.message);
            console.log(wechat);
            obj.setData({
              wechat: wechat
            });
            wx.requestPayment({
              'appId': wechat.appId,
              'timeStamp': wechat.timeStamp,
              'nonceStr': wechat.nonceStr,
              'package': wechat.package,
              'signType': wechat.signType,
              'paySign': wechat.paySign,
              'success': function (res) {
                console.log(res);
                console.log('调用成功');
                that.alert('支付成功');
                that.meInfo();
                wx.redirectTo({
                  url: '../orders/orders',
                });
              },
              'fail': function (res) {
                that.alert('支付失败');
                console.log('调用失败');
              }
            });

          }

        }
      }
    });
  },
  /**
   * 计算长度
   */
  countLength: function (obj) {
    return zcjy.countLength(obj);
  },
  /**
   * 判断是否为空
   */
  empty: function (data) {
    return zcjy.empty(data);
  },
  /**
   * 下拉公有回调
   * 函数名称,js对象,跳过多少个(每页取多少个)
   * 返回数量累计
   */
  commonpullUpLoad: function (func_name, obj, skip = this.conf.pageTake, types = '', cat_id = null) {
    if (!obj.data.whetherShowMore) {
      this.loading(1000);
      if (func_name == 'getProducts') {

        this.getProducts(obj, skip);

      } else if (func_name == 'getOrdersList') {
        this.getOrdersList(obj, types, skip);
      } else if (func_name == 'getCoupons') {
        this.getCoupons(obj, types, skip);
      } else if (func_name == 'getParterners') {
        this.getParterners(obj, skip);
      } else if (func_name == 'getCredits') {
        this.getCredits(obj, skip);
      } else if (func_name == 'getCollectList') {
        this.getCollectList(obj, skip);
      } else if (func_name == 'getProductsBycatid') {
        this.getProductsByCatId(obj, cat_id, skip);
      }
    }
    skip += this.conf.pageTake;
    return skip;
  },
  /**
 * 根据小时序列化当前时间
 */
  formatTimeByHour: function (hour) {
    return zcjy.formatTimeByHour(hour);
  },
  /**
   * 验证一下商品的促销类型
   * 秒杀 返回1
   * 拼团 返回5
   * 促销 返回3
   */
  varifyProductPrompType: function (product_obj, promp_obj) {
    var that = this;
    //先看类型
    var type = product_obj.prom_type;

    if (!that.empty(type) && !that.empty(promp_obj)) {
      //秒杀的
      //验证时间
      var now = parseInt(Date.parse(new Date()));

      console.log('now:' + now);

      console.log('time_begin:' + promp_obj.time_begin);

      //开始时间
      var time_begin = parseInt(Date.parse(promp_obj.time_begin));
      console.log('time_begin:' + time_begin);
      console.log('time_begin:' + promp_obj.time_end);

      //结束时间
      var time_end = parseInt(Date.parse(promp_obj.time_end));
      console.log('time_end:' + time_end);

      if (now >= time_begin && now <= time_end) {
        type = product_obj.prom_type;
      } else {
        type = 0;
      }
    }
    console.log('type:' + type);
    return type;
  },
  /**
   * 自动设置缓存时间 到期后清理
   */
  AutoCacheSet: function () {
    return zcjy.removeCache([
      'token',
      'index',
      'cat',
      'myself',
      'addressList',
      'collections',
      'theme',
      'allfunc',
      'founds_cat',
      'founds_post',
      'switch',
      'notices',
      'cats_root'
    ]);
  },
  /**
   * 删除指定缓存
   */
  removeCache: function (cache_arr) {
    return zcjy.removeCache(cache_arr);
  },
  /**
   * 自动验证缓存
   */
  AutoVarifyCache: function (cache_name, callback) {
    return zcjy.AutoVarifyCache(cache_name, callback);
  },
  /**
   * 获取功能开关列表
   */
  getFuncSwithList: function (obj = null, is_theme = false) {
    var that = this;
    that.loading();
    zcjy.request(that, '/api/getSystemSettingFunc', function (res) {
      if (!that.errorRes(res)) {
        that.hideLoading();
        that.conf.switch = res.data.data;
        that.saveStorageName('switch', that.conf.switch);
        if (!that.empty(obj)) {
          is_theme
            ?
            obj.setData({
              'themeData.switch': that.conf.switch
            })
            :
            obj.setData({
              'themeData.switch': that.conf.switch
            });

        }
      }
    });
  },
  /**
   * 处理对应的配置项
   */
  delWithFuncListName: function (funcdata) {
    var list = {};
    for (var i = funcdata.length - 1; i >= 0; i--) {
      var name = funcdata[i].name.toString();
      var val = this.empty(funcdata[i].value.toString()) ? false : true;
      list[name] = val;
    }
    return list;
  },
  /*获取当前页url*/
  getPageUrl: function () {
    return zcjy.getPageUrl();
  },
  /*获取当前页带参数的url*/
  getCurrentPageUrlWithArgs: function () {
    return zcjy.getCurrentPageUrlWithArgs();
  },
  //分享链接跳转
  shareUrlRedirect: function (detail = false, types = null) {
    var that = this;
    var share_obj;
    if (!detail) {
      share_obj = {
        title: that.conf.name,
        desc: that.conf.name,
        path: '/' + that.getPageUrl() + '?shareid=' + that.getStorageName('myself').user.id
      };
    } else {
      share_obj = {
        title: that.conf.name,
        desc: that.conf.name,
        path: '/' + that.getCurrentPageUrlWithArgs() + '&shareid=' + that.getStorageName('myself').user.id
      };
      if (types) {
        share_obj = {
          title: '【' + that.conf.name + '】' + types.product.name,
          desc: '我在' + that.conf.name + '发现了' + types.product.name + ',赶快点开来看看',
          imageUrl: types.product.image,
          path: '/' + that.getCurrentPageUrlWithArgs() + '&shareid=' + that.getStorageName('myself').user.id
        };
      }
    }
    return share_obj;
  },
  //拷贝分享链接到粘贴板
  copyShareLink: function (product_id, shareid) {
    var link = this.conf.server + '/product/' + product_id + 'shareid=' + shareid;
    wx.setClipboardData({
      data: link,
      success: function (res) {
        wx.getClipboardData({
          success: function (res) {
            console.log('res.data'+res.data) // data
          }
        })
      }
    });
  },
  //网络图片保存到本地
  saveImgFile: function (imgSrc) {
    wx.getSetting({
      success(res) {
        if (!res.authSetting['scope.writePhotosAlbum']) {
          wx.authorize({
            scope: 'scope.writePhotosAlbum',
            success() {
              wx.downloadFile({
                url: imgSrc,
                success: function (res) {
                  console.log(res);
                  //图片保存到本地
                  wx.saveImageToPhotosAlbum({
                    filePath: res.tempFilePath,
                    success: function (data) {
                      console.log(data);
                    },
                    fail: function (err) {
                      console.log(err);
                      if (err.errMsg === "saveImageToPhotosAlbum:fail auth deny") {
                        console.log("用户一开始拒绝了，我们想再次发起授权")
                        console.log('打开设置窗口')
                        wx.openSetting({
                          success(settingdata) {
                            console.log(settingdata)
                            if (settingdata.authSetting['scope.writePhotosAlbum']) {
                              console.log('获取权限成功，给出再次点击图片保存到相册的提示。')
                            } else {
                              console.log('获取权限失败，给出不给权限就无法正常使用的提示')
                            }
                          }
                        })
                      }
                    }
                  })
                }
              })
            }
          })
        }
      }
    })
  },
  //分享图片/二维码
  shareImage: function (e) {
    wx.previewImage({
      urls: e.currentTarget.dataset.src.split(',')
      // 需要预览的图片http链接  使用split把字符串转数组。不然会报错  
    })
  },
  //previewImage 预览图片
  previewImage: function (urls, index = 0) {
    wx.previewImage({
      current: urls[index],
      urls: urls
    });
  },
  //绑定推荐关系通过分享id和当前用户的openid
  bindShareRel: function (options) {
    var that = this;
    // wx.hideTabBar();
    if (typeof (options) == 'undefined') {
      options = { 'shareid': null };
    }
    //先验证缓存有没有
    that.AutoVarifyCache('token', function (e) {
      if (!e) {
        that.getUserInfo(options.shareid);
      }
    });
    console.log(options +'options');

    console.log('分享人的id是' + options.shareid + '你的openid是');

  },
  /**
   * 获取主题配置
   */
  getThemeSet: function (callback) {
    var that = this;
    that.loading();
    zcjy.request(that, '/api/themeNow', function (res) {
      if (!that.errorRes(res)) {
        that.hideLoading();
        callback(res);
        that.saveStorageName('theme', res.data.data);
      }
    });
  },
  /**
   * 获取颜色设置
   */
  getColorSet: function (obj = null, callback) {
    var that = this;
    that.AutoVarifyCache('theme', function (e) {
      if (!e) {
        that.getThemeSet(function (res) {
          if (!that.empty(obj)) {
            obj.setData({
              'themeData.maincolor': res.maincolor,
              'themeData.secondcolor': res.secondcolor,
              maincolor: res.maincolor,
              secondcolor: res.secondcolor
            });
          }
          var res = { maincolor: res.maincolor, secondcolor: res.secondcolor }
          if (typeof (callback) == 'function') {
            callback(res);
          }
        });
      } else {
        if (!that.empty(obj)) {
          obj.setData({
            'themeData.maincolor': e.maincolor,
            'themeData.secondcolor': e.secondcolor,
            maincolor: e.maincolor,
            secondcolor: e.secondcolor
          });
        }
        var res = { maincolor: e.maincolor, secondcolor: e.secondcolor }
        if (typeof (callback) == 'function') {
          callback(res);
        }
      }
    });
  },
  /**
   * 获取所有配置项
   */
  getAllFunc: function (callback) {
    var that = this;
    that.loading();
    zcjy.request(that, '/api/getAllFunc', function (res) {
      if (!that.errorRes(res)) {
        that.hideLoading();
        that.saveStorageName('allfunc', res.data.data);
        if (typeof (callback) == 'function') {
          callback(res.data.data);
        }
      }
    });
  },
  //从多维数组中通过一个关键key找到对应的value并且做对应的操作
  getArrValueByKey: function (key, val, callback) {
    return zcjy.getArrValueByKey(key, val, callback);
  },
  //获取指定的tabbar 并且让指定的tab高亮
  setTabBar: function (tab_theme_name, obj) {
    var that = this;
    //从配置中读取对应主题的tabbar
    var tabbar = that.tabBar[0][tab_theme_name];
    //把购物车得数量加上去
    that.AutoVarifyCache('ShopCart', function (e) {
      if (!e) {
        tabbar.num = e.length;
      }

    });
    that.tabBar[0][tab_theme_name] = tabbar;
    console.log(that.tabBar[0]);
    var list = tabbar['list'];
    for (var i = tabbar['list'].length - 1; i >= 0; i--) {
      //如果tabbar中配置的路径和当前的路径一致就加上active状态
      if (that.isContains(tabbar['list'][i]['pagePath'], that.getPageUrl())) {
        tabbar['list'][i]['active'] = true;
        console.log('tabbar:' + i + '高亮');
      }//然后把其他的tabbar重置下
      else {
        tabbar['list'][i]['active'] = false;
      }
    }

    obj.setData({
      'themeData.tabBar': tabbar,
      tabBar: tabbar
    });
  },
  /**
   * 获取话题分类列表
   **/
  getFoundsCats: function (obj) {
    var that = this;
    zcjy.request(that, '/api/post_cat_all', function (res) {
      if (!that.errorRes(res)) {
        obj.setData({
          'themeData.post_cat_all': res.data.data,
          post_cat_all: res.data.data
        });
        //同时发起全部图片的加载
        // that.startManyImagesLoad(obj.data.themeData.post_cat_all, obj);
        that.saveStorageName('founds_cat', res.data.data);
      }
    });
  },
  /**
   * 获取话题文章
   **/
  getFoundsPosts: function (obj, is_hot = 0, types = 0, use_drop = false, skip = 0, take = this.conf.pageTake) {
    //如果重置就不能继续请求
    if (obj.data.themeData.whetherShowMore) {
      ///return false;
    }
    var that = this;
    //请求数据
    var api_data = {
      types: types,
      skip: skip,
      take: take,
      is_hot: is_hot
    };
    zcjy.request(that, '/api/post_found', function (res) {
      if (!that.errorRes(res)) {
        //如果没有数据就提示啦
        if (res.data.data.length == 0) {
          use_drop ?
            obj.setData({
              'themeData.whetherShowMore': true
            }) : obj.setData({
              'themeData.whetherShowMore': true,
              'themeData.post_found': []
            });
          return false;
        }

        //转换内容
        for (var i = res.data.data.length - 1; i >= 0; i--) {
          res.data.data[i]['content'] = res.data.data[i]['content'].replace('<p>', '');
          res.data.data[i]['content'] = res.data.data[i]['content'].replace('</p>', '');
        }
        //如果要使用到下拉加载
        if (use_drop) {
          obj.setData({
            'themeData.post_found': that.autoPushData(that.conf.found.posts, res.data.data)
          });
        }
        //默认的话
        else {
          //WxParse.wxParse('themeData.contents['+i+']', 'html', obj.data.themeData.post_found[i]['content'], obj, 5)

          obj.setData({
            'themeData.post_found': res.data.data,
            post_found: res.data.data
          });

          if (!is_hot && !types) {
            that.saveStorageName('founds_post', res.data.data);
          }
        }
      }
    }, api_data);

  },
  //html解析成小程序view
  WxParse: function (view_data, html, format_data, obj, types = 5) {
    return WxParse.wxParse(view_data, html, format_data, obj, types);
  },
  //用户分享二维码
  shareCodes: function (user_id) {
    return (this.conf.server + '/qrcodes/user_share' + user_id + '.png');
  },
  getShareCodeById: function (obj, user_id) {
    var that = this;
    zcjy.request(that, '/api/mini_program/product_code?user_id=' + res.user.id + '&token=' + that.globalData.token, function (res) {
      if (!that.errorRes(res, obj)) {
        obj.setData({
          product_code: 'https://shop-model.yunlike.cn' + res.data.user_id + '.png'
        })
      }
    })
  },
  //绑定图片预加载插件
  bindImageLoad: function (obj) {
    //return obj.imgLoader = new ImgLoader(obj, obj.imageOnLoad.bind(obj));
  },
  //预加载图片
  loadImages(obj, type = "allproduct") {
    var that = this;
    if (type == "allproduct") {
      var allProduct = obj.data.themeData.allProduct;
      //同时发起全部图片的加载

      //that.imgLoader.load(item.image)

    }
  },
  //获取分享二维码
  getShareCode: function (obj) {
    var that = this;
    zcjy.request(that, '/api/mini_program/distribution_code', function (res) {
      if (!that.errorRes(res)) {
        console.log(res.data.data);
        obj.setData({
          user_share_code: that.conf.server + res.data.data
        });
      }
    }, {}, true);
  },
  //首页搜索框 商品搜索
  searchProducts: function (obj, word) {
    var that = this;
    var data = { query: word };
    //商品搜索详情
    zcjy.request(that, '/api/product_search', function (res) {
      if (!that.errorRes(res)) {
        obj.setData({
          'themeData.search_product_list': res.data.data,
          'themeData.search_val': word
        });
      }
    }, data);
  },
  // 根据消息id获取对应消息
  //获取可用的优惠券列表
  getCanUseCoupons: function (obj, inputs) {
    var that = this;
    inputs['items'] = JSON.stringify(inputs['items']);
    zcjy.request(that, '/api/coupons_canuse', function (res) {
      if (!that.errorRes(res)) {
        obj.setData({
          coupons: res.data.data,
        });
        if (res.data.data.length > 0) {
          obj.setData({
            couponStatus: true
          });
        } else {
          that.alert('没有优惠券');
        }
      }
    }, inputs, true, 'GET', true);
  },
  //选择单个优惠券
  selectOneCoupon: function (coupon_id, obj, inputs) {
    var that = this;
    inputs['items'] = JSON.stringify(inputs['items']);
    zcjy.request(that, '/api/coupons_use/' + coupon_id, function (res) {

      if (!that.errorRes(res)) {
        if (res.data.data.code == 0) {
          obj.setData({
            // coupons: res.data.message,
            couponStatus: false,
            couponUse: true,
            couponPrice: res.data.data.message.discount,
            coupon_id: res.data.data.message.coupon_id
          });
          //初始化结算金额
          obj.setNeedPay();
        }
        else {
          that.alert(res.data.data.message);
        }

      }

    }, inputs, true, 'GET', true);
  },
  //计算优惠价格
  cartPreference: function (obj, inputs, callback = null) {
    var that = this;
    inputs['items'] = JSON.stringify(inputs['items']);
    zcjy.request(that, '/api/cart/preference', function (res) {
      if (!that.errorRes(res)) {
        var myselfs = that.getStorageName("myself");
        obj.setData({
          cart: res.data.data,
          myself: myselfs,
          'themeData.myself': myselfs
        });
        callback(res.data.data, myselfs);
        //初始化金额
        obj.setNeedPay();
      }
    }, inputs, true, 'GET', true);
  },
  //根据店铺id获取服务
  getServicesByShopId: function (obj, shop_id, callback) {
    var that = this;
    zcjy.request(that, '/api/get_services_by_shop', function (res) {
      if (!that.errorRes(res)) {
        callback(res.data.data);
      }
    }, { shop_id: shop_id });
  },
  //根据服务id获取技师
  getJishiByServiceId: function (obj, service_id, callback) {
    var that = this;
    zcjy.request(that, '/api/get_technicicans_by_service', function (res) {
      if (!that.errorRes(res)) {
        callback(res.data.data);
      }
    }, { service_id: service_id });

  },
  //获取店铺营业时间
  getShopTimer: function (obj, callback) {
    var that = this;
    zcjy.request(that, '/api/sub_timer', function (res) {
      if (!that.errorRes(res)) {
        callback(res.data.data);
      }
    }, {}, true);
  },
  //新建预约
  newSubscribe: function (obj, callback) {
    var that = this;
    zcjy.request(that, '/api/new_subscribe', function (res) {
      if (!that.errorRes(res)) {
        callback(res.data.data);
      }
    }, obj.data.themeData.requestData, true);
  },
  //用户的预约列表
  authSubscribes: function (obj, skip = 0, take = this.conf.pageTake) {
    var that = this;
    let request_data = {
      skip: skip,
      take: take
    };
    zcjy.request(that, '/api/auth_subscribe', function (res) {
      if (!that.errorRes(res)) {
        obj.setData({
          'themeData.subscribes': res.data.data
        });
      }
    }, request_data, true);
  },
  //用户取消预约
  cancleSubscribe: function (obj, sub_id) {
    var that = this;
    let request_data = {
      id: sub_id
    };
    zcjy.request(that, '/api/auth_cancle_subscribe', function (res) {
      if (!that.errorRes(res)) {
        that.alert(res.data.data);
        wx.redirectTo({
          url: '../subscribe/subscribe',
        });
      }
    }, request_data, true);
  },
  //通用请求方式 对应处理逻辑在对应js页面实现
  request: function (request_url, callback = null, request_data = {}, token = false, method = 'GET', form = false) {
    let that = this;
    zcjy.request(that, request_url, function (res) {
      if (!that.errorRes(res)) {
        if (typeof (callback) == 'function') {
          callback(res.data.data);
        }
        else {
          callback(false);
        }
      }
    }, request_data, token, method, form);
  },
  //通过要遍历的图像对象及获取的参数来缓加载图片
  varifyImageLazyLoaded: function (foreach_element, src, image_word, callback, types = null) {
    var that = this;
    if (typeof (foreach_element) !== 'undefined' && foreach_element.length > 0) {
      for (var i = 0; i < foreach_element.length; i++) {
        if (foreach_element[i][image_word] == src) {
          foreach_element[i]['loaded'] = true
          if (types == 'allProduct') {
            that.conf.index.allProduct[i]['loaded'] = true
          }
        }
      }
      callback(foreach_element);
    }
  },
  //同时发起多张图片缓加载
  startManyImagesLoad: function (loaded_element, obj) {
    //同时发起全部图片的加载
    loaded_element.forEach(
      item => {
        obj.imgLoader.load(item.image)
      }
    );
  },
  //地图中打开 通过经纬度
  openMap: function (jindu, weidu) {
    wx.openLocation({
      longitude: Number(jindu),
      latitude: Number(weidu),
    })
  },
  //打电话
  phone: function (number) {
    wx.makePhoneCall({
      phoneNumber: number,
      success: function () {
        console.log('拨打电话' + number + '成功');
      }
    });
  },
  //上传文件
  upload_file(url, filePath, success, fail, name = 'file', formData = {}) {
    let that = this;
    console.log('a=' + filePath)
    wx.uploadFile({
      url: that.conf.server + url + '?token=' + that.globalData.token,
      filePath: filePath,
      name: name,
      header: {
        'content-type': 'multipart/form-data'
      }, // 设置请求的 header
      formData: formData, // HTTP 请求中其他额外的 form data
      success: function (res) {
        console.log(res);
        if (res.statusCode == 200 && !res.data.result_code) {
          typeof success == "function" && success(res.data);
        } else {
          typeof fail == "function" && fail(res);
        }
      },
      fail: function (res) {
        console.log(res);
        typeof fail == "function" && fail(res);
      }
    })
  },
  // 积分商城获取商品
  // 根据积分商品id获取对应商品的商品详情  
  //系统宽度
  winWidth: '',
  //系统高度
  winHeight: '',
  load: false,
  conf: {
    version: 'local',
    //公司芸来商城
    //亲爱的全球GO
    name: '到店系统',
    //略缩图
    default_img: '../../images/default.png',
    //功能开关
    switch: {
      //品牌街
      FUNC_BRAND: false,
      //商品促销
      FUNC_PRODUCT_PROMP: true,
      //订单优惠
      FUNC_ORDER_PROMP: false,
      //订单取消
      FUNC_ORDER_CANCEL: false,
      //退换货
      FUNC_AFTERSALE: false,
      //秒杀
      FUNC_FLASHSALE: true,
      //拼团
      FUNC_TEAMSALE: false,
      //优惠券
      FUNC_COUPON: true,
      //积分
      FUNC_CREDITS: true,
      //余额
      FUNC_FUNDS: true,
      //分销
      FUNC_DISTRIBUTION: false,
      //提现
      FUNC_CASH_WITHDRWA: false,
      //会员等级
      FUNC_MEMBER_LEVEL: false,
      //开发票
      FUNC_FAPIAO: false,
      //页面底部信息
      FUNC_FOOTER: false,
      //商品收藏
      FUNC_COLLECT: false,
      //显示技术支持
      FUNC_YUNLIKE: false,
      //微信支付
      FUNC_WECHATPAY: false,
      //微信(个人)支付
      FUNC_PAYSAPI: false,
      //支付宝支付
      FUNC_ALIPAY: false
    },
    //用户可用的优惠券
    coupons: [],
    //用户个人信息
    user: {
      userLevel: {
        name: '会员'
      }
    },
    //加载动画延迟时间
    delay_time: 800,
    //缓存时间[购物车 用户中心 地址 用缓存] 单位分钟
    cachetime: 15,
    //地址列表
    addressList: [],
    //每页显示数量
    pageTake: 12,
    //是否马上结算
    checknow: false,
    theme: 'social',
    //主题状态
    themeStatus: true,
    themeParent: 'default',
    //主题颜色
    themeColor: '#ff4e44',
    //token定时取时间
    tokenTime: 30,
    //服务器请求基本地址 'http://10.10.6.6/ShangDianV5.5/public'
    //公司商城地址: 'https://shop-model.yunlike.cn'
    // 亲爱的全球购地址:'https://quanqiugo.club'
    server: 'https://ajls3lyu.shop.qijianshen.xyz',
    //小程序appid  'wx02c2a117dc439ac3'
    //公司  wx51ab71ac2b03db3c
    //全球购  wx5669b891f3e907a7
    // 到店   wx2c93c8c281c6fa3c
    appid: 'wx2c93c8c281c6fa3c',
    //小程序secret 'cbea2a5a385b72c0cfaf4708e17c4b7f',
    //公司a2061cd4ddd846c22161939f08e6b25b
    // 全球购secret 59d28e294ceadc925ecdb31891795f81
    // 到店系统secret 9351f24fece0e6f7772448464f50bf8f
    secret: '9351f24fece0e6f7772448464f50bf8f',
    //首页
    index: {
      //首页横幅
      indexBanner: null,
      //推荐分类
      catRecommend: null,
      //新品推荐
      newProduct: null,
      //拼团商品 //促销商品
      team_sale_product: null,
      //秒杀商品 //促销商品
      flash_sale_product: null,
      //全部产品
      allProduct: []
    },
    //所有分类页面
    cat: null,
    //子分类带商品页面
    category: {
      currentCatId: null,
      currentChildCat: null,
      currentProduct: null,
    },
    //产品页面
    product: {
      products: null,
      fav_product_list: null
    },
    orders: {
      orders: [],
      type: 1
    },
    //购物车列表
    shopCartList: [],
    //单个购物车结构
    shopCartItem: [
      {
        id: '',//product_id _ spec_id
        name: '',//product_name spec_key_name
        qty: '',//数量默认是1
        price: "",//单价
        total: "",//总计多少钱
        types: "",//类型0不带规格 1带规格
        product: '',//加入的商品
        spec: '',//加入的规格信息
        selected: true
      }
    ],
    //发现
    found: {
      posts: [],
      posts_hot: []
    },
    //服务器请求超时时间
    "networkTimeout": {
      "request": 20000,
      "connectSocket": 20000,
      "uploadFile": 20000,
      "downloadFile": 20000
    }
  },
  shopCartList: [],
  //常用数据
  globalData: {
    hasLogin: false,
    userOpenId: null,
    userInfo: null,
    token: null,
    userUnionId: null,
    shop_id:0
  },
  //略缩图:
  imgThumb: 'http://storage.360buyimg.com/mtd/home/lion1483683731203.jpg',
  ext: {}
})
