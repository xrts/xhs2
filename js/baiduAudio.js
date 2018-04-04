	function baiduAudio(elementID, words, audioIdx){
		this.musicH5 = document.getElementById(elementID);
		this.words = words;
		this.activePlayer = null;
		this.embed = null;
		this.name = null;
		this.audio = null;
		this.content = null;
		this.Mp3Url = null;
		this.isPlay = false;
		this.baiduUrl = "http://tts.baidu.com/text2audio";
		this.audioIdx = audioIdx;
		// this.wow = document.getElementById("wow");
	}
	baiduAudio.prototype = {
		init: function(){
			var me = this;
			me.play();
			me.musicH5.onclick = function(event){//开关控制
				
				// var currIdx = parseInt($("#photoswipe_2 .curnumber").html()) - 1;
				var currIdx = parseInt($(".list1 .swiper-slide-active").index());
				if(currIdx == me.audioIdx){
					if(me.isPlay){
						me.activePlayer.pause();
						me.isPlay = false;
						me.musicH5.className = "";
					}else{
						me.activePlayer.play();
						me.isPlay = true;
						me.musicH5.className = "current";
					}
				}else{
					me.words = audioWords[currIdx];
					me.audioIdx = currIdx;
					me.changePlay();
					me.activePlayer.play();
					me.isPlay = true;
					// me.musicH5.src='http://s0.ifengimg.com/2017/10/31/play_c378df2e.png';
					me.musicH5.className = "current";
				}
				
				// me.wow.value = me.activePlayer.src;
			};
			
		},
		getMp3Url: function(){//百度请求数据返回mp3链接
			this.content = this.words;
			return this.baiduUrl + "?idx=1" + "&tex=" + encodeURIComponent(encodeURIComponent(this.content)) + "&cuid=baidu_speech_demo" + "&cod=2" + "&lan=zh&ctp=1" + "&pdt=1" + "&spd=5&per=3&vol=5&pit=5"
		},
		playForNoH5: function(){//embed
			var me = this;
			me.activePlayer && (me.activePlayer.pause()/*, $(activePlayer).remove()*/);
			me.name = "j-embed-" + (new Date - 0);
			me.embed = document.createElement('embed');
			me.embed.id = me.name;
			// me.wow.value = me.Mp3Url;
			me.embed.src = me.Mp3Url;
			me.embed.autostart = false ;
			me.musicH5.appendChild(me.embed);
			me.activePlayer = document.getElementById(me.name);
			//me.active();
		},
		playForH5: function(){//H5
			var me = this;
			me.activePlayer && me.activePlayer.pause();
			me.audio = new Audio(me.Mp3Url);
			me.activePlayer = me.audio,
					me.audio.src = me.Mp3Url;
			me.active();
		},
		active: function(){//监听播放状态
			var me = this;
			me.activePlayer.onpause = function(){//暂停
				me.musicH5.src='http://s0.ifengimg.com/2017/11/09/play_e168ab81.png';
				me.musicH5.className = "";
				me.isPlay = false;
			};
			me.activePlayer.onended = function() {//结束
				me.musicH5.src='http://s0.ifengimg.com/2017/11/09/play_e168ab81.png';
				me.musicH5.className = "";
				me.isPlay = false;
			};
			me.activePlayer.onplaying = function() {//播放
				me.musicH5.src='http://s0.ifengimg.com/2017/11/09/pause_6fb0ab09.png';
				me.musicH5.className = "current";
				me.isPlay = true;
			};
			//me.activePlayer.play();
		},
		play: function(){//执行
			this.Mp3Url = this.getMp3Url();
			document.createElement("audio").canPlayType && document.createElement("audio").canPlayType("audio/mpeg") ? this.playForH5() : this.playForNoH5()
		},
		changePlay: function(){
			//更新语音mp3
			this.Mp3Url = this.getMp3Url();
			document.createElement("audio").canPlayType && document.createElement("audio").canPlayType("audio/mpeg") ? this.audio.src = this.Mp3Url : this.embed.src = this.Mp3Url;
		},
		pause: function(){
			me.activePlayer && me.activePlayer.pause && me.activePlayer.pause();
		}
	};