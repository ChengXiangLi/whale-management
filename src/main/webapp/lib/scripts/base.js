var $base={
	appConfig:{
		version:'1.0.1',
		lib_scripts_path:contextPath + '/lib/scripts/',
		lib_css_path:contextPath + '/lib/css/',
		scripts_path:contextPath + '/scripts/',
		html_path:contextPath + '/views/',
		write_cookie:true
	},
	
	init:function(){
		var $initScripts1=[
			this.appConfig.lib_scripts_path+'jquery-1.6.4.min.js?'+this.appConfig.version
			],
			
		$initScripts5=[this.appConfig.lib_scripts_path+'jquery-ui-1.8.14.custom.min.js?'+this.appConfig.version],
			
		$initScripts2=[this.appConfig.lib_scripts_path+'jquery.whale.core.js?'+this.appConfig.version,
			this.appConfig.lib_scripts_path+'jquery.cookies.2.2.0.min.js?'+this.appConfig.version,
			this.appConfig.lib_scripts_path+'jquery.json-2.3.min.js?'+this.appConfig.version],
		$initScripts3=[
			this.appConfig.lib_scripts_path+'json2.js',
            this.appConfig.lib_scripts_path+'org/cometd.js',
            this.appConfig.lib_scripts_path+'jquery.cometd.js',
            this.appConfig.lib_scripts_path+'jquery.loadmask.min.js'
		],
		$initScripts4=[
			this.appConfig.scripts_path+'index/index.js?'+this.appConfig.version,
			this.appConfig.scripts_path+'service/whaleService.js?'+this.appConfig.version
		];
		
		$LAB.script($initScripts1).wait()
			.script($initScripts5).wait()
			.script($initScripts2).wait()
			.script($initScripts3).wait(function(){
			$.whale.loadCSS($base.appConfig.lib_css_path,[
				"jquery-ui-1.8.14.custom.css",
				"jquery.loadmask.css",
				"main.css"
			],function(){
				$.whale.init(function(){
					$LAB.script($initScripts4).wait(function(){
						$index.initIndex();
					});
				});
			});
		});
	}
};

$base.init();


