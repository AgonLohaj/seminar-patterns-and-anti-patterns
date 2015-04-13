;(function ( $ ) {
			if ( ! $.mimiz ) {
				$.mimiz = {};
			}
			$.mimiz.loader = function ( options ) {

				var base = $.mimiz.loader;

				base.settings = $.extend( {}, $.mimiz.loader.defaults, options );
				var maskHeight = $(document).height();
				var maskWidth = $(window).width();
				base.bgDiv = $('<div id="'+base.settings.background.id+'"/>');
				base.bgDiv.css({
					zIndex:base.settings.zIndex,
					position:'absolute',
					top:'0px',
					left:'0px',
					width:maskWidth,
					height:maskHeight,
					opacity:base.settings.background.opacity
				});
				if(jQuery.bgiframe){
					base.bgDiv.bgiframe();
				}
				base.div = $('<div id="'+base.settings.id+'" class="'+base.settings.className+'"></div>');
				base.div.css({
					zIndex:base.settings.zIndex+1,
					width:base.settings.width,
					height:base.settings.height
				});
				base.div.html(base.settings.content);
				base.isShowing = false;
			};
			$.mimiz.loader.defaults = {
				content:"Loading ...",
				className:'loader',
				id:'jquery-loader',
				height:60,
				width:200,
				zIndex:30000,
				background:{
					opacity:0.4,
					id:'jquery-loader-background'
				}
			};
			$.mimiz.loader.show = function(){
				var base = $.mimiz.loader;
				if(!base.isShowing){
					base.isShowing = true;
					base.bgDiv.appendTo("body");
					base.div.appendTo('body');
					function center($dom){
						$dom.css("position","absolute");
						$dom.css("top", ( $(window).height() - $dom.outerHeight() ) / 2+$(window).scrollTop() + "px");
						$dom.css("left", ( $(window).width() - $dom.outerWidth() ) / 2+$(window).scrollLeft() + "px");
					}
					center(base.div);
				}
				
			};

			$.mimiz.loader.setContent = function(content){
				var base = $.mimiz.loader;	
				base.settings.centent = content;
				base.div.html(content);
			};

			$.mimiz.loader.close = function(){
				var base = $.mimiz.loader;
				if(base.isShowing){
					base.div.remove();
					base.bgDiv.remove();
					base.isShowing = false;
				}
				
			};
			$.mimiz.loader();
		} )( jQuery );