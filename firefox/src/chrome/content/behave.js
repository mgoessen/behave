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

Components.utils.import("chrome://behave/content/bloom.js");
Components.utils.import("chrome://behave/content/cache.js");
Components.utils.import("chrome://behave/content/history.js");

function Behave(){
	var cacheService = new CacheService();
	var historyService = new HistoryService();
	var p2p = null;

	var historySize = 5000;
	var HistoryBloomFilterBitsPerElement = 20
	var HistoryBloomFilterBitsHashFunctions = 14
		
	var CacheBloomFilterBitsPerElement = 20
	var CacheBloomFilterBitsHashFunctions = 14

	this.cache2bloom = function (){
		var cache=cacheService.getIndex();
		var size = cache.length;
		var bloomFilteredCache = new BloomFilter(size, CacheBloomFilterBitsPerElement*size, CacheBloomFilterBitsHashFunctions);
		for (var i=0;i<size;i++){
		    console.log(i)
			bloomFilteredCache.add(cache[i]);		
		}
		return bloomFilteredCache;		
	} 

	this.history2bloom = function (){
		var history=historyService.get(historySize);
		var size = history.length; // can be < historySize at start
		var bloomFilteredHistory = new BloomFilter(size, HistoryBloomFilterBitsPerElement*size, CacheBloomFilterBitsHashFunctions);
		for (var i=0;i<size;i++){
			bloomFilteredHistory.add(history[i]);		
		}
		return bloomFilteredHistory;
	} 
}

//behave = new Behave();
//console.log("Cache: " + behave.cache2bloom().getFilter())
//console.log("History: " + behave.history2bloom().getFilter())

    
