$().ready(function() {
	$('#username').focus().select();
	$('body').keypress(function(event) {
		myKeyPress(event);
	});
	$.whale.initLogin();
});
/**
 * 响应登录按钮click事件
 */
function loginform() {
	var _form = $("#loginForm").validate({
		rules : {
			username : "required",
			password : "required"
		},
		messages : {
			username : $.language.getText('PROFILE_INFO_USERNAME_REQUIRED'),
			password : $.language.getText('PROFILE_INFO_PASSWORD_REQUIRED'),
				
		},
		errorLabelContainer : $("#fieldError")
	});

	if(_form.form()) {
		$("#fieldError").html('&nbsp;&nbsp;');
		var url = Util.getBaseUrl() + "/users/login.json";
		var params = {
			username : $("#username").val(),
			password : $("#passwd").val()
		};
		$.cookies.set("username", params.username);
		whaleService(url, "post", params, successLoginCallback, failLoginCallback);
	}

}

/**
 **登录成功后的回调函数，将ticket保存到本地cookie，并请求获取站点信息
 */
function successLoginCallback(data) {
	var wantedData=Util.getWantedObj("org.blade.whale.management.vo.ResultVO",data);
	if(wantedData&&wantedData.code=="success"){
		wantedData=wantedData.result;
		$.cookies.set("isSuperAdmin", wantedData.isSuperAdmin);
		$.cookies.set("user_type", 7);
		$.cookies.set("isAdmin", true);
		$.cookies.set("isDeveloper", true);
		$.cookies.set("isOther", true);
		top.location.href = 'index.html';
	}else{
		$('#fieldError').html('<lable id="_valid" style="font-size:12px">'+$.language.getText('PROFILE_INFO_USERNAME_PASSWORD_INVALID')+'</lable>');
		$('#fieldError').show();
	}
}

/**
 * 登录失败后的回调函数
 */
function failLoginCallback() {
	$('#fieldError').html('<lable id="_valid" style="font-size:12px">'+$.language.getText('PROFILE_INFO_USERNAME_PASSWORD_INVALID')+'</lable>');
	$('#fieldError').show();
}

/**
 * 响应重置按钮的click事件
 */
function resetform() {
	$("#username").val("");
	$("#passwd").val("");
	$("#fieldError").html('&nbsp;&nbsp;');
}

/**
 * 注册登录快捷键操作
 * @param {} evt
 * @return {Boolean}
 */
function myKeyPress(evt) {
	evt = (evt) ? evt : ((window.event) ? window.event : "")//兼容IE和Firefox获得keyBoardEvent对象
	var key = evt.keyCode ? evt.keyCode : evt.which;
	//兼容IE和Firefox获得keyBoardEvent对象的键值

	if(key == 13) {//同时按下了Ctrl和回车键
		loginform();
		return false;
	} else {
		if($('#_valid'))
			$('#_valid').remove();
	}
}
