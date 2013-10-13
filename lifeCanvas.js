/** @license
* peVideo
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

function peVideo(options) {
	var defaults = {
		
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
}

jsWebPasswordStrength.prototype.test = function (passwordToTest) {
	
}