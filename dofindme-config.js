// created by Reynold Harbin on 5/24/17
// reynold@digitalocean.com

var logTag = "dofindme-config.js:";

exports.apikeys  = {
 	prodAPIUrl: "http://api.dofind.me:1337/", //PRODUCTION
 	devAPIUrl: "http://dev-api.dofind.me:1337",  //DEVELOPEMENT
    AppId: "doFindMeAppId-XLut2v5a5z",
	ClientKey: "doFindMeMasterKey-ITlO9YRqCH",
	//github: "960d48dedbc25fd35a98c353168acd973f0749f0" //Reynold's personal access token
	github: "899d4ab9c17bcce8891c834b9956f52f391bbae9 "
}

exports.build  = {
  forProduction: true,
  forDevelopment: false
}

exports.settings = {
	stubAPI: false,
	githubMaxResults: 2
}
