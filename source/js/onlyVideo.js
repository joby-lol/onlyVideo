/** @license
* onlyVideo - MIT License
* Copyright (c) 2013 Joby Elliott
* http://go.byjoby.net/onlyVideo
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

function onlyVideo(obj,options) {
	this.options = {
		aspectRatio: 16/9,
		controlSizeV: 0,
		controlSizeH: 0
	};
	//set options
	this.setOptions(options);
	//save original link
	this.originalLink = obj;
	//identify provider
	this.provider = false;
	this.href = this.originalLink.getAttribute('href');
	for (var provider in this.providers) {
		if (this.providers[provider].checkUrl(this.href)) {
			this.provider = new this.providers[provider](this);
		}
	}
	//only do more if there is a valid provider
	if (provider) {
		//set up window event listener
		var pe = this;
		this.on();
		window.addEventListener('resize',this.debounce(function(){pe.checkSize(pe)},250));
		pe.checkSize(pe);
		console.log(this);
	}
}
onlyVideo.prototype.setOptions = function (options) {
	if (typeof(options) == 'object') {
		for (var prop in options) {
			if (options.hasOwnProperty(prop)) {
				this.options[prop] = options[prop];
			}
		}
	}
}
onlyVideo.prototype.setDefaults = function (options) {
	if (typeof(options) == 'object') {
		for (var prop in options) {
			if (options.hasOwnProperty(prop) && this.options[prop] === undefined) {
				this.options[prop] = options[prop];
			}
		}
	}
}

onlyVideo.prototype.checkSize = function (pe) {
	var width = pe.displayObj.offsetWidth-pe.options.controlSizeH;
	var height = Math.round(width/pe.options.aspectRatio)+pe.options.controlSizeV;
	pe.displayObj.style.height = height+'px';
	//adjust thumbnail position
	if (pe.thumbLoaded) {
		var thumbHeight = pe.displayObj.displayThumbnail.offsetHeight;
		var thumbTop = Math.round((height-thumbHeight)/2);
		pe.displayObj.displayThumbnail.style.top = thumbTop+'px';
	}
}
onlyVideo.prototype.on = function () {
	var pe = this;
	//set up display element
	this.displayObj = this.originalLink.insertAdjacentElement("afterEnd",document.createElement("DIV"));
	this.originalLink.parentNode.removeChild(this.originalLink);
	this.displayObj.setAttribute("class","onlyVideo");
	//add thumbnail
	this.displayObj.displayThumbnail = this.displayObj.appendChild(document.createElement("IMG"));
	this.displayObj.displayThumbnail.setAttribute("class","onlyVideo-displayThumbnail");
	this.displayObj.displayThumbnail.addEventListener('load',function(){pe.thumbLoaded = true;pe.checkSize(pe);});
	if (this.provider.videoThumbnail) {
		this.displayObj.displayThumbnail.setAttribute('src',this.provider.videoThumbnail);
	}
	//add caption
	this.displayObj.displayCaption = this.displayObj.appendChild(document.createElement("DIV"));
	this.displayObj.displayCaption.setAttribute("class","onlyVideo-displayCaption");
	this.displayObj.displayCaption.innerHTML = this.originalLink.innerHTML;
	//add link
	this.displayObj.displayLink = this.displayObj.appendChild(document.createElement("A"));
	this.displayObj.displayLink.setAttribute("class","onlyVideo-displayLink");
	this.displayObj.displayLink.setAttribute("href",this.href);
	//set up event handlers
	var clickHandler = this.clickHandler;
	var pe = this;
	pe.touch = false;
	this.displayObj.displayLink.addEventListener("touchstart",function(event){pe.touch = true;pe.touchInProgress = true;pe.displayObj.displayCaption.innerHTML="touch";});
	this.displayObj.displayLink.addEventListener("touchend",function(event){setTimeout(function(){pe.touchInProgress = false;pe.displayObj.displayCaption.innerHTML="no touch";},100);});
	this.displayObj.displayLink.addEventListener("click",function(event){clickHandler(pe,event)});
}
onlyVideo.prototype.off = function () {

}
onlyVideo.prototype.clickHandler = function (pe,event) {
	if (!pe.touch) {
		pe.displayObj.innerHTML = pe.provider.embedCode;
		pe.displayObj.setAttribute('class','onlyVideo onlyVideo-activated')
		event.preventDefault();
	}
}
/*
	Objects for defining and embedding various providers
	Also for retrieving thumbnail videos
	This is also where the url-sniffing rules live
*/
onlyVideo.prototype.providers = {}
//YouTube
	onlyVideo.prototype.providers.YouTube = function (pe) {
		//add new default configuration
		pe.setDefaults({
			YouTube_rel:1
		});
		//extract video ID from url
		console.log("initializing YouTube provider from url "+pe.href);
		if (/\/\/(www\.)?youtube\.com/.test(pe.href)) {
			this.videoID = pe.href.match(/v=([^&]+)/)[1];
			console.log(this);
		}else if (/\/\/youtu.be/.test(pe.href)) {
			this.videoID = pe.href.match(/\.be\/([^?]+)/)[1];
			console.log(this);
		}
		//check for start point
		this.videoStart = pe.href.match(/[?&]t=([0-9]+)s/);
		this.videoStart = this.videoStart?this.videoStart[1]:false;
		//set up what the exterior needs
		var iframeSrc = '//www.youtube.com/embed/'+this.videoID+'?'+(this.videoStart?'start='+this.videoStart+'&':'')+'rel='+pe.options.YouTube_rel+'&autohide=1&autoplay=1&modestbranding=1';
		this.embedCode = '<iframe class="onlyVideo-embed" src="'+iframeSrc+'" frameborder="0" allowfullscreen></iframe>';
		//set thumbnail url
		this.videoThumbnail = "//img.youtube.com/vi/"+this.videoID+"/hqdefault.jpg";
		//pe.displayObj.displayThumbnail.setAttribute('src',this.videoThumbnail);
	}
	onlyVideo.prototype.providers.YouTube.checkUrl = function (url) {
		return (
			/\/\/(www\.)?youtube\.com/.test(url) ||
			/\/\/youtu.be/.test(url)
		);
	}

/*
	Note to self, don't debounce in prototype methods, objects need their
	own debounced methods set up during construction
*/
onlyVideo.prototype.debounce = function (func, threshold, execAsap) {
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