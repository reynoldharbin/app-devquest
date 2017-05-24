//  Created by Reynold Harbin on 5/5/17.
//

var _ = require('underscore');
var config = require('./dofindme-config.js');
var logTag = "dofindme-actions.js:";
var nPromise = require('promise'); 
var prettyjson = require("prettyjson");

//APIs
var github = require('octonode');

module.exports = {
	
	//exported helper functions
	arrayUnique: function (array) {
	  	var a = array.concat();
	    for(var i=0; i<a.length; ++i) {
	        for(var j=i+1; j<a.length; ++j) {
	            if(a[i] === a[j])
	                a.splice(j--, 1);
	        }
	    }
	    return a;
	},

	prettyJSON: function (data) {
    	return prettyjson.render(data);
	},

	helloWorld: function(request, response) {
		console.log(logTag + "helloWorld:with request:" +JSON.stringify(request));

		var searchterm = request.searchterm;
		var searchsite = request.searchsite;
		
		var promise = new nPromise(function(resolve, reject){
			if (searchterm && searchsite) {
				//console.log(logTag+"call API for: " + searchsite + " for term: " + searchterm );
				resolve(logTag + "helloWorld:you're awesome!");			
			} else {
				console.log("ERROR:"+logTag+"requires searchterm and searchsite");
				reject(logTag + "helloWorld:You suck!");
			}
		});  //end promise

		return promise;
	},

	searchGitHub: function(request, response) {
		console.log(logTag + "searchGitHub: with request:" +JSON.stringify(request));

		// Instantiate a github client with or without a token
		//var client = github.client();
		//client from credentials
		/*
		var client = github.client({
  			username: 'reynoldharbin',
			password: 'GI1ou812'
		});
		*/

		if (config.settings.stubAPI == true ) {
			console.log("CHECK:0:gotta stub...");

			var stubPromise = new nPromise(function(resolve, reject){

				console.log("CHECK:1:inside the promise, about the resolve.");
				var stubResults = {};
				stubResults['title'] = "the meaning to a developer life _stub";
				stubResults['userLogin'] = "answer42_stub";
				stubResults['userLink'] = "answer42_Link_stub";
				stubResults['pageLink'] = "stubPageLink";
				stubResults['created'] = "stubCreated";
				stubResults['updated'] = "stubUpdated";
				stubResults['searchterm'] = "stubSearchterm";
				stubResults['searchsite'] = "github";
				resolve(stubResults);				
			});  //end promise
			return stubPromise;
		} else {
			var client = github.client(config.apikeys.github);
			console.log(logTag + "searchGitHub:client initated with key:" + config.apikeys.github);

			var ghsearch = client.search();
			var searchterm = request.searchterm;
			var promise = new nPromise(function(resolve, reject){
				if (searchterm ) {
					//console.log(logTag+"searchGitHub:call github API for term: " + searchterm );
					ghsearch.issues({
					  q: searchterm,
					  page: 1,
					  per_page: config.settings.githubMaxResults,
					  sort: 'created',
					  order: 'asc'
					}, function(error, body, header){
						if (error){
							console.log('--> SEARCH ERROR:' +JSON.stringify(error));
							reject(logTag + "searchGitHub:You suck!");
						} else {
							//set results variable
							var searchsite = 'github'
							var totalResultsCount = body.total_count ;
							var itemsReturnedArray = body.items ;
							var itemsReturnedCount = itemsReturnedArray.length;
							
							console.log("*************************************");
							console.log("  --> searchterm                : " + searchterm);
							console.log("  --> searchsite                : " + searchsite);
							console.log("  --> totalResultsCount         : " + totalResultsCount);
							console.log("  --> itemsReturnedCount        : " + itemsReturnedCount);
							console.log("  --> resultsHeader             : " + module.exports.prettyJSON(header));
							console.log("*************************************");

							//console.log("WORKING:1: --> stringified body      : " + JSON.stringify(body));
							//console.log("*************************************");
							console.log("");

							//console.log("searchTerm,title,user,created,updated,userLink,pageLink");


							//populate resultsObject
							var resultsArray = [];

							var resultsObject = {}; //RMH-HERE-99-NOW define this
							resultsObject.searchTerm = searchterm;
							resultsObject.totalResultsCount = totalResultsCount;
							resultsObject.itemsReturnedCount = itemsReturnedCount;
							if ( itemsReturnedCount > 0 ) {
								_.each(itemsReturnedArray, function(responseItem) {
									var title = responseItem.title;
									var pageLink = responseItem.html_url;
							    	var userLogin = responseItem.user.login;
									var userAvatarLink = responseItem.user.avatar_url;
									var userLink = responseItem.user.html_url;
									var userType = responseItem.user.type;
							    	var created = responseItem.created_at;
							    	var updated = responseItem.updated_at;
									var issueCommentsCount = responseItem.comments;
							    	var issueBody = responseItem.body;
							    	
							    	// set up the resultItemObject
							    	var resultItemObject = {};

							    	//var body = module.exports.prettyJSON(responseItem.body);
									//console.log(searchterm + ',' + userLogin + ',' + userLink +  ',' + created + ',' + updated + ',' + pageLink + ',' + title);
									console.log("PROCESSING item with title:" + title);
									resultItemObject['searchSite'] = searchsite;
									resultItemObject['title'] = title;
									resultItemObject['pageLink'] = pageLink;
									resultItemObject['userLogin'] = userLogin;
									resultItemObject['userAvatarLink'] = userAvatarLink;
									resultItemObject['userLink'] = userLink;
									resultItemObject['userType'] = userType;
									resultItemObject['created'] = created;
									resultItemObject['updated'] = updated;
									resultItemObject['issueCommentsCount'] = issueCommentsCount;
									resultItemObject['issueBody'] = issueBody;  //RMH-HERE-99-NOW should this be stringified?
									resultsArray.push(resultItemObject);
									resultItemObject = {};  //reset the resultsObject variable
							    });

							    resultsObject.resultsArray = resultsArray;
							    console.log(logTag + "github:resolving with:" + JSON.stringify(resultsObject));

								resolve(resultsObject);
							} else {
								console.log("ERROR: no items returned");
								reject("No items to return");
							}
							//console.log('--> SEARCH BODY:' + prettyJSON(body));
							//console.log('--> SEARCH HEADER:' +JSON.stringify(header));

							
						}
					}); 
					//resolve("Your awesome!");			
				} else {
					console.log("ERROR:"+logTag+"requires searchterm and searchsite");
					reject("You suck!");
				}
			});  //end promise

			return promise;

		}  //end stub if/else check


		
	}


}
