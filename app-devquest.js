// created by Reynold Harbin on 5/24/17
// reynold@digitalocean.com

var _ = require('underscore');
var express = require('express');
var bodyParser = require('body-parser');
var github = require('octonode');
var prettyjson = require("prettyjson");

module.exports = {	
	prettyJSON: function (data) {
    	return prettyjson.render(data);
	}
};

var config = require('./dofindme-config.js');
var actions = require('./dofindme-actions.js');

var app = express();
app.use(bodyParser.json());

var PORT = process.env.port || 3000;

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

var logTag = "dofindme.js:";

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

const S3SEARCH_1 = 'S3 pricing';
const S3SEARCH_2 = 'S3 availability';
const S3SEARCH_3 = 'S3 outage';

const FIREWALLSEARCH_1 = 'Cloud Firewall';

var searchTermsArray=[];

//searchTermsArray.push(SEARCH_1);
//searchTermsArray.push(SEARCH_2);
//searchTermsArray.push(SEARCH_3);
searchTermsArray.push(SEARCH_4);
//searchTermsArray.push(SEARCH_5);
//searchTermsArray.push(SEARCH_6);
//searchTermsArray.push(SEARCH_7);
//searchTermsArray.push(SEARCH_8);
//searchTermsArray.push(SEARCH_9);
//searchTermsArray.push(SEARCH_10);
//searchTermsArray.push(SEARCH_11);
//searchTermsArray.push(SEARCH_12);
//searchTermsArray.push(SEARCH_13);
//searchTermsArray.push(SEARCH_14);

//searchTermsArray.push(S3SEARCH_1);
//searchTermsArray.push(S3SEARCH_2);
//searchTermsArray.push(S3SEARCH_3);

//searchTermsArray.push(FIREWALLSEARCH_1);


//start

//print header
//console.log("searchTerm,user,userLink,created,updated,pageLink,pageTitle");

/*
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

		
			//var prettyItems = module.exports.prettyJSON(itemsArray);
			//console.log('--> SEARCH RESULTS:' + prettyItems);

			//var objectOne = itemsArray[1];
			//var prettyObject = module.exports.prettyJSON(objectOne);
			//console.log('--> SEARCH RESULT ONE:' + prettyObject);

			if ( itemCount > 0 ) {
				_.each(itemsArray, function(responseItem) {

					var title = responseItem.title;
					var pageLink = responseItem.html_url;
			    	var userLogin = responseItem.user.login;
					var userLink = responseItem.user.html_url;
			    	var created = responseItem.created_at;
			    	var updated = responseItem.updated_at;
			    	var body = module.exports.prettyJSON(responseItem.body);
					console.log('body' + body);


					//console.log(searchterm + ',' + userLogin + ',' + userLink +  ',' + created + ',' + updated + ',' + pageLink + ',' + title);
			    });
			} else {
				console.log("ERROR: no items returned");
			}
			//console.log('--> SEARCH BODY:' + body);
			//console.log('--> SEARCH HEADER:' +JSON.stringify(header));
		}
	}); //array of search results
});
//end
*/

//GET

/*
// GET /search 				//NOT USED
app.get('/search', function (req, res) {
	var searchterm = req.params.searchterm;
	var searchsite = req.params.searchsite

	if (searchterm) {
		console.log('0:' + logTag+'search:with searchterm:' + searchterm );
		console.log('1:' + logTag+'search:with searchsite:' + searchsite );
		

		//set up a promise and call actions.fetchGitInfo(req)  //RMH-HERE-99-NOW


	} else {
		console.log(logTag + 'no search term provided');
	}

	//var searchTerms = req.params.terms;
	res.writeHead(200, {"Content-Type": "application/json"});
		var otherArray = ["foo1", "foo2"];
		var otherObject = { item1: "foo1val", item2: "foo2val" };
		var json = JSON.stringify({ 
			anObject: otherObject, 
			anArray: otherArray, 
			another: "anotherItem"
		});
		res.end(json);
});
//end of get seach
*/

app.get('/', function(req, res){
	//console.log(logTag+'/:with request:' + actions.prettyjson(req));
	console.log(logTag+'/:with request:' + req);

	res.writeHead(200, {"Content-Type": "application/json"});
	var otherArray = ["item1", "item2"];
	var otherObject = { item1: "item1val", item2: "item2val" };
	var json = JSON.stringify({ 
		anObject: otherObject, 
		anArray: otherArray, 
		another: "item"
	});
	res.end(json);

});

//fetchDefaultGitInfo


//POST
app.post('/search', function(req, res){

	var jsonBody = req.body;
	//console.log("000:"+logTag +'search:with jsonBody' + jsonBody);
	var jsonString = JSON.stringify(jsonBody);

	console.log(logTag +'search:with jsonBodyString' + jsonString);

	var searchterm = req.body.searchterm;
	var searchsite = req.body.searchsite;
    var request = {};

    //console.log(logTag+'search:with req.body:' + JSON.stringify(req.body) );

	if (searchterm) {
		//console.log('WED:0:' + logTag+'search:with searchterm:' + searchterm );
		request.searchterm = searchterm;
	} else {
		console.log(logTag + 'no search term provided');
		request.searchterm = 'none';
	}

	if (searchsite) {
		//console.log('WED:1:' + logTag+'search:with searchsite:' + searchsite );
		request.searchsite = searchsite;
	} else {
		console.log(logTag + 'no search site provided');
		request.searchsite = 'stub';
	}

	//set up a promise and call actions.fetchGitInfo(req)  //RMH-HERE-99-NOW-2
	if ( searchsite == "github" || searchsite == "gitHub") {
		//console.log(logTag + 'calling actions.searchGithub with request:' + JSON.stringify(request) );
		return actions.searchGitHub(request).then(function(githubResults) {

			var json = JSON.stringify(githubResults);
	        res.setHeader('Content-Type', 'application/json');
			res.writeHead(200, {"Content-Type": "application/json"});
	        //console.log (logTag + 'search:with githubResults:'+json);
			res.end(json);
	      },
	      function(error) { 
	        console.log(logTag+"ERROR calling helloWorld with request:"+JSON.stringify(request) + ": with error:"+JSON.stringify(error));
	        res.error(error); 
	    });

	} else if ( searchsite == "stackoverflow" ) {
		console.log(logTag + 'search:calling actions.helloWorld with request:' + JSON.stringify(request));
		return actions.helloWorld(request).then(function(returnedHelloWorld) {
	        console.log (logTag + "with returnedHelloWorld:"+JSON.stringify(returnedHelloWorld));
	        res.setHeader('Content-Type', 'application/json');
			res.writeHead(200, {"Content-Type": "application/json"});
			var returnObject = { "searchterm": "FOO", "searchsite": "stackoverflow" };
			var json = JSON.stringify(returnObject);
			res.end(json);
	      },
	      function(error) { 
	        console.log(logTag+"ERROR calling helloWorld with request:"+JSON.stringify(request) + ": with error:"+JSON.stringify(error));
	        res.error(error); 
	    });

	} else if ( searchsite == "stub" ) {
		var stubSearchResults = {};
		stubSearchResults.searchterm = "AWS EC2 Security Groups";
		stubSearchResults.totalResults = 2;
		stubSearchResults.resultsPerPage = 100;
		stubSearchResults.totalPages = 1;
		stubSearchResults.currentPage = 1;
		
		var stubResultsArray = [];
		var resultOneObject = {};
		var resultTwoObject = {};

		resultOneObject.title = "creating EC2 security groups seem to require description";
		resultOneObject.userLogin = "technicalpickles";
		resultOneObject.userLink = "https://github.com/technicalpickles";
		resultOneObject.pageLink = "https://github.com/fog/fog/issues/4";
		resultOneObject.created = "2010-01-23T06:42:54Z";
		resultOneObject.updated = "2010-01-23T19:31:07Z";
		resultOneObject.searchsite = "github";
		stubResultsArray.push(resultOneObject);

		resultTwoObject.title = "Rudy::Metadata::DuplicateRecord";
		resultTwoObject.userLogin = "utgarda";
		resultTwoObject.userLink = "https://github.com/utgarda";
		resultTwoObject.pageLink = "https://github.com/solutious/rudy/issues/42";
		resultTwoObject.created = "2010-05-12T13:04:37Z";
		resultTwoObject.updated = "2010-05-14T11:49:10Z";
		resultTwoObject.searchsite = "github";
		stubResultsArray.push(resultTwoObject);

		stubSearchResults.stubResultsArray = stubResultsArray;

		console.log (logTag + "search:stub:returning stubSearchResults:" +JSON.stringify(stubSearchResults));
		

        res.setHeader('Content-Type', 'application/json');
		res.writeHead(200, {"Content-Type": "application/json"});
		res.end(JSON.stringify(stubSearchResults));
	} else {
		console.log(logTag+'search:unknown searchsite:' + searchsite );
		console.log('END:no API to call...');
	}

	console.log(logTag + 'end of /search reoute');

});



app.listen(PORT, function(){
	console.log("******************************************************");
	console.log("**--> devquest app server started on port:" + PORT);
	console.log("");
});




