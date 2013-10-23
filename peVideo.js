/** @license
* peVideo - MIT License
* Copyright (c) 2013 Joby Elliott
* http://go.byjoby.net/peVideo
* 
* Permission is hereby granted, free of charge, to any person obtaining a copy
* of this software and associated documentation files (the "Software"), to deal
* in the Software without restriction, including without limitation the rights
* to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
* copies of the Software, and to permit persons to whom the Software is
* furnished to do so, subject to the following conditions:
* 
* The above copyright notice and this permission notice shall be included in
* all copies or substantial portions of the Software.
*/

function peVideo(obj,options) {
	var defaults = {
		minSize:300
	};
	//loop through all options and merge them with defaults
	//don't do anything with tests or requirements just yet
	if (typeof(options) == 'object') {
		for (var prop in options) {
			if (options.hasOwnProperty(prop)) {
				switch (prop)
				{
					default:
						defaults[prop] = options[prop];
				}
			}
		}
	}
	this.options = defaults;
	this.obj = obj;
	//identify provider
	this.provider = false;
	this.href = this.obj.getAttribute('href');
	for (var provider in this.providers) {
		if (this.providers[provider].checkUrl(this.href)) {
			this.provider = this.providers[provider];
		}
	}
	//only do more if there is a valid provider
	if (provider) {
		//set up window event listener
		this.checkSize = this.debounce(this.checkSize_now);
		window.addEventListener('resize',this.checkSize);
	}
	console.log(this);
}

peVideo.prototype.checkSize_now = function () {
	var width = window.innerWidth;
}
peVideo.prototype.on = function () {
	
}
peVideo.prototype.off = function () {

}
/*
	Objects for defining and embedding various providers
	Also for retrieving thumbnail videos
	This is also where the url-sniffing rules live
*/
peVideo.prototype.providers = {}
//YouTube
	peVideo.prototype.providers.YouTube = {
		checkUrl: function (url) {
			return (
				url.match(/\/\/(www\.)?youtube\.com/) ||
				url.match(/\/\/youtu.be/)
			);
		},
		videoID: function (url) {
			return "nothing";
		},
		thumbnail: function (url) {
			return "YouTube thumbnail url"; 
		},
		embedCode: function () {
			return "YouTube embed code";
		},
	}

/*
	Note to self, don't debounce in prototype methods, objects need their
	own debounced methods set up during construction
*/
peVideo.prototype.debounce = function (func, threshold, execAsap) {
	var timeout;
	return function debounced () {
		var obj = this;
		var args = arguments;
		function delayed () {
			if (!execAsap) {
				func.apply(obj,args);
			}
			timeout = null;
		}
		if (timeout) {
			clearTimeout(timeout);
		}else if (execAsap) {
			func.apply(obj,args);
		}
		timeout = setTimeout(delayed,threshold||100);
	};
}