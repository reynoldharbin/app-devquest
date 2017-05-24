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
				stubResults['title'] = "stubTitle";
				stubResults['userLogin'] = "stubUserLogin";
				stubResults['userLink'] = "stubUserLink";
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
			console.log("GITHUB:client initated with key:" + config.apikeys.github);

			var ghsearch = client.search();
			var searchterm = request.searchterm;
			var resultsArray = [];
			var promise = new nPromise(function(resolve, reject){
				if (searchterm ) {
					//console.log(logTag+"searchGitHub:call github API for for term: " + searchterm );
					ghsearch.issues({
					  q: searchterm,
					  page: 1,
					  per_page: 1000,
					  sort: 'created',
					  order: 'asc'
					}, function(error, body, header){
						if (error){
							console.log('--> SEARCH ERROR:' +JSON.stringify(error));
							reject(logTag + "searchGitHub:You suck!");
						} else {
							var itemCount = body.total_count ;
							var itemsArray = body.items ;
							var itemsArrayCount = itemsArray.length;

							console.log("*************************************");
							console.log("  --> searchterm      : " + searchterm);
							console.log("  --> itemCount       : " + itemCount);
							console.log("  --> itemsArrayCount : " + itemsArrayCount);
							console.log("  --> resultsHeader   : " + module.exports.prettyJSON(header));
							console.log("*************************************");
							console.log("");
							//console.log("searchTerm,title,user,created,updated,userLink,pageLink");

							var resultsObject = {};

							if ( itemsArrayCount > 0 ) {
								_.each(itemsArray, function(responseItem) {
									var title = responseItem.title;
									var pageLink = responseItem.html_url;
							    	var userLogin = responseItem.user.login;
									var userLink = responseItem.user.html_url;
							    	var created = responseItem.created_at;
							    	var updated = responseItem.updated_at;
							    	//var body = module.exports.prettyJSON(responseItem.body);
									//console.log(searchterm + ',' + userLogin + ',' + userLink +  ',' + created + ',' + updated + ',' + pageLink + ',' + title);
									console.log("PROCESSING item with title:" + title);
									resultsObject['title'] = title;
									resultsObject['userLogin'] = userLogin;
									resultsObject['userLink'] = userLink;
									resultsObject['pageLink'] = pageLink;
									resultsObject['created'] = created;
									resultsObject['updated'] = updated;
									resultsObject['searchterm'] = searchterm;
									resultsObject['searchsite'] = 'github';

									//console.log("PUSHING resultsObject" + JSON.stringify(resultsObject));
									resultsArray.push(resultsObject);
									resultsObject = {};
							    });
							    console.log("DONE loading resultsArray with:" + resultsArray.length + " items!");
								resolve(resultsArray);
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
