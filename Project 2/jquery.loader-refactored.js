//
;(function ( $, window, document, undefined ) {
	
	//defaults pattern
	var defaults = {
		background:{
			id:'jquery-loader-background',
			class: "loader-background"
		},
		class: "loader",
		fullscreen : false,
		enabled_class : "show"
	};

	//Singleton pattern for Background
	var Background = (function () {
	    var instance;
	 
	    function createInstance(options) {
	    	var background = $("<div id='" + options.background.id + "' class='" + options.background.class + "'/>");
	    	if(jQuery.bgiframe){
				background.bgiframe();
			}
	        $("body").append(background);
	        return background;
	    }
	 
	    return {
	        create: function () {
	            if (!instance) {
	                instance = createInstance();
	            }
	            return instance;
	        }
	    };
	})();

	// The plugin constructor
	function Loader( element, method_options) {
		this.el = element;
		this.$el = $(element);
		if ( typeof method_options === 'object' || !method_options ) {
			this.options = $.extend({}, defaults, method_options);
			if(this.options.fullscreen){
				this.background = Background.create(this.options);
				this.$background = $(this.background);
			}
			return this.init();
		}
	};

	// prototype the plugin pattern
	Loader.prototype  = {
		init : function(){
			this.$el.addClass(this.options.class);
			return this;
		},
		show : function(){
			this.$el.center();
			this.$el.addClass(this.options.enabled_class);
			if(this.$background){
				this.$background.addClass(this.options.enabled_class);
			}
		},
		close : function(){
			this.$el.removeClass(this.options.enabled_class);
			if(this.$background){
				this.$background.removeClass(this.options.enabled_class);
			}
		}
	};
	// single initialisation pattern
	$.fn.extend({
		loader : function ( method_options ) {
			return this.each( function () {
				var plugin = $.data(this, 'plugin_loader');
				if (!plugin) 
				{
					plugin = new Loader(this,method_options);
					$.data(this, 'plugin_loader', plugin);
				} else {
					if ( method_options === "destroy" ) {
						plugin.close();
						$.data(this, 'plugin_loader', undefined);
						return;
					}
					if ( plugin[method_options] ) {
						return plugin[ method_options ]();
					} else {
						if(method_options){
							$.error( 'Method ' +  method_options + ' does not exist on jQuery.loader' );
						}
					}
				}
				
			});
		},
		center : function () {
			this.css("position","absolute");
			this.css("top", ( $(window).height() - this.outerHeight() ) / 2+$(window).scrollTop() + "px");
			this.css("left", ( $(window).width() - this.outerWidth() ) / 2+$(window).scrollLeft() + "px");
			return this;
		}
	});
	
})( jQuery, window, document );