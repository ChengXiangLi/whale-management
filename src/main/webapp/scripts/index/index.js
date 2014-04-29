/**
 * @fileOverview Home js
 * @author
 * @site www.whale.com Copyright (c) 2008-2011
 * @version 1.0.0
 */
var cometd_connected = false;
var $index = {
	/**
	 * @description 渲染首页的文本
	 */
	drawIndexText : function() {
		$.whale.drawAll();
	},
	loadNav : function() {
		$('.nav').load('views/nav.html?' + $base.appConfig.version,function() {
			$('#menu-person').parent().nextAll('li').remove();
			var menuItems = '';
			//menuItems += '<li><a href="#" drawText="HEAD_MENU_TENANT_MANAGEMENT_TEXT" id="menu_tenant"></a></li>';
			if($.cookies.get("isSuperAdmin") == true){
				menuItems += '<li><a href="#" drawText="HEAD_MENU_COMPANY_TEXT" id="menu-company"></a></li>';
				menuItems += '<li><a href="#" drawText="HEAD_MENU_USER_TEXT" id="menu_user"></a></li>';
			} else {
				menuItems += '<li><a href="#" drawText="HEAD_MENU_COMPANY_TEXT" id="menu-company"></a></li>';
			}

			$('.menu').append(menuItems);
			$('.menu li a').each(function(index) {
				$(this).hover(function(){
					$(this).addClass('hoverCss');
				},function(){
					$(this).removeClass('hoverCss');
				});
			});
			
			$index.drawIndexText();
			$index.bindMenuPersonClick();
			$index.bindMenuCompanyClick();
			$index.bindMenuUserClick();
			
			$('#logout').click(function() {
				Util.confirm($.language.getText("WARNING"),$.language.getText("INDEX_BOXY_LOGOUT_MSG_TEXT"),function(){
					$.cookies.del("user_type");
					$.whale.showLogin();
				});
				
			});
			
			$('#menu-person').trigger("click");
		});
	},
	/**
	 * @description init home page
	 */
	initIndex : function() {
		$('#container').load('views/layout.html?' + $base.appConfig.version,function() {
			$index.loadNav();
			$(window).resize(function () {
				if ($(window).height() < 480) {
					$("#footer_div").css("display", "none");
				} else {
					$("#footer_div").css("display", "block");
				}
			});
		});
	},
	/**
	 * @description bind click events
	 * @param _p
	 *            html file path
	 * @param _call
	 *            callback
	 */
	loadContentHtml : function(_p, _call) {
		$('#content').load(_p + '?' + $base.appConfig.version, function() {
			if (typeof _call == 'function') {
				_call();
			}

		});
	},
	/**
	 * @description 设置菜单点击样式
	 * @param _e
	 *            whos color will be changed
	 */
	setMenuBack : function(_e) {
		$('.menu a').each(function(index) {
			$(this).removeClass('nav-click');
		});

		$('#' + _e).addClass('nav-click');
	},
	
	/**
	 * @description bind click event to meta_data
	 */
	bindMenuMetaDataClick:function(){
		$("#menu_meta_data").click(function() {
			$index.setMenuBack('menu_meta_data');
			$.whale.loadCSS($base.appConfig.lib_css_path,['zTreeStyle.css','ui.jqgrid.css','jquery.ui.dropdownchecklist.css','codemirror.css','eclipse.css']);	
			$index.loadContentHtml($base.appConfig.html_path+'meta_data/meta_data.html',function(){
				var icScript=[
					$base.appConfig.lib_scripts_path+'jquery.ztree.core-3.0.js'
				];
				var icScript4=[$base.appConfig.lib_scripts_path+'jquery.ztree.excheck-3.0.js'
							];
				var icScript5=[$base.appConfig.lib_scripts_path+'jquery.ztree.exedit-3.0.js'];
				var icScript6=[$base.appConfig.lib_scripts_path+'jqgrid4.2/jquery.jqGrid.min.js',
								$base.appConfig.lib_scripts_path+'jquery.ui.dropdownchecklist-1.4.min.js',
								$base.appConfig.lib_scripts_path+'codemirror.js'];
				var icScript2=[$base.appConfig.lib_scripts_path+'plsql.js'];
				var icScript3=[$base.appConfig.scripts_path+'meta_data/meta_data_utils.js',
					$base.appConfig.scripts_path+'meta_data/meta_data.js'];
				$LAB.script(icScript).wait().script(icScript4).wait().script(icScript5).wait().script(icScript6).wait()
				.script(icScript2).wait().script(icScript3).wait(function(){
					$meta_data.init();
				});
			});
		});
	},
	
	/**
	 * @description bind event on Person tab
	 */
	bindMenuPersonClick : function() {
		$("#menu-person").click(function() {
			$index.setMenuBack('menu-person');
			$.whale.loadCSS($base.appConfig.lib_css_path,["ui.jqgrid.css"]);	
			$index.loadContentHtml($base.appConfig.html_path+'person/person.html',function(){
				var icScript=[$base.appConfig.lib_scripts_path+'jqgrid4.2/jquery.jqGrid.min.js',
				              $base.appConfig.lib_scripts_path+'jquery.whale.buttonBar.js'],
				    icScript2=[$base.appConfig.lib_scripts_path + 'multifile/jquery.form.js?' + $base.appConfig.version],
				    icScript3=[
				              $base.appConfig.scripts_path+'person/person.js'],
				    icScript4=[$base.appConfig.lib_scripts_path+'jquery.fileDownload.js'];
				$LAB.script(icScript).wait().script(icScript2).wait().script(icScript4).wait().script(icScript3).wait(function(){
					$person.init();
				});
			});
		});
	},
	
	/**
	 * @description bind event on User tab
	 */
	bindMenuUserClick : function() {
		$("#menu_user").click(function() {
			$index.setMenuBack('menu_user');
			$.whale.loadCSS($base.appConfig.lib_css_path,["ui.jqgrid.css"]);	
			$index.loadContentHtml($base.appConfig.html_path+'user/user.html',function(){
				var icScript=[$base.appConfig.lib_scripts_path+'jqgrid4.2/jquery.jqGrid.min.js',
				              $base.appConfig.lib_scripts_path+'jquery.whale.buttonBar.js'],
				    icScript2=[$base.appConfig.lib_scripts_path + 'multifile/jquery.form.js?' + $base.appConfig.version],
				    icScript3=[
				              $base.appConfig.scripts_path+'user/user.js'];
				$LAB.script(icScript).wait().script(icScript2).wait().script(icScript3).wait(function(){
					$user.init();
				});
			});
		});
	},
	
	/**
	 * @description bind event on Person tab
	 */
	bindMenuCompanyClick : function() {
		$("#menu-company").click(function() {
			$index.setMenuBack('menu-company');
			$.whale.loadCSS($base.appConfig.lib_css_path,["ui.jqgrid.css"]);	
			$index.loadContentHtml($base.appConfig.html_path+'company/company.html',function(){
				var icScript=[$base.appConfig.lib_scripts_path+'jqgrid4.2/jquery.jqGrid.min.js',
				              $base.appConfig.lib_scripts_path+'jquery.whale.buttonBar.js'],
				    icScript2=[$base.appConfig.lib_scripts_path + 'multifile/jquery.form.js?' + $base.appConfig.version],
				    icScript3=[
				              $base.appConfig.scripts_path+'company/company.js'],
				    icScript4=[$base.appConfig.lib_scripts_path+'jquery.fileDownload.js'];
				$LAB.script(icScript).wait().script(icScript2).wait().script(icScript4).wait().script(icScript3).wait(function(){
					$company.init();
				});
			});
		});
	}
};
