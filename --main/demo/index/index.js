import university from 'data.js'
Page({
  data: {
    name: '',
    phone: '',
    school: '',
    isjiantou:true,   //箭头切换
    selectcontent:university.result,
    value:undefined,   //选中的值
    valueid:undefined,  //选中的id
    gender: '',
    latitude: '',
    longitude: '',
    WXid:'',
    openid:'',
    meetingId:'',
    school:undefined
  },
  inputName: function (e) {
    this.setData({
      name: e.detail.value
    });
  },
  inputPhone: function (e) {
    this.setData({
      phone: e.detail.value
    });
  },
  
  // 下拉框收起和下拉
  changejiantou(){
    this.setData({
      isjiantou:!this.data.isjiantou
    })
  },
  onLoad: function () {
    this.setData({
      selectcontents:this.data.selectcontent
    })
  },
  // 下拉框收起和下拉
  changejiantou(e){
    this.setData({
      isjiantou:!this.data.isjiantou,
      school:this.data.value
    })
  },
  // 选择数据后回显
  changecontent(e){
    this.setData({
      value:e.currentTarget.dataset.datavalue.name,
      valueid:e.currentTarget.dataset.datavalue.id,
      isjiantou:true
    })
    // 每次输入的值都应该等于搜索后选中的值
    this.setData({
      school:this.data.value
    })
  },
  // 搜索功能
  search(e){
    var val = e.detail.value
    var arr = [];
    for (var i = 0; i < this.data.selectcontents.length; i++) {
      if (this.data.selectcontents[i].name.indexOf(val) >= 0) {
        arr.push(this.data.selectcontents[i]);
      } 
    }
    // this.setData({
    //   selectcontent: arr
    // })
    if (arr.length==0) {
      wx.showToast({
        title: '请正确输入学校名称',
        icon:'none',
        duration:550
      })
      this.setData({
        // selectcontent: [{id:1,name:null}]
        school: ''
      })
    }
    else{
      this.setData({
        selectcontent: arr
      })
    }
  },
  radioChange: function (e) {
    this.setData({
      gender: e.detail.value
    });
  },
  //获取openid
  getOpenId: function () {
		let openId = ''
		uni.login({
			success: res => {
				//code值(5分钟失效)
				let code = res.code;
				//小程序appid
        let appid = '	wx3a7bb549834858ce'; //小程序id
        //小程序secret
        let secret = 'ea9cbfb136de7f81ea19be7edc9700a7'; //密钥  
				//wx接口路径
				let url = 'https://api.weixin.qq.com/sns/jscode2session';
				uni.request({
					url: url, // 请求路径
					data: {
						appid: appid,
						secret: secret,
						js_code: code,
						grant_type: 'authorization_code'
					}, // 请求体
					method: 'GET', //请求方法,
					header: {}, //请求头
					success: result => {
						//响应成功
						//这里就获取到了openid了
						uni.setStorage({
							key: 'openId',
							openid: result.data.openid
						})
					},
					fail: err => {} //失败
				});
			}
		});
	},

  // 获取地理位置
  getLocation: function () {
    wx.getLocation({
      type: 'wgs84',
      success: (res) => {
        this.setData({
          latitude: res.latitude,
          longitude: res.longitude
        });
      },
      fail: (err) => {
        console.log('获取地理位置失败', err);
      }
    });
  },
  // 提交表单
  submitForm: function () {
    this.getOpenId();
    // 先获取地理位置
    this.getLocation();
    const formData = {
      name: this.data.name,
      phone: this.data.phone,
      school:this.data.school,
      gender: this.data.gender,
      latitude: this.data.latitude,
      longitude: this.data.longitude,
      openid:this.data.openid
    };
    console.log(formData);
    // 这里只是模拟发送请求到后端，实际需要使用 wx.request 发送真实请求
    wx.request({
      url: 'http://172.25.100.206:8080/meeting/meetingRecord/signin', // 替换为真实后端接口地址
      method: 'POST',
      data: formData,
      success: (res) => {
        if (res.data.success) {
          wx.showToast({
            title: '签到成功',
            icon:'success'
          });
        } else {
          wx.showToast({
            title: '签到失败',
            icon: 'error'
          });
        }
      },
      fail: (err) => {
        wx.showToast({
          title: '网络请求失败',
          icon: 'error'
        });
      }
    });
  }
});
