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


//  https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIRequest#loadFlags%28%29
// https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsICachingChannel
// https://developer.mozilla.org/en-US/docs/XPCOM_Interface_Reference/nsIChannelEventSink
// http://stackoverflow.com/questions/1695440/altering-http-responses-in-firefox-extension
// httpChannel.setRequestHeader("X-Moz-Is-Feed", "1", false);                

Components.utils.import("chrome://behave/content/protocolHandler.js");
Components.utils.import("resource://gre/modules/XPCOMUtils.jsm");

var Observer = function () {

    this.observe = function(subject, topic, data){
        if (topic === "http-on-modify-request" && subject instanceof Components.interfaces.nsITraceableChannel){
            //console.log("onModifyRequest: " + subject.QueryInterface(Components.interfaces.nsIHttpChannel).URI.spec);
            var listener =  new Listener(subject);                
            listener.run(); // subject.QueryInterface(Components.interfaces.nsIHttpChannel).URI.spec);
        }
    }
    
    var Listener = function (channel){
        this.QueryInterface = function () {XPCOMUtils.generateQI([Ci.nsIStreamListener,Ci.nsIRequestObserver, Ci.nsIRunnable]) }
    
        this.oldListener;

        this.run = function(url){
            console.log("run: " + url)
            this.oldListener = channel.setNewListener( this );
            //channel.QueryInterface(Components.interfaces.nsIRequest).cancel(Components.results.NS_BINDING_ABORTED);
        }        
        
        this.onDataAvailable = function(channel, context, stream){
            console.log("onDataAvailable: " + channel.QueryInterface(Components.interfaces.nsIHttpChannel ).URI.spec)
        }
        
        this.onStartRequest = function(request, context){
            console.log("onStartRequest: "  + request.QueryInterface(Components.interfaces.nsIHttpChannel ).URI.spec)
            var stream = Components.classes["@mozilla.org/io/string-input-stream;1"].createInstance(Ci.nsIStringInputStream);
            stream.setData("<html>Hi there!</html>", -1);
            this.oldListener.onStartRequest(channel, context);
            channel.setResponseHeader("Refresh", "5; url=http://google.com/", true);
            this.oldListener.onDataAvailable(channel, context, stream, 0, stream.available());
            this.oldListener.onStopRequest(channel, context,Components.results.NS_OK);       
            channel.QueryInterface(Components.interfaces.nsIRequest).cancel(Components.results.NS_BINDING_ABORTED);            
        }
        
        this.onStopRequest = function(request, context, status){
            console.log("onStopRequest: "  + request.QueryInterface(Components.interfaces.nsIHttpChannel ).URI.spec )

        }
    }       
    
}
var obs = new Observer();
var observerService = Components.classes["@mozilla.org/observer-service;1"]
                      .getService(Components.interfaces.nsIObserverService);
/*                     
console.log("=== start === ")
observerService.addObserver(obs,"http-on-modify-request",false);
window.setTimeout(function () {
    console.log("=== end === ")
    observerService.removeObserver(obs,"http-on-modify-request");
},  30000)
*/

