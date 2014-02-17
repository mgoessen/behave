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

var EXPORTED_SYMBOLS = ["BloomFilter","BloomFilterTest"];

Components.utils.import("resource://gre/modules/devtools/Console.jsm").console;
Components.utils.import("chrome://behave/content/murmur3.js");
//Components.utils.import("chrome://behave/content/fnv.js");


function BloomFilter (n, m, k){

    var filter = new Array(m);
    var size = 0;

    for (var i=0; i<m; i++){
        filter[i]=0;
    }

    this.add = function (key){
	size++;
        var hashes = calculateHashes(key, k, m)
        for(var i=0; i < hashes.length; i++) {
            filter[hashes[i]] = 1
        }
    }
    
    this.contains = function (key){
        var hashes = calculateHashes(key, k , m)
        for(var i=0; i < hashes.length; i++) {
            if (hashes[i] > m-1) {
		console.error("Should never appears" + hashes[i])
		}
            if (filter[hashes[i]] == 0){
                return false;
                }
        }
        return true
    }

    this.getFalsePositive = function (){
        // (1- e(-k*(n+0.5)/(m-1) ) )^k
        return Math.pow( 1 - Math.pow(Math.E,(-k*(n+0.5)/(m-1))) , k)
    }
    
    var calculateHashes = function (key, k, m){
        var a = murmurhash3_32_gc(key, 35445)
        var b = murmurhash3_32_gc(key, 1234567890)
        //console.debug("key=" + key + " a=" + a + " b=" + b)
        var hashes =  new Array(k)

        for (var i=0; i<k; i++){
            hashes[i] = ( ((a + i*b + Math.pow(i,2) ) >>> 0) % m) 
        }
        //console.debug("Hash for key " + key + " is " + hashes)
        return hashes;
    }
    
    this.getFilter = function () {
        return filter;
    }

    this.getSize = function (){
	return size;
    }
}

//var bloom1 = new BloomFilter(5, 100, 20);
//for (var x=0; x<3; x++){ bloom1.add(x) }
//for (var x=0; x<3; x++){ alert(bloom1.contains(x)) }

function BloomFilterTest( n , m , k , n2 , n3 ){ // BloomFilter( n elements , m bits, k hash ,); adds n2 elements; test n3 elements 
    console.info("===== Creating Bloom =====")
    var bloomtest = new BloomFilter(n, m, k);
    
    // Id Space for element added / tested
    // WARN: when using only fnv as hash function, looks like we have a lot of collisions if using same id space
    var space1 = Math.pow(2,32)
    var space2 = Math.pow(2,32)
    
    console.info("===== Inserting Elements =====")
    var added=new Array()
    for (var x=0; x<n2; x++){
    	var y=Math.ceil(Math.random() * space1)
    	bloomtest.add(y)
    	added[y]=1
    }
    
    console.info("===== Counting Colored bits =====")    
    var colored=0
    for (var x in bloomtest.getFilter()) if (bloomtest.getFilter()[x]==1) colored++;
    
    console.info("===== Checking for false negative (errors) =====")        
    var error = 0;
    for (var x in added){
        if (!bloomtest.contains(x) ){
            error++
            }
    }

    console.info("===== Checking for false postives (expected) =====")            
    var falses = 0
    var tested = 0;
    var present = 0;
    for (var x=0; x<(n3); x++){
    	var y=Math.ceil(Math.random() * space2)
    	if( bloomtest.contains(y)){
    	   if (!added[y]) falses++
    	   else present++
    	}
	tested++
    }
    console.info("Colored: " + colored + " Error:" + error + " Falses: " + falses + " Present: " + present + " Tested: " + tested + " Ratio:" + (falses/tested) + " Expected: " +bloomtest.getFalsePositive() )
}

//BloomFilterTest()
