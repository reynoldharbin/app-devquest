// created by Reynold Harbin on 5/24/17
// reynold@digitalocean.com

var logTag = "dofindme-config.js:";

exports.apikeys  = {
 	prodAPIUrl: "http://api.devquest.io:3000/", //PRODUCTION
 	devAPIUrl: "http://api.devquest.io:3000",  //DEVELOPEMENT
    AppId: "devQuestAppKey-XLut2v5a5z",
	ClientKey: "devQuestClientAppKey-ITlO9YRqCH",
	github: "0f2c67e677b5ec7dc4bfe3bbaf4735a27ad351c8"
}

exports.build  = {
  forProduction: true,
  forDevelopment: false
}

exports.settings = {
	stubAPI: false,
	githubMaxResults: 10
}
