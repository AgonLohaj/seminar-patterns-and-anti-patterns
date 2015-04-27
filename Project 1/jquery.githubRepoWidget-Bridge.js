
// Refactored Code:
;(function ( $, window, document, undefined ) {
	// jQuery bridge plugin pattern:
	// a "githubWidget" object constructor
	// required: this must accept two arguments,
	// options: an object of configuration options
	// element: the DOM element the instance was created on
	var githubWidget = function( options, element ){
		this.name = "githubWidget";
		this.options = options;
		this.element = $( element );
		this._init();
	}
	// the "githubWidget" prototype
	githubWidget.prototype = {
		//Options to be used as defaults
		options: {
			repo: null
		},
		
		// required: initialization logic for the plugin goes into _init
		// This fires when your instance is first created and when
		// attempting to initialize the widget again (by the bridge)
		// after it has already been initialized.
		_init: function(){
			$(this.element).addClass("github-box repo");
			$widget = $(
				'<div class="github-box-title">'
					+'<h3><a class="owner"></a>/<a class="repo"></a></h3>'
					+'<div class="github-stats">'
						+'<a class="watchers" title="See watchers">?</a>'
						+'<a class="forks" title="See forkers">?</a>'
					+'</div>'
				+'</div>'
				+'<div class="github-box-content">'
					+'<p class="description"><span></span> &mdash; <a>Read More</a></p>'
					+'<p class="link"></p>'
				+'</div>'
				+'<div class="github-box-download">'
					+'<div class="updated"></div>'
					+'<a class="download" title="Get an archive of this repository">Download as zip</a>'
				+'</div>'
			);
			this.element.append($widget);
			this.element._owner = $widget.find(".owner");
			this.element._repo = $widget.find(".repo");
			this.element._watchers = $widget.find(".watchers");
			this.element._forks = $widget.find(".forks");
			
			var description = $widget.find(".description");
			this.element._readMore = description.find("a");
			this.element._descriptionSpan =  description.find("span");
			
			this.element._download = $widget.find(".download");
			this.element._updated =  $widget.find(".updated");
			this.element._link =  $widget.find(".link");
		
			this.refreshRepo();
		},
		 // required: objects to be used with the bridge must contain an
		// 'option'. Post-initialization, the logic for changing options
		// goes here.
		option: function( key, value ){
			// optional: get/change options post initialization
			// ignore if you don't require them.
			// signature: $('#foo').bar({ cool:false });
			if( $.isPlainObject( key ) ){
				this.options = $.extend( true, this.options, key );
			// signature: $('#foo').option('cool'); - getter
			} else if ( key && typeof value === "undefined" ){
				return this.options[ key ];
			// signature: $('#foo').bar('option', 'baz', false);
			} else {
				this.options[ key ] = value;
			}
			// required: option must return the current instance.
			// When re-initializing an instance on elements, option
			// is called first and is then chained to the _init method.
			if (key === "repo") {
				this.refreshRepo();
			}
				
			return this;
		},
		refreshRepo: function() {
			if(this.options.repo != null){
				var repo = this.options.repo,
				vendorName = repo.split('/')[0],
				repoName = repo.split('/')[1],
				vendorUrl = "http://github.com/" + vendorName,
				repoUrl = "http://github.com/" + vendorName + '/' + repoName;
			
				this.element._owner.attr("href", vendorUrl);
				this.element._owner.attr("title", vendorUrl);
				this.element._owner.text(vendorName);
				
				this.element._repo.attr("href", repoUrl);
				this.element._repo.attr("title", repoUrl);
				this.element._repo.text(repoName);
				
				this.element._watchers.attr("href", repoUrl + '/watchers');
				
				this.element._forks.attr("href", repoUrl + '/network/members');
				this.element._download.attr("href", repoUrl + '/zipball/master');
				this.element._readMore.attr("href", repoUrl + '#readme');
				this.getData();
			}
		},
		getData: function() {
			var widget = this;
			$.ajax({
				url: 'https://api.github.com/repos/' + this.options.repo,
				dataType: 'jsonp',
				success: function(results) {
					var repo = results.data, date, pushed_at = 'unknown';

					if (repo.pushed_at) {
						date = new Date(repo.pushed_at);
						pushed_at = (date.getMonth() + 1) + '-' + date.getDate() + '-' + date.getFullYear();
					}
					widget.element._watchers.text(repo.watchers);
					widget.element._forks.text(repo.forks);
					widget.element._descriptionSpan.text(repo.description);
					widget.element._updated.html('Latest commit to the <strong>' + repo.default_branch + '</strong> branch on ' + pushed_at);

					// Don't show "null" if the repo has no homepage URL.
					if(repo.homepage != null) widget.element._link.append($('<a />').attr('href', repo.homepage).text(repo.homepage));
				}
			});
		}
	};
	$.widget.bridge("bridgeWidget", githubWidget);
})( jQuery, window, document );