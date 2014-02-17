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

var EXPORTED_SYMBOLS = ["CacheService"];

Components.utils.import("resource://gre/modules/NetUtil.jsm");
Components.utils.import("resource://gre/modules/devtools/Console.jsm").console;

//const Cc = Components.classes;
//const Ci = Components.interfaces;
//const Cr = Components.results;

function CacheService (){

    var SimpleIndexVisitor = function (cacheContent){
        var i=0
        this.visitDevice = function (deviceID,deviceInfo){
            return true;
            }
            
        this.visitEntry = function (entryID,entryInfo){
            cacheContent[i]=entryInfo.key;
            i++;
            return true
            }
    } 
    
    var FullIndexVisitor = function (cacheContent){
        this.visitDevice = function (deviceID,deviceInfo){
            return true;
            }
            
        this.visitEntry = function (entryID,entryInfo){
            cacheContent[entryInfo.key]=entryInfo;
            return true
            }
    }           

    var CacheService = Cc["@mozilla.org/network/cache-service;1"].getService(Ci.nsICacheService);  
    var CacheSession = CacheService.createSession("HTTP", Components.interfaces.nsICache.STORE_ANYWHERE, Ci.nsICache.STREAM_BASED);

    this.getIndex = function (){
        cacheContent = new Array();
    
        CacheService.visitEntries(new SimpleIndexVisitor(cacheContent))
        
        return cacheContent;
    }
    
    this.getFullIndex = function (){
        cacheContent = new Array();
    
        this.CacheService.visitEntries(new FullIndexVisitor(cacheContent))
        
        return cacheContent;
    }    
        
    this.get = function(key, onOK, onError ){
        CacheSession.asyncOpenCacheEntry(key, Ci.nsICache.ACCESS_READ, new CacheEntryReader(key, onOK, onError) , true);
    }
    
    // Not implemented
    this.put = function (key, onOK, onError , content){
        CacheSession.openCacheEntry(key, Ci.nsICache.ACCESS_WRITE, new CacheEntryListener( callback ), true );
    }
    
    var CacheEntryListener = function (callback){
        this.onCacheEntryAvailable = callback; 
    }
    
    var CacheEntryReader = function (key, onOK, onError){
        this.onCacheEntryAvailable = function (descriptor, accessGranted, status){
            if (status == 1  || accessGranted == Ci.nsICache.ACCESS_NONE ){
                onError(key);
            }
            else {
                var metaData = new Array();
                descriptor.visitMetaData(metaData);
                var stream = descriptor.openInputStream(0)
                var content = NetUtil.readInputStreamToString(stream,stream.available());
                onOK(key,content,metaData)
            }
        }
    }
    
    
    var MetaDataVisitor = function (metaData){
        this.visitMetaDataElement = function (key,value) {
            metaData[key]=value
            return true;
        }
    }
}
myCache = new CacheService();
index = myCache.getIndex()
console.log(index.length)
//for (x in tmp) alert(x)
// should be in the cache
// myCache.get("http://s2.lemde.fr/image/2013/11/03/312x156/3507389_3_6edb_le-rat-est-l-un-des-principaux-hotes-du_cba79f9cea0610360f5509bdfe126fd7.jpg",function (a){alert("OK"+ a)}, function (a){alert("NOK"+ a)} )
