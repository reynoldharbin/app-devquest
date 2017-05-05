// Copyright 2017 - Reynold Harbin
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


var _ = require('underscore');

var github = require('octonode');
var prettyjson = require("prettyjson");


// Instantiate a github client with or without a token
var client = github.client();
var ghsearch = client.search();

//var ghme           = client.me();
//var ghuser         = client.user('reynoldharbin');
//var ghrepo         = client.repo('reynoldharbin/dofindme');
//var ghorg          = client.org('');
//var ghissue        = client.issue('pksunkara/hub', 37);
//var ghmilestone    = client.milestone('pksunkara/hub', 37);
//var ghlabel        = client.label('pksunkara/hub', 'todo');
//var ghpr           = client.pr('pksunkara/hub', 37);
//var ghrelease      = client.release('pksunkara/hub', 37);
//var ghgist         = client.gist();
//var ghteam         = client.team(37);
//var ghproject      = client.project('pksunkara/hub', 37);
//var ghnotification = client.notification(37);


//const API_KEY = 'AIzaSyCW9fZsCTVa7zxh-QfPwFqlwa1z6JrnLTc';
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

var searchTermsArray=[];
searchTermsArray.push(SEARCH_1);
searchTermsArray.push(SEARCH_2);
searchTermsArray.push(SEARCH_3);
searchTermsArray.push(SEARCH_4);
searchTermsArray.push(SEARCH_5);
searchTermsArray.push(SEARCH_6);
searchTermsArray.push(SEARCH_7);
searchTermsArray.push(SEARCH_8);
searchTermsArray.push(SEARCH_9);
searchTermsArray.push(SEARCH_10);
searchTermsArray.push(SEARCH_11);
searchTermsArray.push(SEARCH_12);
searchTermsArray.push(SEARCH_13);
searchTermsArray.push(SEARCH_14);

function prettyJSON(data) {
    return prettyjson.render(data);
}


//print header
console.log("searchTerm,user,userLink,created,updated,pageLink,title");

//SEARCH ISSUES
_.each(searchTermsArray, function(searchterm) {
	ghsearch.issues({
	  q: searchterm,
	  sort: 'created',
	  order: 'asc'
	}, function(error, body, header){
		if (error){
			console.log('--> SEARCH ERROR:' +JSON.stringify(error));
		} else {
			var itemCount = body.total_count ;
			var itemsArray = body.items ;
			var itemsArrayCount = itemsArray.length;

			//console.log("*************************************");
			//console.log("  --> searchterm.  : " + searchterm);
			//console.log("  --> resultsCount : " + itemsArrayCount);
			//console.log("*************************************");
			//console.log("");
			//console.log("searchTerm,title,user,created,updated,userLink,pageLink");

			if ( itemCount > 0 ) {
				_.each(itemsArray, function(responseItem) {

					var title = responseItem.title;
					var pageLink = responseItem.html_url;
			    	var userLogin = responseItem.user.login;
					var userLink = responseItem.user.html_url;
			    	var created = responseItem.created_at;
			    	var updated = responseItem.updated_at;
			    	var body = prettyJSON(responseItem.body);
					console.log(searchterm + ',' + userLogin + ',' + userLink +  ',' + created + ',' + updated + ',' + pageLink + ',' + title);
			    });
			} else {
				console.log("ERROR: no items returned");
			}
			//console.log('--> SEARCH BODY:' + prettyJSON(body));
			//console.log('--> SEARCH HEADER:' +JSON.stringify(header));
		}
	}); //array of search results
});


/*

ghsearch.issues({
//  q: 'AWS c4.xlarge',
  q: searchterm,
  sort: 'created',
  order: 'asc'
}, function(error, body, header){

	if (error){
		console.log('--> SEARCH ERROR:' +JSON.stringify(error));
	} else {
		var itemCount = body.total_count ;
		var itemsArray = body.items ;
		var itemsArrayCount = itemsArray.length;

		console.log("*************************************");
		console.log("  --> itemCount: " + itemCount);
		console.log("  --> itemsArrayCount: " + itemsArrayCount);
		console.log("*************************************");
		console.log("searchTerm,title,user,created,updated,userLink,pageLink,body");

		if ( itemCount > 0 ) {
			_.each(itemsArray, function(responseItem) {

				var title = responseItem.title;
				//console.log("DEBUG:1:title:" + title);

				var pageLink = responseItem.html_url;
				//console.log("DEBUG:1:pageLink:" + pageLink);


		    	var userLogin = responseItem.user.login;
				//console.log("DEBUG:2:userLogin:" + userLogin);
				var userLink = responseItem.user.html_url;
				//console.log("DEBUG:2:userLink:" + userLink);


		    	var created = responseItem.created_at;
		    	var updated = responseItem.updated_at;
				//console.log("DEBUG:3:created:" + created);
				//console.log("DEBUG:3:updated:" + updated);


		    	var body = prettyJSON(responseItem.body);

				console.log(searchterm + ',' + title + ',' + userLogin + ',' + created + ',' + updated + ',' + userLink + ',' + pageLink + ',' + "body");


		    });
		} else {
			console.log("ERROR: no items returned");
		}

		//console.log('--> SEARCH BODY:' + prettyJSON(body));
		//console.log('--> SEARCH HEADER:' +JSON.stringify(header));
	}
}); //array of search results

*/
