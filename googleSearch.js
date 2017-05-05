// Copyright 2012-2016, Google, Inc.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//    http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

'use strict';

var _ = require('underscore');
var google = require('../doDroplet/node_modules/googleapis/lib/googleapis.js');

var customsearch = google.customsearch('v1');

// You can get a custom search engine id at
// https://www.google.com/cse/create/new
const CX = '000317899372327322006:4srupeowv68';
const API_KEY = 'AIzaSyCW9fZsCTVa7zxh-QfPwFqlwa1z6JrnLTc';
const SEARCH_1 = 'AWS c4.xlarge';
const SEARCH_2 = 'AWS c4.2xlarge';
const SEARCH_3 = 'AWS c4.4xlarge';
const SEARCH_4 = 'AWS c4.8xlarge';
const SEARCH_5 = 'AWS c3.large';
const SEARCH_6 = 'AWS c3.xlarge';
const SEARCH_7= 'AWS c3.2xlarge';
const SEARCH_8 = 'AWS c3.4xlarge';
const SEARCH_9 = 'AWS c3.8xlarge';
const SEARCH_10 = 'GCE n1-highcpu-2';
const SEARCH_11 = 'GCE n1-highcpu-4';
const SEARCH_12 = 'GCE n1-highcpu-8';
const SEARCH_13 = 'GCE n1-highcpu-16';
const SEARCH_14 = 'GCE n1-highcpu-321';

var SEARCH = SEARCH_14;


customsearch.cse.list({ cx: CX, q: SEARCH, auth: API_KEY }, function (err, resp) {
  if (err) {
    return console.log('An error occured', err);
  }
  // Got the response from custom search
  //console.log('Result: ' + resp.searchInformation.formattedTotalResults);
  

  if (resp.items && resp.items.length > 0) {

	var responseObjectCount = resp.items.length;
	//console.log('=================================================');
	//console.log('Found '+responseObjectCount + " results for search term "+ SEARCH);
  	//console.log ("searchTerm" + '|' + "author" + '|' + "githubProfile" + '|' + 'articleTitle' + '|' + "titleUrl" );
	_.each(resp.items, function(responseItem) {
    	var title = responseItem.title;
    	var url = responseItem.formattedUrl;
	    var pageMap = responseItem.pagemap

	    console.log('--> RESPONSE:' +JSON.stringify(responseItem));

	    if ( pageMap ) {
		    var code = pageMap.code;
		    if ( code ) {
		    	//console.log('--> codeObject:' + JSON.stringify(code));
		    	var codeFirstObject = code[0];
		    	var author = codeFirstObject.author;
				var githubProfile = 'https://github.com/' + author;
				//console.log (SEARCH + '|' + author + '|' + githubProfile + '|' + title + '|' + url );
		    } else {
		    	//console.log('--> nil code, skipping...');
		    	var author = "notFound";
		    	var githubProfile = 'https://github.com/' + author;
		    }	    	
	    } else {
	    	var author = "notFound";
		    var githubProfile = 'https://github.com/' + author;
	    }

	    console.log (SEARCH + '|' + author + '|' + githubProfile + '|' + title + '|' + url );


    });
  }






});