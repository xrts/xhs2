function signUpGroup(container) {
	this.container = container;
	this.activityId = null; //活动ID
	this.styleType = 1; //样式类型，1：吸附右侧样式；2：吸附左侧样式
	this.stylebackGround = "#f90";
	this.hintMessage = null; //容错提示
	this.getCodeBtn = null; //获取验证码按钮
	this.imgCodeBtn = null; //获取图片验证按钮
	this.submitBtn = null; //提交按钮
	this.html = ""; //获取验证码
	this.ajaxData = {
		callback: '_cb'
	}; //ajax提交数据
	this.signupJson = {};
	this.timer = null; //获取验证码倒计时
	this.isGetCode = false; //获取验证码控制，是否点击过
	this.oneClick = false; //只提交一次
	this.success = null;
	this.getPicVerifyUrl = 'http://house.ifeng.com/sale/api/getverifycode?s=';
	this.getValidverifycode = 'http://house.ifeng.com/sale/api/validverifycode';
}
signUpGroup.prototype = {
	init: function() {
		var me = this;
		if (this.isPC()){
			var oLink = $('<link rel="stylesheet" type="text/css" href="http://s0.ifengimg.com/2017/03/15/add-signup_e1937837.css"/>');
			this.container.css("background-image",'url('+this.stylebackGround+')');
			me.signupJson = [{"name":"username"},{"name":"mobile"},{"name":"message"},{"name":"imgmessage"}];
		}else{
			var oLink = $('<link rel="stylesheet" type="text/css" href="http://s0.ifengimg.com/2017/11/03/sign_d5556fe5.css">');
			me.signupJson = [{"name":"username"},{"name":"mobile"},{"name":"message"}];
		}

		this.container.before(oLink); //添加样式文件
		this.container.addClass("signup-style" + this.styleType);
		
		me.addDetail();
		me.bind();

	},
	bind: function() {
		var me = this;

		//点击图片验证码切换
		me.imgCodeBtn.attr("src", me.getPicVerifyUrl + Math.random());
		me.imgCodeBtn.on("click", function(){
			me.captchasTag = false;
			me.imgCodeBtn.attr("src", me.getPicVerifyUrl + Math.random());
		});


		//报名点击
		this.submitBtn.on('click', function(){
			if(me.oneClick) return;
			me.oneClick = true;

			if (me.check()) {
				for(i in me.signupJson){
					me.ajaxData[me.signupJson[i].name] = $.trim(me.container.find("#" + me.signupJson[i].name).val());
				}

				$.ajax({
					type: "GET",
					url: "http://house.ifeng.com/signup/api/apply",
					dataType: 'jsonp',
					jsonp: "_cb",
					data: {
						id: me.activityId,
						post:me.ajaxData
					},
					success: function(data) {
						if (data.errno == 0) {
							me.alertMessage(0, "恭喜报名成功!!");
							clearInterval(me.timer);
							me.getCodeBtn.html("获取验证码");
							if(me.success){
								me.success();
							}
						}else{
							if(data.msg == 'ok' || data.msg == 'exist'){
								alert("恭喜报名成功!!");
							}
							
						}
						me.oneClick = false;
					}
				});
			}else{
				me.oneClick = false;
			}
		});

		//发送验证码
		this.getCodeBtn.on("click", function() {	
			if(me.isGetCode){
				return;
			}

			var mobile = $.trim(me.container.find("#mobile").val());
			var imgmessage = $.trim(me.container.find("#imgmessage").val());
			var getBtn = $(this);
			var s = 60;

			var mobileFlag = /^(0|86|17951)?(13[0-9]|15[012356789]|17[0678]|18[0-9]|14[57])[0-9]{8}$/.test(mobile) ? mobile : '';

			if(mobileFlag == ''){
				me.showWarn("请输入正确手机号");
				return false;
			}else if(me.isPC() && imgmessage == ''){
				me.showWarn("请输入图片验证码");
				return false;
			}else{

				if(me.isPC()){
					//验证图片验证码
					$.ajax({
						type: "POST",
						url: "http://house.ifeng.com/sale/api/validverifycode",
						dataType: 'jsonp',
						jsonp: "_cb",
						data: {
							"code": imgmessage,
						},
						success: function(json) {
							if (json.errno == 0) {
								me.ajaxData.mobile = mobile;
								$.ajax({
									type: "POST",
									url: "http://house.ifeng.com/signup/api/sendidentifyingcode",
									dataType: 'jsonp',
									jsonp: "_cb",
									data: {
										"signUpMobile": mobile,
										"piccode": imgmessage,
										"callback": '_cb',
										"token_message": GBL.token_message
									},
									success: function(json) {
										if (json.errno == 0) {
											me.imgCodeBtn.attr("src", me.getPicVerifyUrl +"?s=" + Math.random())
											me.isGetCode = true;
											me.showWarn("验证码发送成功");
											$(this).html("60s");
											me.timer = setInterval(function() {
												s--;
												getBtn.html(s + "s");
												if (s == 0) {
													clearInterval(me.timer);
													getBtn.html("获取验证码");
													me.isGetCode = false;
												}
											}, 1000);
										}else{
											me.showWarn(json.msg);
										}
									}
								});
							}else{
								me.showWarn(json.msg);
							}
						}
					});
				}else{
					me.ajaxData.mobile = mobile;
					$.ajax({
						type: "POST",
						url: "http://house.ifeng.com/signup/api/sendidentifyingcode",
						dataType: 'jsonp',
						jsonp: "_cb",
						data: {
							"signUpMobile": mobile,
							"callback": '_cb',
							"token_message": GBL.token_message
						},
						success: function(json) {
							if (json.errno == 0) {
								me.imgCodeBtn.attr("src", me.getPicVerifyUrl +"?s=" + Math.random())
								me.isGetCode = true;
								me.showWarn("验证码发送成功");
								$(this).html("60s");
								me.timer = setInterval(function() {
									s--;
									getBtn.html(s + "s");
									if (s == 0) {
										clearInterval(me.timer);
										getBtn.html("获取验证码");
										me.isGetCode = false;
									}
								}, 1000);
							}else{
								me.showWarn(json.msg);
							}
						}
					});
				}	
				
			}		

		});

		//激活输入框 隐藏容错
		this.container.find("input").on("focus", function() {
			me.hintMessage.html("");
		});

	},
	addDetail: function() { //添加报名团内容 姓名 手机号 验证码
		this.html = "";

		this.html += '<li>' +
						'<input type="text" class="input1" name="username" id="username" value="" placeholder="您的姓名">' +
					'</li>' +
					'<li>' +
						'<input type="text" class="input1" name="mobile" id="mobile" value="" placeholder="您的手机号码">' +
					'</li>';
		if(this.isPC()){
			this.html += '<li>' +
							'<input type="text" class="input2" name="imgmessage" id="imgmessage" value="" placeholder="输入验证码">' +
							'<img id="getimgCode" src="http://house.ifeng.com/sale/api/getverifycode?s=0.4980527254723368" alt="">' +
						'</li>';
		}
					
		this.html += '<li>' +
						'<input type="text" class="input2" name="message" id="message" value="" placeholder="输入验证码">' +
						'<span id="getCode">获取验证码</span>' +
					'</li>';


		this.html = '<ul>' + this.html + '<li class="hint-btn">' +
			'<span class="warning-message" id="warning-message"></span>' +
			'<div id="submit">提交信息</div>' +
			'</li></ul>';

		this.container.html(this.html);

		this.hintMessage = this.container.find("#warning-message");
		this.getCodeBtn = this.container.find("#getCode");
		this.imgCodeBtn = this.container.find("#getimgCode");
		this.submitBtn = this.container.find("#submit");

	},
	//验证
	check: function() {
		var me = this;
		for (var i in this.signupJson) {
			if (this.signupJson[i].name == "username") {
				var username = $.trim(this.container.find("#" + this.signupJson[i].name).val());
				if (/^([\u4e00-\u9fa5]+|([a-zA-Z]+\s?)+)$/.test(username)) {
					this.ajaxData[this.signupJson[i].name] = username;
				} else {
					this.showWarn("请输入正确姓名");
					return false;
				}
			} else if (this.signupJson[i].name == "mobile") {
				var mobile = $.trim(this.container.find("#" + this.signupJson[i].name).val());
				if (/^(0|86|17951)?(13[0-9]|15[012356789]|17[678]|18[0-9]|14[57])[0-9]{8}$/.test(mobile)) {
					this.ajaxData[this.signupJson[i].name] = mobile;
				} else {
					this.showWarn("请输入正确手机号");
					return false;
				}
			} else if (this.signupJson[i].name == "message") {
				var message = $.trim(this.container.find("#" + this.signupJson[i].name).val());
				if (!!message) {
					this.ajaxData[this.signupJson[i].name] = message;
				} else {
					this.showWarn("验证码不能为空");
					return false;
				}
			}else if (this.signupJson[i].name == "imgmessage") {
				var imgmessage = $.trim(this.container.find("#" + this.signupJson[i].name).val());
				if (!!imgmessage) {
					this.ajaxData[this.signupJson[i].name] = imgmessage;
				} else {
					this.showWarn("验证码不能为空");
					return false;
				}
			}else {
				var value = $.trim(this.container.find("#" + this.signupJson[i].name).val());
				if (value) {
					this.ajaxData[this.signupJson[i].name] = value;
				}
			}
		}
		return true;
	
	},
	showWarn: function(val) {
		this.hintMessage.html(val);
	},
	alertMessage: function(type, msg){
		var oAlert = $('<div class="alertMessage"><div>' +
			'<p class="message' + type + '">' + msg + '</p>' +
			'<a href="javascript:;" >确定</a>' +
			'</div></div>');
		this.container.append(oAlert);
		oAlert.find('a').on('click', function() {
			oAlert.detach();
		});
	},
	isPC: function(){
		return !(this.mobilecheck() || this.tabletCheck() && window == window.top)
	},
	mobilecheck: function(){
		return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Mobi/i.test(navigator.userAgent) || screen.width < 500
	},
	tabletCheck: function(){
		return /ipad|android|android 3.0|xoom|sch-i800|playbook|tablet|kindle/i.test(navigator.userAgent)
	}

};