// Note from James:
//
// This assumes you are using the RequireJS+jQuery file, and
// that the following files are all in the same directory:
//
// - require-jquery.js
// - jquery-ui.custom.min.js (custom jQuery UI build with widget factory)
// - templates/
//    - asset.html
// - custom.githubWidget.js 
// Then you can construct the widget like so: 
//custom.githubWidget.js file:

define("custom.githubWidget", ["jquery", "text!templates/asset.html", "jquery-ui.custom.min","jquery.tmpl"], function ($, assetHtml) {
	// define your widget under a namespace of your choice
	//  with additional parameters e.g.
	// $.widget( "namespace.widgetname", (optional) - an
	// existing widget prototype to inherit from, an object
	// literal to become the widget's prototype ); 
	$.widget( "custom.githubWidget" , {
		//Options to be used as defaults
		options: {
			repo: null
		},
		//Setup widget (eg. element creation, apply theming
		// , bind events etc.)
		_create: function () {
			// _create will automatically run the first time
			// this widget is called. Put the initial widget
			// setup code here, then you can access the element
			// on which the widget was called via this.element.
			// The options defined above can be accessed
			// via this.options this.element.addStuff();
			this.element.addClass("github-box repo");
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
		// Destroy an instantiated plugin and clean up
		// modifications the widget has made to the DOM
		destroy: function () {
			// this.element.removeStuff();
			// For UI 1.8, destroy must be invoked from the
			// base widget
			$.Widget.prototype.destroy.call(this);
			// For UI 1.9, define _destroy instead and don't
			// worry about
			// calling the base widget
		},
		// Respond to any changes the user makes to the
		// option method
		_setOption: function ( key, value ) {
			switch (key) {
				case "repo":
					this.options.repo = value;
					this.refreshRepo();
					break;
				default:
					break;
			}
			this._super( key, value );
			
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
			console.log('https://api.github.com/repos/' + this.options.repo);
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
		},
	});
});
