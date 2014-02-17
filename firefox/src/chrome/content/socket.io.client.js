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

Components.utils.import("resource://gre/modules/Services.jsm");
Services.scriptloader.loadSubScript("chrome://behave/content/socket.io.js");

function SocketIO( options , callbacks){
  var options = options || {};
  var callback = callbacks || {}
  var host = options.host || "http://localhost:8080/" ;
  
  this.socket = io.connect(host);
  
  for (x in callbacks){
    this.socket.on(x, callback[x]);
  }
}

var socketIO = new SocketIO(
    { host: "http://localhost:8080" },
    {
        "connect": function(data){
            console.log("connect");
        },
        "hello" : function(data){
            console.log(data);
            console.log(this)
            this.id=data.id;
            this.peers=data.peers;
            this.socket.disconnect()
        },
        "disconnect": function(data){
            console.log("disconnect");
        }    
        
    });
