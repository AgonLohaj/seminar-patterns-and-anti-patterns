// Refactored Code:
;(function ( $, window, document, undefined ) {
	$.widget( "custom.githubWidget" , {
		options: { ... }, _create: function () {
			var self = this;
			self.element.addClass("github-box repo");
			$widget = $("...some html code...");
			self.element.append($widget);
			self.element.bind( "refresh", function(e){
				if(self.options.repo != null){
					// get data
				}
			});
		}, destroy: function () { ... }, _setOption: function ( key, value ) { ... },_refreshRepo: function() { ... }, getData: function() { ... },
	});
})( jQuery, window, document );