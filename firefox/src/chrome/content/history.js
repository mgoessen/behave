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

var EXPORTED_SYMBOLS = ["HistoryService"];

const Cc = Components.classes;
const Ci = Components.interfaces;
const Cr = Components.results;

var HistoryService = function(){

    historyService = Cc["@mozilla.org/browser/nav-history-service;1"].getService(Ci.nsINavHistoryService);
                            
    this.get = function (numResults){

        var query = historyService.getNewQuery();
        
        var options = historyService.getNewQueryOptions();
        options.maxResults=numResults;
        options.sortingMode=options.SORTBYDATEDESCENDING;
        options.resultType=options.RESULTSASURL;
        options.queryType=options.QUERYTYPEHISTORY;

        var result = historyService.executeQuery(query, options);

        var cont = result.root;
        cont.containerOpen = true;

        var resultArray = new Array()
        for (var x = 0; x < cont.childCount; x++) {
            resultArray[x] = cont.getChild(x).uri;
        }
        cont.containerOpen = false;
        return resultArray;
    }
}
    
//myHistory = new HistoryService();
//console.log(myHistory.get())

