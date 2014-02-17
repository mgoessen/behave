/*
 * Copyright (c) 2013 Mathieu Goessens <mathieu.goessens@inria.fr> , <gebura@poolp.org>
 *
 * This file is part of Behave P2P CDN <https://github.com/mgoessen/behave>
 *
 * Behave is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * Behave is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero Public License for more details.
 *
 * You should have received a copy of the GNU Affero Public License
 * along with Behave.  If not, see <http://www.gnu.org/licenses/>.
 *
 */


var EXPORTED_SYMBOLS = ["BehaveProtocolHandler","BehaveChannel"];

Components.utils.import("resource://gre/modules/devtools/Console.jsm").console;
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

BehaveProtocolHandler = function(){}

BehaveProtocolHandler.prototype = {
  	classDescription: "Behave Protocol Handler",
  	contractID: "@mozilla.org/network/protocol;1?name=behave",
  	classID: Components.ID( '{1c564670-4b06-11e3-8f96-0800200c9a66}' ),
  
	QueryInterface: XPCOMUtils.generateQI([Components.interfaces.nsIProtocolHandler]),

	scheme:"behave",
	defaultPort : -1,
	protocoleFlags :   Components.interfaces.nsIProtocolHandler.URI_STD |
	                   Components.interfaces.nsIProtocolHandler.URI_NORELATIVE,

	allowPort: function (aPort, aScheme){
		return false;
	},

	newURI: function(aSpec, aOriginCharset, aBaseURI){
		var uri = Components.classes["@mozilla.org/network/simple-uri;1"].createInstance(Components.interfaces.nsIURI);
		uri.spec = aSpec;
		return uri;
	},

	newChannel: function(aURI){
	        return new BehaveChannel(aURI)
	},

	install: function(){
		if (factory == undefined || !factory)	return;

		console.log("Installing behave protocol handler")
		Components.manager.QueryInterface(Components.interfaces.nsIComponentRegistrar).registerFactory(
		    BehaveProtocolHandler.prototype.classID,
		    BehaveProtocolHandler.prototype.classDescription,
		    BehaveProtocolHandler.prototype.contractID,
		    factory);
	},

	uninstall: function(){
		if (factory == undefined || !factory)	return;

		console.log("UnInstalling behave protocol handler")
		Components.manager.QueryInterface(Components.interfaces.nsIComponentRegistrar).unregisterFactory(BehaveProtocolHandler.prototype.classID,factory);
	}	


}

function BehaveChannel (uri){
	//
	// Fields
	//
	var done = false;
	var suspended = false;

	// nsIRequest
	this.loadFlags              = 0;
	this.loadGroup              = null;
	this.name                   = uri;
	this.status                 = 200;

	// nsIChannel
	this.contentCharset         = "utf-8";
	this.contentLength          = -1;
	this.contentType            = "text/html";
	this.notificationCallbacks  = null;
	this.originalURI            = uri;
	this.owner                  = null;
	this.securityInfo           = null;
	this.URI                    = uri;

	//
	// Functions
	//
    this.QueryInterface = function () {XPCOMUtils.generateQI([Components.interfaces.nsISupport,Components.interfaces.nsIRequest,Components.interfaces.nsIChannel]) }

	this.cancel = function (aStatus){
	       done=true;
	       this.status = aStatus;
	}

	this.isPending = function (){
	       return !done;
	}

	this.resume = function(){
		if (suspended == true)
			suspended = false;
		else
			throw Cr.NS_ERROR_NOT_INITIALIZED;	
	}

	this.suspend = function (){
		if (suspended == true)
			throw Cr.NS_ERROR_ALREADY_INITIALIZED;
		else
			suspended = true;			
	}

	this.open = function() {
        	throw Cr.NS_ERROR_NOT_IMPLEMENTED;
	}

    this.asyncOpen = function (aListener, aContext) {
		this.listener = aListener;
		this.context  = aContext;

		var aInputStream = Components.classes["@mozilla.org/io/string-input-stream;1"].createInstance(Components.interfaces.nsIStringInputStream);
		aInputStream.setData("<html>Hi there!</html>", -1);
		aListener.onStartRequest(this, aContext);
		aListener.onDataAvailable(this, aContext, aInputStream,0,aInputStream.available());
		done=true;		
		aListener.onStopRequest(this, aContext, this.status);
	}
}


if ("generateNSGetFactory" in XPCOMUtils)
  var NSGetFactory = XPCOMUtils.generateNSGetFactory([BehaveProtocolHandler]);
else
  var NSGetModule = XPCOMUtils.generateNSGetModule([BehaveProtocolHandler]); 

var factory = NSGetFactory(BehaveProtocolHandler.prototype.classID);

/*
console.log("=== start === ")
Components.manager.QueryInterface(Components.interfaces.nsIComponentRegistrar).registerFactory(
    BehaveProtocolHandler.prototype.classID,
    BehaveProtocolHandler.prototype.classDescription,
    BehaveProtocolHandler.prototype.contractID,
    factory);

window.setTimeout(function () {
    console.log("=== end === ");
    Components.manager.QueryInterface(Components.interfaces.nsIComponentRegistrar).unregisterFactory(BehaveProtocolHandler.prototype.classID,factory);
},  15000)

*/
