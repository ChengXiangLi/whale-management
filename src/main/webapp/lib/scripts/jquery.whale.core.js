$.whale = $.extend({
	setting : {
		theme : 'default',
		language : 'zh-cn',
		cookie_theme_key : 'whale_theme',
		cookie_language_key : 'whale_language',
		theme_path : contextPath + '/lib/theme/',
		i18n_path : contextPath + '/lib/i18n/'
	},
	cookieOption : {
		//domain: '*.whale.com',
		//path: '/infoOne',
		expiresAt : new Date(2011, 12, 01)
		//secure: true
	},
	
	initLogin : function(){
		if($.isCookiesOpen(false)) {
			var l = $.cookies.get(this.setting.cookie_language_key);
			
			if(l != null) {
				this.setting.language = l.toLowerCase();
			} else {
				//toUpperCase
				this.setting.language = this.getBrowserLanguage();
			}
			var s = [this.setting.i18n_path + this.getLanguage() + '/config-' + this.getLanguage() + '.js?' + this.setting.version];
			$LAB.setOptions({
				AllowDuplicates : true
			}).script(s).wait(function() {
				$.whale.drawAll();
			});

		}
		
	},
	/**
	 * @description 初始化语言和皮肤
	 *
	 */
	init : function(_call) {
		if($.isCookiesOpen(false)) {
			if(null == $.cookies.get("user_type")){//未通过登录验证
				this.showLogin();
			}
			var t = $.cookies.get(this.setting.cookie_theme_key);
			var l = $.cookies.get(this.setting.cookie_language_key);
			if(t != null) {
				this.setting.theme = t;
			}

			if(l != null) {
				this.setting.language = l.toLowerCase();
			} else {
				//toUpperCase
				this.setting.language = this.getBrowserLanguage();
			}
			this.appendThemeStyle();
			this.appendLanguageScript(_call);

		}
	},
	/**
	 * @description 获取浏览器默认语言
	 *
	 * @return
	 */
	getBrowserLanguage : function() {
		var lang = navigator.language || navigator.userLanguage;
		return lang.toLowerCase();
	},
	/**
	 * @description 设置语言
	 * @param _language 语言
	 * @param _call 回调函数
	 */
	setLanguage : function(_language, _call) {
		if($.isCookiesOpen(true)) {
			if($base.appConfig.write_cookie)
				$.cookies.set(this.setting.cookie_language_key, _language.toLowerCase(), this.cookieOption);
			this.removeLanguageScript();
			this.setting.language = _language.toLowerCase();
			this.appendLanguageScript(_call);
		}
	},
	/**
	 * @description 删除语言js
	 *
	 */
	removeLanguageScript : function() {
		var s = 'script[src=\'' + this.setting.i18n_path + this.getLanguage() + '/config-' + this.getLanguage() + '.js?' + $base.appConfig.version + '\']';
		var vs = 'script[src=\'' + this.setting.i18n_path + this.getLanguage() + '/jquery.validationEngine-' + this.getLanguage() + '.js?' + $base.appConfig.version + '\']';
		$(s).remove();
		$(vs).remove();
	},
	/**
	 * @description 添加语言js
	 * @param _call 回调函数
	 */
	appendLanguageScript : function(_call) {
		var s = [this.setting.i18n_path + this.getLanguage() + '/config-' + this.getLanguage() + '.js?' + $base.appConfig.version, this.setting.i18n_path + this.getLanguage() + '/jquery.validationEngine-' + this.getLanguage() + '.js?' + $base.appConfig.version];
		$LAB.setOptions({
			AllowDuplicates : true
		}).script(s).wait(function() {_call()
		});
	},
	/**
	 * @description 删除皮肤样式
	 *
	 */
	removeThemeStyle : function() {
		var l = 'link[href=\'' + this.setting.theme_path + this.getTheme() + '/css.css?' + $base.appConfig.version + '\']';
		$(l).remove();
	},
	/**
	 * @description 添加皮肤样式
	 *
	 */
	appendThemeStyle : function() {
		this.loadCSS(this.setting.theme_path, [this.setting.theme + '/css.css']);
	},
	testLanguage : function() {
		$.jGrowl($.getText('COOKIE_OPEN_TEXT'), {
			life : 3000
		});
	},
	/**
	 * @description 获取语言
	 *
	 * @return
	 */
	getLanguage : function() {
		return this.setting.language;
	},
	/**
	 * @description 设置皮肤
	 * @param _theme 皮肤名字
	 */
	setTheme : function(_theme) {
		if($.isCookiesOpen(true)) {
			if($base.appConfig.write_cookie)
				$.cookies.set(this.setting.cookie_theme_key, _theme, this.cookieOption);
			this.removeThemeStyle();
			this.setting.theme = _theme;
			this.appendThemeStyle();
		}
	},
	/**
	 * @description 获取皮肤
	 *
	 * @return
	 */
	getTheme : function() {
		return this.setting.theme;
	},
	/**
	 * @description cookie是否已经打开
	 *
	 * @param _bool：true,false.是否showMsg
	 * @return 返回 true(打开)，false(关闭)
	 */
	isCookiesOpen : function(_bool) {
		var r = $.cookies.test();
		if(!r && _bool) {
			$.jGrowl($.getText('COOKIE_OPEN_TEXT'), {
				life : 3000
			});
		}
		return r;
	},
	/**
	 * @description 动态加载css
	 * @param _path 路径
	 * @param _files 样式名称
	 */
	loadCSS : function(_path, _files,callback) {
		$.each(_files, function(index, value) {
			var name = value.replace(/^\s|\s$/g, "");
			var att = name.split('.');
			var ext = att[att.length - 1].toLowerCase();
			if(ext == "css") {
				if(!callback){
					callback=function(){
					};
				}
				$e = document.createElement("link");
				$e.setAttribute('type', 'text/css');
				$e.setAttribute('rel', 'stylesheet');
				$e.setAttribute('href', _path + name + '?' + $base.appConfig.version);
				if($.browser.msie){
					var url=$e.outerHTML;
					 document.createStyleSheet(_path + name + '?' + $base.appConfig.version);
					 callback();
				}else{
					
					$($e).remove();
					$.whale.loadFile($e,callback, 'head');
				}
			}
		});
	},
	
	loadFile:function(element, _callback, parent) {
        var p = parent && parent != undefined ? parent : "head";
        document.getElementsByTagName(p)[0].appendChild(element);
       
        if (_callback) {
            //ie
            if ($.whale.browser.ie) {
                element.onreadystatechange = function () {
                    if (this.readyState == 'loaded' || this.readyState == 'complete'||this.readyState=="interactive") {
                        _callback();
                    }
                };
            } else if ($.whale.browser.moz) {
                //element.onload = function () {
                    _callback();
                //};
            } else {
                _callback();
            }
        }
    },
	/**
	 * @description 渲染页面全部的文字
	 */
	drawAll : function() {
		this.drawElementText($('html [drawText]'));
		this.drawElementHtml($('body [drawHtml]'));
		this.drawElementTitle($('body [drawTitle]'));
		this.drawElementValue($('body [drawValue]'));
		this.refreshmenu();
	},
	/**
	 * @description 渲染这个id区域中的Text
	 * @param _araeId 渲染区域id
	 */
	drawAreaTextById : function(_araeId) {
		this.drawElementText($('#' + _araeId + ' [drawText]'));
	},
	/**
	 * @description 渲染class区域中的Text
	 * @param _class 渲染class
	 */
	drawAreaTextByClass : function(_class) {
		this.drawElementText($('.' + _class + ' [drawText]'));
	},
	/**
	 * @description 渲染某个元素下的Text
	 * @param _e 渲染元素
	 */
	drawAreaText : function(_e) {
		this.drawElementText($(_e + ' [drawText]'));
	},
	/**
	 * @description 渲染页面显示内容
	 * @param _o 对象
	 *
	 */
	drawElementText : function(_o) {
		$.each(_o, function() {
			$(this).text($.language.getText($(this).attr('drawText')));
		});
	},
	/**
	 * @description 渲染页面显示内容
	 * @param _o 对象
	 *
	 */
	drawElementValue : function(_o) {
		$.each(_o, function() {
			$(this).val($.language.getText($(this).attr('drawValue')));
		});
	},
	/**
	 * @description 渲染页面显示内容，内容为html格式
	 * @param _o 对象
	 */
	drawElementHtml : function(_o) {
		$.each(_o, function() {
			$(this).html($.language.getText($(this).attr('drawHtml')));
		});
	},
	
	/**
	 * @description 渲染class区域中的，内容为html格式
	 * @param _class 
	 */
	drawElementHtmlByClass : function(_class) {
		this.drawElementHtml($('.' + _class + ' [drawHtml]'));
	},
	/**
	 * @description 渲染页面Title 标签内容
	 * @param _o 对象
	 */
	drawElementTitle : function(_o) {
		$.each(_o, function() {
			$(this).attr('title', $.language.getText($(this).attr('drawTitle')));
		});
	},
	refreshmenu : function() {
		this.drawElementText($('ul[role="menu"] [drawText]'));
	},
	/**
	 * @description 设置Tip
	 */
	setTip : function() {
		$.whale.drawElementTitle($('body [drawTitle]'));

		$('.tip').poshytip({
			className : 'tip-twitter',
			showTimeout : 300,
			alignTo : 'target',
			alignX : 'center',
			offsetY : 5,
			allowTipHover : false,
			container : '#content'
		});
		$('.formTip').poshytip({
			className : 'tip-twitter',
			showOn : 'focus',
			alignTo : 'target',
			alignX : 'right',
			alignY : 'center',
			offsetX : 5,
			container : 'body',
			liveEvents : true,
			container : '#content'
		});
	},
	/**
	 * 将一个JSON对象转换为字符串
	 * @param o json对象
	 * @return 返回转换后的字符串
	 */
	json2string : function(o) {
		if(o == undefined) {
			return "";
		}
		var r = [];
		if( typeof o == "string")
			return "\"" + o.replace(/([\"\\])/g, "\\$1").replace(/(\n)/g, "\\n").replace(/(\r)/g, "\\r").replace(/(\t)/g, "\\t") + "\"";
		if( typeof o == "object") {
			if(!o.sort) {
				for(var i in o)
				r.push("\"" + i + "\":" + this.json2string(o[i]));
				if(!!document.all && !/^\n?function\s*toString\(\)\s*\{\n?\s*\[native code\]\n?\s*\}\n?\s*$/.test(o.toString)) {
					r.push("toString:" + o.toString.toString());
				}
				r = "{" + r.join() + "}";
			} else {
				for(var i = 0; i < o.length; i++)
				r.push(this.json2string(o[i]));
				r = "[" + r.join() + "]";
			}
			return r;
		}
		return o.toString().replace(/\"\:/g, '":""');
	},
	/**
	 * 将一个日期对象转换成JSON对象
	 * @param date 日期对象
	 * @return 转换后的JSON对象
	 */
	date2json : function(date) {
		var jsonDate = {};
		jsonDate.date = date.getDate();
		jsonDate.day = date.getDay();
		jsonDate.hours = date.getHours();
		jsonDate.minutes = date.getMinutes();
		jsonDate.month = date.getMonth();
		jsonDate.seconds = date.getSeconds();
		jsonDate.time = date.getTime();
		jsonDate.timezoneOffset = date.getTimezoneOffset();
		jsonDate.year = date.getYear();
		return jsonDate;
	},
	/**
	 * 显示登录界面
	 */
	showLogin : function() {
		var _protocol = window.location.protocol;
		var _host = window.location.host;
		var _search = window.location.search;
		var _url = _protocol + '//' + _host + contextPath + '/login.html';
		top.location.href = _url;
	},
	/**
	 * @description 格式千分位
	 * @param num 需要格式的数字
	 */
	formatMoney : function(num,type) {
		num = num.toString().replace(/\$|\,/g, '');
		if(isNaN(num))
			num = "0";
		sign = (num == ( num = Math.abs(num)));
		num = Math.floor(num * 100 + 0.50000000001);
		cents = num % 100;
		num = Math.floor(num / 100).toString();
		if(cents < 10)
			cents = "0" + cents;
		for(var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++)
		 num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
		 if(type==1)
			return (((sign) ? '' : '-') + num + '.' + cents);
		return (((sign) ? '' : '-') + num);
	},
	
	/**
	 * @description 将nodeRef节点转换提交到服务器
	 */
	getContentId : function(nodeRef) {
        return nodeRef.replace("://", "_").replace('/', '_');
    }
});
