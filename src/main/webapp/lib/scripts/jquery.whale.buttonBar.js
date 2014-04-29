/*
 *whale accordion
 */
(function($) {
	$.fn.buttonBar = function(options) {
		var defaults = {
			isCheckboxButton : true,
			isDownMenu : true,
			checkboxClick:function(){},
			checkboxButton : {},
			isRefreshButton : true,
			normalButton : [],
			refreshCall : function() {
			}
		};

		var c = $.extend(defaults, options), $checkBoxButton = null, $refreshButton = null;
		var bs = c.normalButton.length;
		var $normalButton = new Array(bs);

		if(c.isCheckboxButton) {
			$checkBoxButton = $('<a href="#" class="button"></a>');
			$checkBoxButton.append('&nbsp;<span><input type="checkbox" name="checkAll" id="checkAll"></input></span>&nbsp;');
			if(c.isDownMenu){
				$checkBoxButton.append('<span class="arrow"></span>');
				$checkBoxButton.addClass('icon201');
			}
				
			$(this).append($checkBoxButton);
			if(c.isDownMenu)
				$('.icon201').whaleMenu(c.checkboxButton);
			
			$('#checkAll').click(function(){
				c.checkboxClick.apply({}, [$(this)]);
			});
		}

		if(bs > 0) {
			for(var i = 0; i < bs; i++) {
				var nb = c.normalButton[i];
				$normalButton[i] = $('<a href="#" class="button" kind="normal" ></a>');
				$normalButton[i].addClass(nb.type);
				//if(nb.type=='middle'){
				//	$normalButton[i].addClass('selected');
				//}
				
				$normalButton[i].attr('drawText', nb.textKey);
				$(this).append($normalButton[i]);

			};
		}

		if(c.isRefreshButton) {
			$refreshButton = $('<a href="#" class="icon icon1"><span></span></a>');
			$refreshButton.bind('click', function(event) {
				c.refreshCall.apply({}, []);
			});
			$(this).append($refreshButton);
		}

		$(this).append('<div class="clean"></div>');
		$.whale.drawAreaTextByClass($(this).attr('class'));

		if(bs > 0) {
			$('.button[kind=normal]', $(this)).each(function(j) {
				$(this).click(function() {
					c.normalButton[j].clickButton.apply({}, [$(this)]);
				});
			});
		}

	};
})(jQuery);
