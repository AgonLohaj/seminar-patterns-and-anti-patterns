var githubWidget = function( options, element ){
	...
	this.metadata = $( element ).data( 'plugin-options' );
	this.init();
}
githubWidget.prototype = {
	init: function(){
		$(this.element).addClass("github-box repo");
		this.config = $.extend({}, this.defaults, this.options,
		  this.metadata);
	},
	option: function( key, value ){ ... }
};
$.widget.bridge("bridgeWidget", githubWidget);