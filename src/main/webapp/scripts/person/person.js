var PERSON_TABLE_TYPE = "PERSON";
$person = {
	init : function() {
		$("#tabs").tabs({
			create : function() {
				$("#import-person-data").css("height", Util.getPanelHeight());
				$("#query-person-data").css("height", Util.getPanelHeight());
				$("#export-person-data").css("height", Util.getPanelHeight());
			}
		}).addClass('ui-tabs-vertical ui-helper-clearfix');
		$("#tabs li").removeClass('ui-corner-top').addClass('ui-corner-left');
		this.drawStatusText();
		$("#person-submit-query").unbind("click");
		$("#person-submit-query").bind("click", function() {
			submitPersonQuery();
		});
		$("#person-submit-export").unbind("click");
		$("#person-submit-export").bind("click", function() {
			submitPersonExport();
		});
		this.drawFileButtonBar();
		this.drawFileGrid();
		this.drawStatusText();
		initPersonUploadForm();
		initPersonInputFields();
	},
	drawFileGrid : function() {
		$("#person-file-grid").jqGrid(
				{
					datatype : "local",
					height : 250,
					colNames : [ $.language.getText('LABEL_FILE_NAME')],
					colModel : [ {
						name : 'filename',
						align : "center",
						width : 20
					}],
					multiselect : true,
					beforeSelectRow : function(id, event) {
						var ids = $("#person-file-grid").jqGrid('getGridParam', 'selarrrow');
						$("#person-file-grid").jqGrid("resetSelection");
						if ($.inArray(id, ids) == -1) {
							$("#person-file-grid").jqGrid("setSelection", id, true);
							enableButton("person-import-file", function() {
								importFile();
							});
							enableButton("person-delete-file", function() {
								deleteFile();
							});
						} else {
							disableButton("person-import-file");
							disableButton("person-delete-file");
						}
					}
				});

		$("#person-file-grid").jqGrid("setGridWidth", Util.getGridWidth());

		fillFileGridData();
	},
	drawStatusText : function() {
		$.whale.drawAll();
	},
	drawFileButtonBar : function() {
		var userBarContent = "";
		userBarContent += "<li id='person-import-file'><img drawTitle='BUTTON_IMPORT_TEXT' " + "src='lib/css/img/buttons/import.png' /><label "
				+ "drawText='BUTTON_IMPORT_TEXT'></label></li>";
		userBarContent += "<li id='person-delete-file'><img drawTitle='BUTTON_DELETE_TEXT' " + "src='lib/css/img/buttons/delete.png' /><label "
		+ "drawText='BUTTON_DELETE_TEXT'></label></li>";
		$("#import-person-data .operate-bar").empty();
		$("#import-person-data .operate-bar").append(userBarContent);

		disableButton("person-import-file");
		disableButton("person-delete-file");
	}
};

function initPersonUploadForm() {
	var bar = $('.bar');
	var percent = $('.percent');
	var status = $('#status');
	   
	$("#person-import-file-form").ajaxForm({
	    beforeSend: function() {
	        status.empty();
	        var percentVal = '0%';
	        bar.width(percentVal)
	        percent.html(percentVal);
	    },
	    uploadProgress: function(event, position, total, percentComplete) {
	        var percentVal = percentComplete + '%';
	        bar.width(percentVal)
	        percent.html(percentVal);
	    },
	    success: function() {
	        var percentVal = '100%';
	        bar.width(percentVal)
	        percent.html(percentVal);
	        fillFileGridData();
	    },
		complete: function(xhr) {
			status.html(xhr.responseText);
		}
	}); 
}

function initPersonInputFields() {
	var queryInputs = $("#person-query-condition").find("input");
	$.each(queryInputs, function(index, value) {
		if (value.type == 'checkbox') {
			if (value.name == "full" || value.name == "fuzzy") {
				var inputId = "#" + value.id + "-input";
				$(inputId).prop("disabled", true);
			} else if (value.name == "range") {
				var inputId1 = "#" + value.id + "-input1";
				$(inputId1).prop("disabled", true);
				var inputId2 = "#" + value.id + "-input2";
				$(inputId2).prop("disabled", true);
			}
		}
	});
	$("#person-query-condition input").unbind("click");
	$("#person-query-condition input").bind("click", function() {
		if (this.name == "full" || this.name == "fuzzy") {
			var inputId = "#" + this.id + "-input";
			if (this.checked) {
				$(inputId).prop("disabled", false);
			} else {
				$(inputId).prop("disabled", true);
			}
		} else if (this.name == "range") {
			var inputId1 = "#" + this.id + "-input1";
			var inputId2 = "#" + this.id + "-input2";
			if (this.checked) {
				$(inputId1).prop("disabled", false);
				$(inputId2).prop("disabled", false);
			} else {
				$(inputId1).prop("disabled", true);
				$(inputId2).prop("disabled", true);
			}
		}
	});
	
	var queryFields = $("#person-query-fields").find("input");
	$("#person-query-select-all").unbind("click");
	$("#person-query-select-all").bind("click", function(){
		if ($("#person-query-select-all")[0].checked) {
			$.each(queryFields, function(index, value) {
				if (value.type == 'checkbox') {
					value.checked = true;
				}
			});
		} else {
			$.each(queryFields, function(index, value) {
				if (value.type == 'checkbox') {
					value.checked = false;
				}
			});
		}
	});
	
	var exportInputs = $("#person-export-condition").find("input");
	$.each(exportInputs, function(index, value) {
		if (value.type == 'checkbox') {
			if (value.name == "full" || value.name == "fuzzy") {
				var inputId = "#" + value.id + "-input";
				$(inputId).prop("disabled", true);
			} else if (value.name == "range") {
				var inputId1 = "#" + value.id + "-input1";
				$(inputId1).prop("disabled", true);
				var inputId2 = "#" + value.id + "-input2";
				$(inputId2).prop("disabled", true);
			}
		}
	});
	$("#person-export-condition input").unbind("click");
	$("#person-export-condition input").bind("click", function() {
		if (this.name == "full" || this.name == "fuzzy") {
			var inputId = "#" + this.id + "-input";
			if (this.checked) {
				$(inputId).prop("disabled", false);
			} else {
				$(inputId).prop("disabled", true);
			}
		} else if (this.name == "range") {
			var inputId1 = "#" + this.id + "-input1";
			var inputId2 = "#" + this.id + "-input2";
			if (this.checked) {
				$(inputId1).prop("disabled", false);
				$(inputId2).prop("disabled", false);
			} else {
				$(inputId1).prop("disabled", true);
				$(inputId2).prop("disabled", true);
			}
		}
	});
	
	var exportFields = $("#person-export-fields").find("input");
	$("#person-export-select-all").unbind("click");
	$("#person-export-select-all").bind("click", function(){
		if ($("#person-export-select-all")[0].checked) {
			$.each(exportFields, function(index, value) {
				if (value.type == 'checkbox') {
					value.checked = true;
				}
			});
		} else {
			$.each(exportFields, function(index, value) {
				if (value.type == 'checkbox') {
					value.checked = false;
				}
			});
		}
	});
	$("#person-query-header").hide();
}

function submitPersonQuery() {
	var queryFields = "", queryCondition = "", colNames = [];
	var inputs = $("#person-query-condition").find("input");
	var first = true;
	var valid = false;
	$.each(inputs, function(index, input) {
		if (input.type == 'checkbox' && input.checked) {
			var cond = "";
			if (input.name == "full") {
				var inputId = "#" + input.id + "-input";
				var value = $(inputId).attr("value");
				if(!checkValue(value)){
					Util.alertErrorMessage("已选中的输入框[" + input.value + "]不能为空");
					valid = true;
					return;
				}
				cond = input.value + "= '" + value + "' ";
			} else if (input.name == "fuzzy") {
				var inputId = "#" + input.id + "-input";
				var value = $(inputId).attr("value");
				if (!checkValue(value)) {
					Util.alertErrorMessage("已选中的输入框[" + input.value + "]不能为空");
					valid = true;
					return;
				}
				cond = input.value + " LIKE '%" + value + "%' ";
			} else if (input.name == "range") {
				var inputId1 = "#" + input.id + "-input1";
				var inputId2 = "#" + input.id + "-input2";
				var value1 = $(inputId1).attr("value");
				var value2 = $(inputId2).attr("value");
				if (!checkValue(value1) && !checkValue(value2)) {
					Util.alertErrorMessage("已选中的输入框[" + input.value + "]不能为空");
					valid = true;
					return
				}
				if (checkValue(value1)) {
					cond += input.value + " >= '" + value1 + "' ";
				}
				if (checkValue(value2)) {
					if (checkValue(value1)) {
						cond += " AND ";
					}
					cond += input.value + " <= '" + value2 + "'";
				}
			}
			if (!first) {
				cond = " AND " + cond;
			}
			first = false;
			queryCondition += cond;
		}
	});

	if (valid) {
		return;
	}
	
	var cons = $("#person-query-fields").find("input");
	first = true;
	$.each(cons, function(index, input) {
		if (input.type == 'checkbox' && input.checked) {
			if (!first) {
				queryFields += " , ";
			}
			first = false;
			queryFields += input.value;
			colNames.push(input.value);
		}
	});
	if (colNames.length == 0) {
		Util.alertErrorMessage("请至少选择一个显示字段");
	} else {
		var params = {};
		params.tableType = PERSON_TABLE_TYPE;
		params.queryFields = queryFields;
		params.queryCondition = queryCondition;
		params.username = $.cookies.get("username");
		var url1 = Util.getBaseUrl() + "/datas/queryDataNumber.json";
		whaleGet(url1, params, function(resultData) {
			var queryNumber = resultData.long;
			$("#person-query-header").show();
			$("#person-query-result-number").text(queryNumber);
			if (queryNumber > 100) {
				queryNumber = 100;
			}
			$("#person-query-show-number").text(queryNumber);
		});
		var url2 = Util.getBaseUrl() + "/datas/queryData.json"
		whalePost(url2, params, function(resultData) {
			var resultVO = Util.getWantedObj(
					"org.blade.whale.management.vo.ResultVO", resultData);
			if(resultVO&&resultVO.code=="success"){
				var fieldNames = colNames;
				var colMs = [];
				for (i = 0; i < fieldNames.length; i++) {
					colMs.push({
						name : "col" + i,
						width : 60,
						align:"center"
					});
				}
				$("#person-query-result").jqGrid('GridUnload');
				$("#person-query-result").jqGrid({
					datatype : "local",
					height : 250,
					colNames : fieldNames,
					colModel : colMs
				});
				$("#person-query-result").jqGrid("setGridWidth", Util.getGridWidth());
				var rowDatas = [];
				if (resultVO.result.data[0] != "") {
					var resultList = resultVO.result.data[0].list;
					$.each(resultList, function(index, row) {
						var data = {};
						if (fieldNames.length == 1) {
							data.col0 = row.string;
						} else {
							for (i = 0; i < fieldNames.length; i++) {
								data["col" + i] = row.string[i];
							}
						}
						rowDatas.push(data);
					});
					$("#person-query-result").jqGrid("clearGridData");
					for ( var i = 0; i <= rowDatas.length; i++)
						$("#person-query-result").jqGrid('addRowData', i + 1, rowDatas[i]);
				}
			} else {
				Util.alertErrorMessage(resultVO.message);
			}
			Util.fullScreenUnMask();
		});
		Util.fullScreenMask();
	}
}

function submitPersonExport() {
	var queryFields = "", queryCondition = "", colNames = [];
	var inputs = $("#person-export-condition").find("input");
	var first = true;
	var valid = false;
	$.each(inputs, function(index, input) {
		if (input.type == 'checkbox' && input.checked) {
			var cond = "";
			if (input.name == "full") {
				var inputId = "#" + input.id + "-input";
				var value = $(inputId).attr("value");
				if(!checkValue(value)){
					Util.alertErrorMessage("已选中的输入框[" + input.value + "]不能为空");
					valid = true;
					return;
				}
				cond = input.value + "= '" + value + "' ";
			} else if (input.name == "fuzzy") {
				var inputId = "#" + input.id + "-input";
				var value = $(inputId).attr("value");
				if (!checkValue(value)) {
					Util.alertErrorMessage("已选中的输入框[" + input.value + "]不能为空");
					valid = true;
					return;
				}
				cond = input.value + " LIKE '%" + value + "%' ";
			} else if (input.name == "range") {
				var inputId1 = "#" + input.id + "-input1";
				var inputId2 = "#" + input.id + "-input2";
				var value1 = $(inputId1).attr("value");
				var value2 = $(inputId2).attr("value");
				if (!checkValue(value1) && !checkValue(value2)) {
					Util.alertErrorMessage("已选中的输入框[" + input.value + "]不能为空");
					valid = true;
					return
				}
				if (checkValue(value1)) {
					cond += input.value + " >= '" + value1 + "' ";
				}
				if (checkValue(value2)) {
					if (checkValue(value1)) {
						cond += " AND ";
					}
					cond += input.value + " <= '" + value2 + "'";
				}
			}
			if (!first) {
				cond = " AND " + cond;
			}
			first = false;
			queryCondition += cond;
		}
	});

	if (valid) {
		return;
	}
	
	var cons = $("#person-export-fields").find("input");
	first = true;
	$.each(cons, function(index, input) {
		if (input.type == 'checkbox' && input.checked) {
			if (!first) {
				queryFields += " , ";
			}
			first = false;
			queryFields += input.value;
			colNames.push(input.value);
		}
	});
	if (colNames.length == 0) {
		Util.alertErrorMessage("请至少选择一个显示字段");
	} else {
		var params = {};
		params.tableType = PERSON_TABLE_TYPE;
		params.exportFields = queryFields;
		params.exportCondition = queryCondition;
		params.username = $.cookies.get("username");
		var url = Util.getBaseUrl() + "/datas/exportData.json"
		whalePost(url, params, function(resultData) {
			var resultVO = Util.getWantedObj(
					"org.blade.whale.management.vo.ResultVO", resultData);
			if(resultVO&&resultVO.code=="success"){
				var fileName = resultVO.result["$"];
				var fileUrl = Util.getBaseUrl() + "/export/"+PERSON_TABLE_TYPE + "/" + fileName;
				$.fileDownload(fileUrl, {
		            successCallback: function (url) { 
		            	Util.alert("success download file.");
		            },
		            failCallback: function (responseHtml, url) {
		            	Util.alert("failed to download file.");
		            }
				});
			} else {
				Util.alertErrorMessage(resultVO.message);
			}
			Util.fullScreenUnMask();
		});
		Util.fullScreenMask();
	}
}

function checkValue(value) {
	if (typeof value == "undefined" || value == null || value == "") {
		return false;
	}
	return true;
}

function fillFileGridData() {
	$("#person-file-grid").jqGrid('clearGridData');
	var url = Util.getBaseUrl() + "/datas/listImportFiles.json";
	var params = {};
	params.tableType = PERSON_TABLE_TYPE;
	whaleGet(url, params, function(resultData) {
		var files = Util.getWantedObj("org.blade.whale.management.vo.FileVO", resultData);
		if (files) {
			for ( var i = 0; i <= files.length; i++)
				$("#person-file-grid").jqGrid('addRowData', i + 1, files[i]);
		}
		Util.fullScreenUnMask();
	});

	Util.fullScreenMask();
}

function importFile(){
	if (checkUserSelected()) {
		var index = $('#person-file-grid').jqGrid('getGridParam', 'selrow');
		var data = $('#person-file-grid').jqGrid('getRowData', index);
		var url = Util.getBaseUrl() + "/datas/importFile.json";
		var params = {};
		params.fileName = data.filename;
		params.tableType = PERSON_TABLE_TYPE;
		whalePost(url, params, function(resultData) {
			var result = Util.parseResultVO(resultData, "org.blade.whale.management.vo.ResultVO");
			if (result.code == 'success') {
				fillFileGridData();
				Util.alert($.language.getText('MESSAGE_IMPORT_SUCCESSFULLY'));
			} else if (result.code == 'fail') {
				Util.alertErrorMessage(result.message);
			} else {
				Util.alertErrorMessage($.language.getText('MESSAGE_IMPORT_FAILED'));
			}
			Util.fullScreenUnMask();
		});
		Util.fullScreenUnMask();
	}
}

function deleteFile(){
	if (checkUserSelected()) {
		var index = $('#person-file-grid').jqGrid('getGridParam', 'selrow');
		var data = $('#person-file-grid').jqGrid('getRowData', index);
		var url = Util.getBaseUrl() + "/datas/deleteFile.json";
		var params = {};
		params.fileName = data.filename;
		params.tableType = PERSON_TABLE_TYPE;
		whalePost(url, params, function(resultData) {
			var result = Util.parseResultVO(resultData, "org.blade.whale.management.vo.ResultVO");
			if (result.code == 'success') {
				fillFileGridData();
				Util.alert($.language.getText('MESSAGE_DELETE_SUCCESSFULLY'));
			} else if (result.code == 'fail') {
				Util.alertErrorMessage(result.message);
			} else {
				Util.alertErrorMessage($.language.getText('MESSAGE_DELETE_FAILED'));
			}
			Util.fullScreenUnMask();
		});
		Util.fullScreenUnMask();
	}
}

function checkUserSelected() {
	if ($("#person-file-grid").jqGrid('getGridParam', 'selarrrow').length == 1) {
		return true;
	} else {
		Util.alertErrorMessage("只能且必须选中一个用户进行操作!");
		return false;
	}
}
