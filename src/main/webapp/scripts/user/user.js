$user = {
	init : function() {
		$("#tabs").tabs({
			create : function() {
				$("#add_user").css("height", Util.getPanelHeight());
				$("#query_user_actions").css("height", Util.getPanelHeight());
			}
		}).addClass('ui-tabs-vertical ui-helper-clearfix');
		$("#tabs li").removeClass('ui-corner-top').addClass('ui-corner-left');
		this.drawStatusText();
		this.drawUserTable();
		this.drawUserButtonBar();
		this.drawUserActionButtonBar();
		this.drawUserActionTable();
		this.drawStatusText();
	},
	drawUserTable : function() {
		$("#user_grid").jqGrid(
				{
					datatype : "local",
					height : 250,
					colNames : [ $.language.getText('LABEL_USER_USERNAME'), $.language.getText('LABEL_USER_PASSWORD'), $.language.getText('LABEL_USER_SUPERADMIN')],
					colModel : [ {
						name : 'username',
						align : "center",
						width : 10
					}, {
						name : 'password',
						align : "center",
						width : 10
					},{
						name : 'superadmin',
						align : "center",
						width : 90
					}],
					multiselect : true,
					beforeSelectRow : function(id, event) {
						var ids = $("#user_grid").jqGrid('getGridParam', 'selarrrow');
						$("#user_grid").jqGrid("resetSelection");
						if ($.inArray(id, ids) == -1) {
							$("#user_grid").jqGrid("setSelection", id, true);
							enableButton("delete_user_button", function() {
								deleteUser()();
							});
						} else {
							disableButton("delete_user_button");
						}
					}
				});

		$("#user_grid").jqGrid('hideCol', ["password" ]);
		$("#user_grid").jqGrid("setGridWidth", Util.getGridWidth());

		fillUserGridData();
	},
	drawStatusText : function() {
		$.whale.drawAll();
	},
	drawUserButtonBar : function() {
		var userBarContent = "";
		userBarContent += "<li id='add_user_button'><img drawTitle='BUTTON_ADD_TEXT' " + "src='lib/css/img/buttons/add.png' /><label "
				+ "drawText='BUTTON_ADD_TEXT'></label></li>";
		userBarContent += "<li id='delete_user_button'><img drawTitle='BUTTON_DELETE_TEXT' " + "src='lib/css/img/buttons/delete.png' /><label "
				+ "drawText='BUTTON_DELETE_TEXT'></label></li>";
		$("#add_user .operate-bar").empty();
		$("#add_user .operate-bar").append(userBarContent);

		$("#add_user_button").click(function() {
			addUser();
		});
		$("#delete_user_button").click(function() {
			deleteUser();
		});

		disableButton("delete_user_button");
	},
	drawUserActionButtonBar : function() {
		$("#from_date").datepicker({
			dateFormat : "yy-mm-dd"
		});
		$("#to_date").datepicker({
			dateFormat : "yy-mm-dd"
		});
		$("#submit_list_actions").click(function() {
			listActions();
		});
		var url = Util.getBaseUrl() + "/users/listUsers.json";
		whaleGet(url, null, function(resultData) {
			var users = Util.getWantedObj("org.blade.whale.model.UserVO", resultData);
			if (users) {
				$.each(users, function(index, user) {
					$("#user_select").append("<option value='"+user.userName+"'>"+user.userName+"</option>");
				});
			}
			Util.fullScreenUnMask();
		});
		Util.fullScreenMask();
	},
	drawUserActionTable : function() {
		$("#user_actions_grid").jqGrid(
				{
					datatype : "local",
					height : 250,
					colNames : [ $.language.getText('LABEL_USER_USERNAME'), $.language.getText('LABEL_USER_ACTION'), $.language.getText('LABEL_USER_ACTION_TIMESTAMP')],
					colModel : [ {
						name : 'username',
						align : "center",
						width : 10
					}, {
						name : 'useraction',
						align : "center",
						width : 10
					},{
						name : 'timestamp',
						align : "center",
						width : 90
					}],
					multiselect : true
				});
		$("#user_actions_grid").jqGrid("setGridWidth", Util.getGridWidth());
	},
};

function addUser() {
	$("#user_config").load("views/user/add-user.html", function() {
		$user.drawStatusText();
		openAddInstanceDialog();
	});
}

function openAddInstanceDialog() {
	$("#user_config").dialog({
		title : $.language.getText('TITLE_NEW_USER_TEXT'),
		modal : true,
		beforeClose : function() {
			$(this).dialog("destroy");
			$(this).empty();
		},
		buttons : [ {
			text : $.language.getText('BUTTON_OK_TEXT'),
			click : function() {
				if ($("#username").val() == "" || $("#password").val() == "") {
					Util.alertErrorMessage($.language.getText('VALIDATION_ADD_USER'));
				} else {
					createUser();
					$(this).dialog("close");
				}

			}
		}, {
			text : $.language.getText('BUTTON_CANCEL_TEXT'),
			click : function() {
				$(this).dialog("close");
			}
		} ],
		width : 400
	});
}

function createUser() {
	var url = Util.getBaseUrl() + "/users/createUser.json";
	var params = {};
	params.username = $("#username").val();
	params.password = $("#password").val();
	params.issuperadmin = $("#superadmin")[0].checked;

	whalePost(url, params, function(resultData) {
		var result = Util.parseResultVO(resultData, "org.blade.whale.management.vo.ResultVO");
		if (result.code == 'success') {
		} else {
			Util.alertErrorMessage(result.message);
			$("#menu_user").trigger("click");
		}
		Util.fullScreenUnMask();
	});
	Util.fullScreenMask();
}

function fillUserGridData() {
	$("#user_grid").jqGrid('clearGridData');
	var url = Util.getBaseUrl() + "/users/listUsers.json";
	whaleGet(url, null, function(resultData) {
		var result = Util.getWantedObj("org.blade.whale.model.UserVO", resultData);
		setUsersGrid(result);
		Util.fullScreenUnMask();
	});

	Util.fullScreenMask();
}

function setUsersGrid(users) {
	if (users) {
		var users_data = [];
		$.each(users, function(index, user) {
			var data = {};
			data.username = user.userName;
			data.password = user.password;
			if (user.isSuperAdmin==true) {
				data.superadmin = $.language.getText('STATUS_YES');
			} else
				data.superadmin = $.language.getText('STATUS_NO');
			users_data.push(data);
		});
		for ( var i = 0; i <= users_data.length; i++)
			$("#user_grid").jqGrid('addRowData', i + 1, users_data[i]);
		disableButton("delete_user_button");
	}
}

function checkUserSelected() {
	if ($("#user_grid").jqGrid('getGridParam', 'selarrrow').length == 1) {
		return true;
	} else {
		Util.alertErrorMessage("只能且必须选中一个用户进行操作!");
		return false;
	}
}

function deleteUser() {
	if (checkUserSelected()) {
		var index = $('#user_grid').jqGrid('getGridParam', 'selrow');
		var instance = $('#user_grid').jqGrid('getRowData', index);
		openDeleteUserDialog(index, instance);
	}
}

function openDeleteUserDialog(index, user) {
	$("#user_delete_message_container").text($.language.getText('MESSAGE_CONFIRM_DELETE_USER') + user.username);
	$("#user_delete_message_container").dialog({
		title : $.language.getText('TITLE_DELETE_USER_TEXT'),
		modal : true,
		beforeClose : function() {
			$(this).dialog("destroy");
			$(this).empty();
		},
		buttons : [ {
			text : $.language.getText('BUTTON_OK_TEXT'),
			click : function() {
				var url = Util.getBaseUrl() + "/users/deleteUser.json";
				var username = user.username;
				var params = {};
				params.username = username;

				whalePost(url, params, function(resultData) {
					var result = Util.parseResultVO(resultData, "org.blade.whale.management.vo.ResultVO");
					if (result.code == 'success') {
						fillUserGridData();
					} else if (result.code == 'fail') {
						Util.alertErrorMessage(result.message);
					} else {
						Util.alertErrorMessage($.language.getText('MESSAGE_DELETE_USER_FAILED'));
					}
					Util.fullScreenUnMask();
				});
				Util.fullScreenUnMask();
				$(this).dialog("close");
			}
		}, {
			text : $.language.getText('BUTTON_CANCEL_TEXT'),
			click : function() {
				$(this).dialog("close");
			}
		} ]
	});
}

function listActions() {
	$("#user_actions_grid").jqGrid('clearGridData');
	var url = Util.getBaseUrl() + "/users/listUserActions.json";
	var params = {};
	params.username = $("#user_select").val();
	params.fromDate = $("#from_date").val();
	params.toDate = $("#to_date").val();
	whalePost(url, params, function(resultData) {
		var result = Util.getWantedObj("org.blade.whale.model.UserActionVO", resultData);
		setUserActionsGrid(result);
		Util.fullScreenUnMask();
	});

	Util.fullScreenMask();
}

function setUserActionsGrid(userActions) {
	if (userActions) {
		var user_actions_data = [];
		$.each(userActions, function(index, userAction) {
			var data = {};
			data.username = userAction.username;
			data.useraction = userAction.action;
			data.timestamp = userAction.timeStamp;
			user_actions_data.push(data);
		});
		for ( var i = 0; i <= user_actions_data.length; i++)
			$("#user_actions_grid").jqGrid('addRowData', i + 1, user_actions_data[i]);
	}
}