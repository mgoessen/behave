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
 */

/* WARNING: BROKEN. DO NOT USE IT. */

var EXPORTED_SYMBOLS = ["fnv1_a"];

function fnv1_a(key){
    key="" + key; 	// force key to be a string, otherwise it don't works
    var hash = 0x811C9DC5;     // 32 bit FNV_Offset = 0x811C9DC5
    
    for(var x=0; x< key.length; x++) {
        hash = hash ^ key[x]
        // 32 bit FNV_Prime = 2**24 + 2**8 + 0x93 = 16,777,619 = 0x01000193
        hash *= 0x01000193
    }
    return hash  >>> 0;
}
