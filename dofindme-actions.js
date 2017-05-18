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
		console.log("WINNER:in actions.helloWorld with request:" +JSON.stringify(request));

		var searchterm = request.searchterm;
		var searchsite = request.searchsite;
		
		var promise = new nPromise(function(resolve, reject){
			if (searchterm && searchsite) {
				console.log(logTag+"call API for: " + searchsite + " for term: " + searchterm );
				resolve("Your awesome!");			
			} else {
				console.log("ERROR:"+logTag+"requires searchterm and searchsite");
				reject("You suck!");
			}
		});  //end promise

		return promise;
	},

	//SS
	searchGitHub: function(request, response) {
		console.log(logTag + "searchGitHub: with request:" +JSON.stringify(request));

		// Instantiate a github client with or without a token
		var client = github.client();
		var ghsearch = client.search();
		var searchterm = request.searchterm;
		var resultsArray = [];
		var promise = new nPromise(function(resolve, reject){
			if (searchterm ) {
				console.log(logTag+"call github API for for term: " + searchterm );

				ghsearch.issues({
				  q: searchterm,
				  sort: 'created',
				  order: 'asc'
				}, function(error, body, header){
					if (error){
						console.log('--> SEARCH ERROR:' +JSON.stringify(error));
						reject("You suck!");
					} else {
						var itemCount = body.total_count ;
						var itemsArray = body.items ;
						var itemsArrayCount = itemsArray.length;

						console.log("*************************************");
						console.log("  --> searchterm.  : " + searchterm);
						console.log("  --> resultsCount : " + itemsArrayCount);
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
	},
	//EE



	//OLD STARTS HERE
	//NOT USED - call request out of server.js does not work
	fetchGitInfo: function(request) {    
		var logTag = "dofindme-actions.js:fetchGitInfo:"
		var searchTerm = request.searchTerm;

		console.log(logTag+"1:with searchTerm:"+searchTerm);

		var promise = new nPromise(function(resolve, reject){
			if (eventId && emailRecipient) {
				console.log(logTag+"2a:calling APIUrl: "+config.apikeys.sportlerAPIUrl+"/functions/fetchEventById");
				console.log(logTag+"2b:   ==> sportlerAppId: "+config.apikeys.sportlerAppId);
				console.log(logTag+"2c:   ==> sportlerClientKey: "+config.apikeys.sportlerClientKey);

				//request START
				request({
					url: config.apikeys.sportlerAPIUrl +'/functions/fetchEventById',
					// json: true,
			    	method: 'POST', //Specify the method
			    	// qs: {from: 'blog example', time: +new Date()}, //Query string data
			    	
			    	headers: { //Specify headers 
			    		'Content-Type': 'application/json',
				        'X-Parse-Application-Id': config.apikeys.sportlerAppId,
				        'X-Parse-REST-API-Key': config.apikeys.sportlerClientKey
				    	},
				    // body: '{"eventObjectId":"ktoQPMQUGw"}' //Set the body as a string //working
				    body: '{"eventObjectId": "'+eventId+'"}' //Set the body as a string

				}, function(error, response, body){
					resolve("WTF");
					/*
					if (error){
						console.log("FUCK:"+logTag+"Unable to fetch event.");
						reject("you suck with error:"+JSON.stringify(error));
					} else {
						var result = JSON.parse(body).result;
						if (result.objectId) {
							console.log("FUCK YEA:"+logTag+"returning result: "+JSON.stringify(result));
							resolve(result);
						}else {
							console.log("ERROR:"+logTag+"Could not fetch result.objectId!");
							reject("you suck with no result.objectId, but result:"+JSON.stringify(result));
						};
					}
					*/
				})
				//request END
			
			} else {
				console.log("ERROR:"+logTag+"6:requires eventId and emailRecipient to use fetchEventInfo");
				reject("requires eventId and emailRecipient to use fetchEventInfo");
			}
		});  //end promise

		return promise;
	}, //end fetchEventInfo

	fetchDefaultGitInfo: function(request) {    
		var logTag = "dofindme-actions.js:fetchDefaultGitInfo:"
	
		console.log(logTag+"1:with request:"+request);

		var promise = new nPromise(function(resolve, reject){
			
			//ss
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

			//ee




		});  //end promise

		return promise;
	} //end fetchEventInfo



}
