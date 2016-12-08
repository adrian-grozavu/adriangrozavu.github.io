/* AboutMe.Embed.js */

(function(window, document, undefined) {
	"use strict";

	if (! window.AboutMe) window.AboutMe = {};
	if (! AboutMe.Embeds) AboutMe.Embeds = [];
	
	if (! AboutMe.$) {
		/*
			Cross-browser implementation of getElementsByClassName
			Developed by Robert Nyman, http://www.robertnyman.com
			Code/licensing: http://code.google.com/p/getelementsbyclassname/
		*/	
		AboutMe.$ = function (className, tag, elm) {
			var getElementsByClassName;
			if (document.getElementsByClassName) {
				getElementsByClassName = function (className, tag, elm) {
					elm = elm || document;
					var elements = elm.getElementsByClassName(className),
						nodeName = (tag)? new RegExp("\b" + tag + "\b", "i") : null,
						returnElements = [],
						current;
					for (var i=0, il=elements.length; i<il; i+=1){
						current = elements[i];
						if (!nodeName || nodeName.test(current.nodeName)) {
							returnElements.push(current);
						}
					}
					return returnElements;
				};
			} else if (document.evaluate) {
				getElementsByClassName = function (className, tag, elm) {
					tag = tag || "*";
					elm = elm || document;
					var classes = className.split(" "),
						classesToCheck = "",
						xhtmlNamespace = "http://www.w3.org/1999/xhtml",
						namespaceResolver = (document.documentElement.namespaceURI === xhtmlNamespace)? xhtmlNamespace : null,
						returnElements = [],
						elements,
						node;
					for (var j=0, jl=classes.length; j<jl; j+=1){
						classesToCheck += "[contains(concat(' ', @class, ' '), ' " + classes[j] + " ')]";
					}
					try	{
						elements = document.evaluate(".//" + tag + classesToCheck, elm, namespaceResolver, 0, null);
					}
					catch (e) {
						elements = document.evaluate(".//" + tag + classesToCheck, elm, null, 0, null);
					}
					while ((node = elements.iterateNext())) {
						returnElements.push(node);
					}
					return returnElements;
				};
			} else {
				getElementsByClassName = function (className, tag, elm) {
					tag = tag || "*";
					elm = elm || document;
					var classes = className.split(" "),
						classesToCheck = [],
						elements = (tag === "*" && elm.all)? elm.all : elm.getElementsByTagName(tag),
						current,
						returnElements = [],
						match;
					for (var k=0, kl=classes.length; k<kl; k+=1){
						classesToCheck.push(new RegExp("(^|\s)" + classes[k] + "(\s|$)"));
					}
					for (var l=0, ll=elements.length; l<ll; l+=1){
						current = elements[l];
						match = false;
						for (var m=0, ml=classesToCheck.length; m<ml; m+=1){
							match = classesToCheck[m].test(current.className);
							if (!match) {
								break;
							}
						}
						if (match) {
							returnElements.push(current);
						}
					}
					return returnElements;
				};
			}
			return getElementsByClassName(className, tag, elm);
		}
	};
	
	if (! AboutMe.addEvent) {
		AboutMe.addEvent = function(elem, type, handler) {
			if (elem == null || elem == undefined) return;
			if (elem.addEventListener) {
				elem.addEventListener(type, handler, false);
			} else if (elem.attachEvent) {
				elem.attachEvent("on" + type, handler);
			} else {
				elem["on"+type]=handler;
			}
		}
	};

	if (! AboutMe.log) {
		AboutMe.debug = true;
		AboutMe.log = function(mm) {
			// wrapper for console.log
			if (AboutMe.debug && window.console && console.log) {
				console.log(mm);
			}
		}
	};
	
	if (! AboutMe.Embed) {
		AboutMe.Embed = function(o) {
			var obj = this;
			obj.o = o;
			obj.o.template_id = 'aboutme-embed-' + obj.o.template;
	
			try {
				obj.init();
			} catch(e) {
				AboutMe.log(e);
				// TODO obj.destroy();
			}
			if (obj.valid) AboutMe.Embeds.push(obj);
		};
		AboutMe.Embed.prototype = {
			goldenratio: 1.61803398875,
			init: function() {
				var obj = this;
				AboutMe.log(obj.o.id);
				obj.node = document.getElementById(obj.o.id);
	
				if (! obj.node) {
					document.write('<div id="'+obj.o.id+'"></div>');
					obj.node = document.getElementById(obj.o.id);
				}
				if (! obj.node) {
					throw "About.Me Embed: failed to insert DOM node: "+obj.o.id;
				}
	
				obj.node.className = obj.node.className + ' aboutme-embed';
				obj.node.className = obj.node.className.replace(/ aboutme-(default|site)/g,'');
				obj.node.className = obj.node.className + ' aboutme-'+obj.o.style;
				
				obj.insertCSS();
				obj.node.style.visibility = 'hidden';
				
				obj.o.width = Number(obj.o.width);
				if (isNaN(obj.o.width)) obj.o.width = 'auto';
				if (obj.o.width != 'auto') {
					obj.node.style.width = obj.o.width+'px';
				}
				obj.insertHTML();
	
				AboutMe.log(obj.o.background_image);
				if (obj.o.background_image) {
					obj.imgnode = AboutMe.$('aboutme-img',null,obj.node)[0];
					obj.img = obj.imgnode.getElementsByTagName('img')[0];
					if (obj.img) {
						AboutMe.addEvent(obj.img,'load',function() {
							obj.imgLoaded();
						});
						obj.img.src = obj.o.background_image;
					}
					obj.imgratio = obj.o.background_width / obj.o.background_height;
					obj.pointbreak = Math.round(400 * obj.imgratio);
					//AboutMe.log(obj.pointbreak);
	
					if (obj.o.width == 'auto') {
	
						// need to hide the node to get an unbiased width measurement from the parent
						obj.node.style.display = 'none';
						obj.offsetNode = obj.node;
						while (! obj.width && obj.offsetNode.parentNode) {
							// offsetNode doesn't has no offsetWidth - move up the DOM and check again
							obj.offsetNode = obj.offsetNode.parentNode;
							obj.width = obj.offsetNode.offsetWidth;
							AboutMe.log(obj.width);
						}
						obj.node.style.display = 'block';
	
						// attach resize event to adjust the layout when window is resized
						if (! obj.eventattached) {
							obj.eventattached = true;
							AboutMe.addEvent(window,'resize',function() {
								clearTimeout(obj.timer);
								//obj.setImageSize();
								obj.timer = setTimeout(function() { 
									AboutMe.log(obj.o.id); 
									obj.setImageSize();
								},10);
							});
						}
					}
	
					obj.setImageSize();
				}
	
				obj.node.style.visibility = 'inherit';
				obj.valid = true;
				if (typeof AboutMe.embed_callback == 'function') AboutMe.embed_callback.call(obj);
			},
			insertCSS: function() {
				var obj = this;
				var css_id = obj.o.id+'-css';
				var css = document.getElementById(css_id);
				if (css) return;
	
				css = document.createElement('style');
				css.type = 'text/css';
				css.id = css_id;
				if (css.styleSheet) {
					css.styleSheet.cssText = obj.o.css;
				} else {
					css.appendChild(document.createTextNode(obj.o.css));
				}
				document.getElementsByTagName('head')[0].appendChild(css);
			},
			insertHTML: function() {
				var obj = this;
				obj.node.innerHTML = obj.o.html;
			},
			setImageSize: function() {
				var obj = this;
				if (! obj.o.background_image) return;
	
				if (obj.o.width == 'auto') {
					obj.width = obj.offsetNode.offsetWidth;
				} else {
					obj.width = obj.node.offsetWidth;
				}
				
				if (obj.width <= obj.pointbreak) {
					obj.o.layout = 'vertical';
				} else {
					obj.o.layout = 'horizontal';
				}
				obj.node.className = obj.node.className.replace(/ aboutme-layout-[^ ]+/g,'');
				obj.node.className = obj.node.className + ' aboutme-layout-'+obj.o.layout;
	
				var w = obj.o.background_width,
					h = obj.o.background_height,
					ww, hh;
				
				switch(obj.o.layout) {
					case 'horizontal':
						ww = Math.round(Math.min(w, obj.width - (obj.width / obj.goldenratio)));
						// obj.width - (obj.width / obj.goldenratio)
						// ^ column is divided by the golden ratio, and the image is set to the smaller portion of that division
						// Math.min(w, ...)
						// ^ but image is never larger than its native size
						hh = Math.round(ww / obj.imgratio);
						obj.imgnode.style.width = ww+'px';
						//obj.img.style.width = ww+'px';
						//obj.img.style.height = hh+'px';
						break;
					case 'vertical':
						/* if (w * obj.goldenratio > h) {
							ww = Math.round(Math.min(w, obj.width));
							// ^ image is set to column width, but never larger than its native size
							if (obj.o.style == 'default') ww = ww - 22;
							hh = Math.round(ww / obj.imgratio);
						} else {
							hh = Math.round(Math.min(obj.width,h));
							ww = Math.round(hh * obj.imgratio);
						} */
						obj.imgnode.style.width = 'auto';
						//obj.img.style.width = ww+'px';
						//obj.img.style.height = hh+'px';
						break;
				
				}
				
				if (obj.o.afterImageSize) obj.o.afterImageSize.call(obj);
			},
			imgLoaded: function() {
				var obj = this;
				AboutMe.log('embed img loaded');
				if (typeof AboutMe.embed_imgloaded_callback == 'function') AboutMe.embed_imgloaded_callback.call(obj);
			
			}
		}
	};
	
	
	new AboutMe.Embed({
		id: 'aboutme-adrian_grozavu-1388998058293847',
		user_name: 'adrian.grozavu',
		background_image: 'http://d13pix9kaak6wt.cloudfront.net/background/users/a/d/r/adrian.grozavu_1388850703_49.jpg', 
		background_width: 600,
		background_height: 600,
		template: 'default',
		style: 'default',
		width: 'auto',
		css: '/* about.me embed.css *//* reset for aboutme-embed */#aboutme-adrian_grozavu-1388998058293847 div,#aboutme-adrian_grozavu-1388998058293847 span,#aboutme-adrian_grozavu-1388998058293847 img {margin: 0;padding: 0;border: 0;outline: 0;font-weight: inherit;font-style: inherit;font-size: 100%;font-family: inherit;vertical-align: baseline;text-align: left;background: none;}/* reset for aboutme-default */.aboutme-default#aboutme-adrian_grozavu-1388998058293847 div,.aboutme-default#aboutme-adrian_grozavu-1388998058293847 p,.aboutme-default#aboutme-adrian_grozavu-1388998058293847 img,.aboutme-default#aboutme-adrian_grozavu-1388998058293847 ol,.aboutme-default#aboutme-adrian_grozavu-1388998058293847 ul,.aboutme-default#aboutme-adrian_grozavu-1388998058293847 li {display: block;margin: 0;padding: 0;border: 0;outline: 0;background: none;font-weight: inherit;font-style: inherit;font-size: 100%;font-family: inherit;line-height: inherit;vertical-align: baseline;text-shadow: none;box-shadow: none;}.aboutme-default#aboutme-adrian_grozavu-1388998058293847 span,.aboutme-default#aboutme-adrian_grozavu-1388998058293847 a,.aboutme-default#aboutme-adrian_grozavu-1388998058293847 sub,.aboutme-default#aboutme-adrian_grozavu-1388998058293847 sup {display: inline;margin: 0;padding: 0;border: 0;outline: 0;background: none;font-weight: inherit;font-style: inherit;font-size: 100%;font-family: inherit;line-height: inherit;vertical-align: baseline;text-shadow: none;box-shadow: none;}.aboutme-default#aboutme-adrian_grozavu-1388998058293847 b,.aboutme-default#aboutme-adrian_grozavu-1388998058293847 strong {display: inline;margin: 0;padding: 0;border: 0;outline: 0;background: none;font-weight: bold;font-style: inherit;font-size: 100%;font-family: inherit;line-height: inherit;vertical-align: baseline;text-shadow: none;box-shadow: none;}.aboutme-default#aboutme-adrian_grozavu-1388998058293847 em,.aboutme-default#aboutme-adrian_grozavu-1388998058293847 i {display: inline;margin: 0;padding: 0;border: 0;outline: 0;background: none;font-weight: inherit;font-style: italic;font-size: 100%;font-family: inherit;line-height: inherit;vertical-align: baseline;text-shadow: none;box-shadow: none;}/* base styles for aboutme-embed */.aboutme-embed#aboutme-adrian_grozavu-1388998058293847 {margin: 10px 0;}.aboutme-embed#aboutme-adrian_grozavu-1388998058293847 .aboutme-img img {display: block;border: 0;-webkit-box-sizing: border-box;-moz-box-sizing: border-box;box-sizing: border-box;width: 100%;margin-bottom: 8px;}.aboutme-embed#aboutme-adrian_grozavu-1388998058293847 .aboutme-name {font-size: 140%;font-weight: bold;margin-bottom: 4px;}.aboutme-embed#aboutme-adrian_grozavu-1388998058293847 .aboutme-headline {font-size: 120%;margin-bottom: 8px;}.aboutme-embed#aboutme-adrian_grozavu-1388998058293847 .aboutme-bio {margin-bottom: 15px;}.aboutme-embed#aboutme-adrian_grozavu-1388998058293847 .aboutme-bio p {margin: 0;margin-bottom: 8px;}.aboutme-embed#aboutme-adrian_grozavu-1388998058293847 .aboutme-apps {}.aboutme-embed#aboutme-adrian_grozavu-1388998058293847 .aboutme-apps a {border: 0 !important;display: inline-block !important;width: 32px !important;height: 32px !important;margin: 0 2px 5px 0 !important;padding: 0 !important;text-decoration: none !important;background-repeat: no-repeat !important;background-position: left top !important;}.aboutme-embed#aboutme-adrian_grozavu-1388998058293847 .aboutme-apps a.app-twitter { background-image: url(http://dcbdluf1ahqio.cloudfront.net/twitter/32x32.png); }.aboutme-embed#aboutme-adrian_grozavu-1388998058293847 .aboutme-apps a.app-googleplus { background-image: url(http://dcbdluf1ahqio.cloudfront.net/googleplus/32x32.png); }.aboutme-embed#aboutme-adrian_grozavu-1388998058293847 .aboutme-apps a.app-tumblr { background-image: url(http://dcbdluf1ahqio.cloudfront.net/tumblr/32x32.png); }.aboutme-embed#aboutme-adrian_grozavu-1388998058293847 .aboutme-apps a.app-wordpress { background-image: url(http://dcbdluf1ahqio.cloudfront.net/wordpress/32x32.png); }/* styles for horizontal layout */.aboutme-layout-horizontal#aboutme-adrian_grozavu-1388998058293847 .aboutme-content {display: table;width: 100%;}.aboutme-layout-horizontal#aboutme-adrian_grozavu-1388998058293847 .aboutme-img {display: table-cell;vertical-align: top;padding-right: 15px;margin-bottom: 0;}.aboutme-layout-horizontal#aboutme-adrian_grozavu-1388998058293847 .aboutme-img img {margin-bottom: 0;}.aboutme-layout-horizontal#aboutme-adrian_grozavu-1388998058293847 .aboutme-text {display: table-cell;vertical-align: top;}/* styles for aboutme-default */.aboutme-default#aboutme-adrian_grozavu-1388998058293847 {font-family: Helvetica, Arial, Sans-Serif;font-size: 16px;font-weight: normal;font-style: normal;line-height: 1.4;color: #333;background-color: #fff;padding: 10px;border: 1px solid #eee;border-color: rgba(0,0,0,0.2);box-shadow: 1px 1px 5px rgba(0,0,0,0.1);border-radius: 2px;margin: 10px 0;}.aboutme-default#aboutme-adrian_grozavu-1388998058293847 a {color: #2b82ad;text-decoration: none;}.aboutme-default#aboutme-adrian_grozavu-1388998058293847 a:hover {color: #3aa9e9;text-decoration: none;}.aboutme-default#aboutme-adrian_grozavu-1388998058293847 p,.aboutme-default#aboutme-adrian_grozavu-1388998058293847 ol,.aboutme-default#aboutme-adrian_grozavu-1388998058293847 ul {margin-bottom: 0.75em !important;}.aboutme-default#aboutme-adrian_grozavu-1388998058293847 .aboutme-img img {border: 1px solid;border-color: #999;border-color: rgba(0,0,0,0.5);}.aboutme-default#aboutme-adrian_grozavu-1388998058293847 .aboutme-name {font-size: 140%;font-weight: bold;margin-bottom: 4px;}.aboutme-default#aboutme-adrian_grozavu-1388998058293847 .aboutme-headline {font-size: 120%;margin-bottom: 8px;}.aboutme-default#aboutme-adrian_grozavu-1388998058293847 .aboutme-bio {font-family: Georgia, Times, Serif;font-size: 14px;}.aboutme-default#aboutme-adrian_grozavu-1388998058293847 ul {list-style: disc;}.aboutme-default#aboutme-adrian_grozavu-1388998058293847 ol {list-style: decimal;}.aboutme-default#aboutme-adrian_grozavu-1388998058293847 ul,.aboutme-default#aboutme-adrian_grozavu-1388998058293847 ol {list-style-position: outside;padding-left: 2em;}.aboutme-default#aboutme-adrian_grozavu-1388998058293847 ul li,.aboutme-default#aboutme-adrian_grozavu-1388998058293847 ol li {display: list-item;padding: 0;margin: 0;}',
		html: '<div xmlns="http://www.w3.org/1999/xhtml" class="aboutme-content"><div class="aboutme-img"><a href="http://about.me/adrian.grozavu" target="_top"><img /></a></div><div class="aboutme-text"><div class="aboutme-name"><a href="http://about.me/adrian.grozavu" target="_top">Adrian GROZAVU</a></div><div class="aboutme-headline">I\'m an exception to the rule</div><div class="aboutme-bio"><p>IT, sci-fi passionate</p></div><div class="aboutme-apps"><a href="http://www.twitter.com/adrian_grozavu" class="app-twitter" title="Twitter" target="_top">Â </a><a href="http://plus.google.com/105474226716000579314/" class="app-googleplus" title="Google+" target="_top">Â </a><a href="http://s-brody.tumblr.com" class="app-tumblr" title="Tumblr" target="_top">Â </a><a href="http://adriangrozavu.wordpress.com" class="app-wordpress" title="WordPress" target="_top">Â </a></div></div></div>'
	});

})(this, this.document);

