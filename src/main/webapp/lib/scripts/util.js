var Util = {
	getHost : function() {
		return window.location.host;
	},

	getPath : function() {
		var fullpath = window.location.pathname;

		return fullpath.substring(0, fullpath.lastIndexOf("/") + 1);
	},

	getAppName : function() {
		var pathName = this.getPath();
		return pathName.substr(0, pathName.lastIndexOf("/"));
	},

	getFullContextPath : function() {
		return "http://" + this.getHost() + this.getPath();
	},

	getBaseUrl : function() {
		var pathName = this.getPath();
		var contextName = pathName.substr(0, pathName.lastIndexOf("/"));
		return "http://" + this.getHost() + contextName;
	},

	getWantedObj : function(key, target) {
		if (target.list && target.list.length) {
			if (target.list.length == 1 && typeof key == "string") {
				if (this.isArray(target.list[0][key])
						|| target.list[0][key] == ""
						|| target.list[0][key] == undefined)
					return target.list[0][key];
				else {
					var arr = [];
					arr.push(target.list[0][key]);
					return arr;
				}
			}
		} else if (target[key] && typeof key == "string") {
			return target[key];
		}
		return null;
	},
	
	isArray : function(value) {
		return Object.prototype.toString.apply(value) === '[object Array]';
	},

	strToJson : function(str) {
		if (str.indexOf("'") > 0)
			return eval("(" + str + ")");
		else if (str.indexOf("\"") > 0)
			return eval('(' + str + ')');

	},

	jsonToString : function(obj) {
		var THIS = this;
		switch (typeof(obj)) {
			case 'string' :
				return '"' + obj.replace(/(["\\])/g, '\\$1') + '"';
			case 'array' :
				return '[' + obj.map(THIS.jsonToString).join(',') + ']';
			case 'object' :
				if (obj instanceof Array) {
					var strArr = [];
					var len = obj.length;
					for (var i = 0; i < len; i++) {
						strArr.push(THIS.jsonToString(obj[i]));
					}
					return '[' + strArr.join(',') + ']';
				} else if (obj == null) {
					return 'null';

				} else {
					var string = [];
					for (var property in obj)
						string.push(THIS.jsonToString(property) + ':'
								+ THIS.jsonToString(obj[property]));
					return '{' + string.join(',') + '}';
				}
			case 'number' :
				return obj;
			case false :
				return obj;
		}
	},

	revertToArray : function(obj) {
		if (this.isArray(obj) || obj == "" || obj == undefined)
			return obj;
		else {
			var arr = [];
			arr.push(obj);
			return arr
		}

	},

	arrayToString : function(obj) {
		if (this.isArray(obj)) {
			var str = "";
			$.each(obj, function(index, data) {
						str += data + ",";
					});
			return str.substring(0, str.length - 1);
		} else {
			return obj.toString() + "";
		}
	},

	mask : function(id, loadTxt) { // add mask div
		if (!loadTxt)
			loadTxt = "Loading...";
		if ($("#" + id))
			$("#" + id).mask(loadTxt);
	},
	fullScreenMask : function() {
		$("#mask").show();
		this.mask("mask");
	},
	unmask : function(id) { // remove mask div
		if ($("#" + id))
			$("#" + id).unmask();
	},

	fullScreenUnMask : function() {
		$("#mask").hide();
		this.unmask("mask");
	},

	alert : function(title, message) {
		$("#dialog_message").html(message);
		$("#dialog_message").dialog({
					title : title,
					modal : true,
					autoOpen : true,
					beforeClose : function() {
						$(this).dialog("destroy");
						$(this).empty();
					},
					buttons : [{
								text : $.language.getText("BUTTON_OK_TEXT"),
								click : function() {
									$(this).dialog("close");
								}
							}]
				});
	},

	alertErrorMessage : function(message) {
		this.alert($.language.getText('TITLE_ERROR_MESSAGE_TEXT'), message);
	},

	confirm : function(title, message, fn) {
		$("#dialog_message").html(message);
		$("#dialog_message").dialog({
					title : title,
					modal : true,
					autoOpen : true,
					buttons : [{
								text : $.language.getText("BUTTON_OK_TEXT"),
								click : function() {
									fn();
									$(this).dialog("close");
								}
							}, {
								text : $.language.getText("BUTTON_CANCEL_TEXT"),
								click : function() {
									$(this).dialog("close");
								}
							}]
				});
	},

	parseResultVO : function(resultData, key) {
		var result = {};
		var data = resultData["org.blade.whale.management.vo.ResultVO"];
		result.code = data.code;
		result.message = data.message;
		var list = data.result;
		if (list && list[key]) {
			if (this.isArray(list[key])) {
				result.list = list[key];
			} else {
				result.list = [];
				result.list.push(list[key]);
			}
		} else {
			result.list = [];
		}
		return result;
	},

	getGridWidth : function() {
		return $(window).width() * 0.75;
	},
	getPanelHeight : function() {
		return $(window).height() - 142;
	}
};

var contextPath = Util.getAppName();

function disableButton(id) {
	$("#" + id).addClass("disabled");
	$("#" + id).unbind("click");
}

function enableButton(id, func) {
	$("#" + id).unbind("click");
	$("#" + id).removeClass("disabled");
	$("#" + id).bind("click", func);
}