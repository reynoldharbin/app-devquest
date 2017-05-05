	//set up sharedListRequestParams 
			    		var sharedListRequestParams = {};
			    		var sharedPlayerListIdsArray = [];
			    		sharedPlayerListIdsArray.push(requestParams.listObjectId);
			    		sharedListRequestParams.email = sharedListPlayerEmail; 
			    		sharedListRequestParams.sharedPlayerListIdsArray = sharedPlayerListIdsArray; 
			    		//console.log(logTag+"calling createSharedPlayerListsObject with sharedListRequestParams:"+JSON.stringify(sharedListRequestParams));
						
			    		//BLOCK START
			    		promisesMade++;  //createSharedPlayerListsObject
			    		//promiseMadeString = promiseMadeString + ", create";
					    actions.createSharedPlayerListsObject(sharedListRequestParams).then(function(createSharedPlayerListsResults) { //createSharedPlayerListsObject START
			              if (!createSharedPlayerListsResults || createSharedPlayerListsResults.length == 0) {
			                console.log("ERROR:"+logTag+"creating sharedList using sharedListRequestParams:"+JSON.stringify(sharedListRequestParams));
			                promisesCompleted++;  //createSharedPlayerListsObject error
			                //promisesCompletedString = promisesCompletedString + ", create";

					       	if (promisesMade == promisesCompleted){
							  //console.log("DONE:6:"+logTag+"promisesMade matches promisesCompleted:"+promisesCompleted+", resovling");
							  masterPromise.reject("error");
						    };
			              } else {
			                //console.log(logTag+"successful creating sharedList for "+sharedListRequestParams.email+", playerUpdatedToSharedListPromise.resolving");
			                promisesCompleted++;  //createSharedPlayerListsObject successful
			                //promisesCompletedString = promisesCompletedString + ", create";

			                if (promisesMade == promisesCompleted){
							  //console.log("DONE:7:"+logTag+"promisesMade matches promisesCompleted:"+promisesCompleted+", resovling");
							  masterPromise.resolve("success");
						    };

			              }
			            }, function(error) {
			                console.log("ERROR:"+logTag+"creating sharedList: with error:"+JSON.stringify(error));
			                promisesCompleted++;  //createSharedPlayerListsObject error
			                //promisesCompletedString = promisesCompletedString + ", create";

			                if (promisesMade == promisesCompleted){
							  //console.log("DONE:8:"+logTag+"promisesMade matches promisesCompleted:"+promisesCompleted+", resovling");
							  masterPromise.reject("error");
						    };
			          	}) //createSharedPlayerListsObject List END
					    //BLOCK END
			    	}
			    }, function(error) { //ERROR processing START
	                console.log("ERROR:"+logTag+"fetching sharedList: with error:"+JSON.stringify(error));
	                promisesCompleted++; //fetchSharedPlayerListsObject error
	                //promisesCompletedString = promisesCompletedString + ", fetch";

	                if (promisesMade == promisesCompleted){
					  //console.log("DONE:9:"+logTag+"promisesMade matches promisesCompleted:"+promisesCompleted+", resovling");
					  masterPromise.reject("error");
				    };
	          	} //ERROR processing END

			    );
			}); //end sharedPlayerListPlayers
			//end
		} else {
			console.log(logTag+"ERROR.  Must send in a valid listOwnerEmail, sharedPlayerListPlayers, and listObjectId to call addSharedPlayerListToPlayers");
			console.log("ERROR:"+logTag+"with requestParams.listOwnerEmail:"+requestParams.listOwnerEmail);
			console.log("ERROR:"+logTag+"with sharedPlayerListPlayers:"+sharedPlayerListPlayers);
			console.log("ERROR:"+logTag+"with requestParams.listObjectId:"+requestParams.listObjectId);
			masterPromise.reject(logTag+"ERROR.  Must send in a valid listOwnerEmail, sharedPlayerListPlayers, and listObjectId to call addSharedPlayerListToPlayers");
		};
		
		return masterPromise;
		//return Parse.Promise.when(playersUpdatedWithSharedPlayerListPromises);
	
	}, // end addSharedPlayerListToPlayers

	removeSharedPlayerListToPlayers: function(request) {  
		var logTag = "validate.js:removeSharedPlayerListToPlayers:";
		//console.log(logTag+"entered... with request:"+JSON.stringify(request));
		//console.log(logTag+"entered...");

		var promisesMade = 0;
		var promisesCompleted = 0;
		var masterPromise = new Parse.Promise();
		var requestParams = {};
    	playersToDeleteFromList = request.playersToDeleteFromList;
    	requestParams.listObjectId = request.listObjectId;

		if (playersToDeleteFromList && requestParams.listObjectId) {
			//start
			_.each(playersToDeleteFromList, function(playerEmailToDeleteFromSharedList){
				console.log(logTag+"processing playerEmailToDeleteFromSharedList :"+playerEmailToDeleteFromSharedList);

				//STEP 1. look up players sharedPlayerListsObject 
				var requestParamToFetchSharedPlayerList = {};
				requestParamToFetchSharedPlayerList.email = playerEmailToDeleteFromSharedList;

				promisesMade++;  //fetchSharedPlayerListsObject
				//promiseMadeString = promiseMadeString + ", fetch"

				actions.fetchSharedPlayerListsObject(requestParamToFetchSharedPlayerList).then(function(returnedSharedPlayerListObjectArray){
					//console.log(logTag+"with returnedSharedPlayerListObjectArray:"+JSON.stringify(returnedSharedPlayerListObjectArray));			    	
			    	promisesCompleted++; //fetchSharedPlayerListsObject
			    	//promisesCompletedString = promisesCompletedString + ", fetch"

					if (promisesMade == promisesCompleted){
					  //console.log(logTag+"promisesMade matches promisesCompleted:"+promisesCompleted+", resovling");
					  masterPromise.resolve("success");
					};

			    	if (returnedSharedPlayerListObjectArray && returnedSharedPlayerListObjectArray.length > 0 ) {
			    		
			    		if ( returnedSharedPlayerListObjectArray.length > 1 ){
				    		console.log(logTag+requestParams.listOwnerEmail+" with: "+returnedSharedPlayerListObjectArray.length+ " shared lists to consolidate.");
			    		};

			    		firstReturnedSharedPlayerListObject = returnedSharedPlayerListObjectArray[0];
			    		var sharedListObjectId = firstReturnedSharedPlayerListObject.id;
			    		var listOwnerEmail = firstReturnedSharedPlayerListObject.get("listOwnerEmail");
			    		var updatedSharedPlayerListIdsArray = firstReturnedSharedPlayerListObject.get("sharedPlayerListIdsArray");			    		
			    		var sharedListsToDeleteArray = [];
			    		if (returnedSharedPlayerListObjectArray.length > 1) {  //build up the sharedListsToDelete, updatedSharedPlayerListIdsArray
			    			console.log(logTag+"consolidating "+returnedSharedPlayerListObjectArray.length+" sharedLists");
			    			_.each(returnedSharedPlayerListObjectArray, function(sharedListObject){
			    				//console.log(logTag+"processing "+JSON.stringify(sharedListObject));
			    				//get the objectId 
								var myString = JSON.stringify(sharedListObject);
								var myListObject = JSON.parse(myString);
								var listObjectId = myListObject.objectId;  //requestParams.objectId
			    				//console.log(logTag+"with listObjectId:"+listObjectId+" and sharedListObjectId:"+sharedListObjectId);
			    				if (listObjectId != sharedListObjectId ) {
			    					//console.log(logTag+"listObjectId:"+listObjectId+" is a duplicate of sharedListObjectId:"+sharedListObjectId+", adding objectsIds");
			    					var playerListIdsArray = sharedListObject.get("sharedPlayerListIdsArray");
			    					for (i = 0; i < playerListIdsArray.length; i++) { 
									    var playerListObjectId = playerListIdsArray[i];
									    //console.log(logTag+"adding playerListObjectId:"+playerListObjectId+" to updatedSharedPlayerListIdsArray");
									    updatedSharedPlayerListIdsArray.push(playerListObjectId);
									};
			    					sharedListsToDeleteArray.push(listObjectId);
			    					//console.log(logTag+"adding listObjectId:"+listObjectId+" to sharedListsToDeleteArray");
			    				} else {
			    					//console.log(logTag+"listObjectId MATCHES sharedListObjectId, already in firstReturnedSharedPlayerListObject");
			    				}
			    			});
			    		} 

			    		//create a unique version of updatedSharedPlayerListIdsArray 
			    		var uniqueSharedPlayerListIdsArray = actions.arrayUnique(updatedSharedPlayerListIdsArray);  //should already be unique, but clean up if needed
			    		//console.log("BEFORE:SPLICE:"+logTag+"with uniqueSharedPlayerListIdsArray:"+uniqueSharedPlayerListIdsArray);

			    		//splice out requestParams.listObjectId from uniqueSharedPlayerListIdsArray;  
			    		for (var i=uniqueSharedPlayerListIdsArray.length-1; i>=0; i--) {
				        	if (uniqueSharedPlayerListIdsArray[i] === requestParams.listObjectId) { 
				                uniqueSharedPlayerListIdsArray.splice(i, 1);
				                break;       //<-- break once found 
				            }
				        };

				        //console.log("AFTER:SPLICE:"+logTag+"with uniqueSharedPlayerListIdsArray:"+uniqueSharedPlayerListIdsArray);

			    		//set up updateSharedListRequestParams 
			    		var updateSharedListRequestParams = {};
			    		updateSharedListRequestParams.objectId = sharedListObjectId; 
			    		updateSharedListRequestParams.listOwnerEmail = listOwnerEmail; 
			    		updateSharedListRequestParams.sharedPlayerListIdsArray = uniqueSharedPlayerListIdsArray; 

			    		//console.log(logTag+"calling updateSharedPlayerListsObject with:"+JSON.stringify(updateSharedListRequestParams));
			    		//BLOCK START
						promisesMade++; //updateSharedPlayerListsObject
						//promiseMadeString = promiseMadeString + ", update";
					    actions.updateSharedPlayerListsObject(updateSharedListRequestParams).then(function(updateSharedPlayerListsResults) { //updateSharedPlayerListsObject 
							//console.log(""+logTag+"with updateSharedPlayerListsResults:"+JSON.stringify(updateSharedPlayerListsResults));
							promisesCompleted++; //updateSharedPlayerListsObject
							//promisesCompletedString = promisesCompletedString + ", update";

							if (!updateSharedPlayerListsResults || updateSharedPlayerListsResults.length == 0) {
								console.log("ERROR:"+logTag+"updating sharedList using updatedSharedPlayerListObject:"+JSON.stringify(updatedSharedPlayerListObject));
								if (promisesMade == promisesCompleted){
					    		  //console.log("DONE:1:"+logTag+"promisesMade matches promisesCompleted:"+promisesCompleted+", resovling");
					    		  masterPromise.reject("error");
					    	    };
							} else {
								if (sharedListsToDeleteArray.length > 0) {
									//CLEAN START
								    var deleteSharedListsRequestParams = {};
									deleteSharedListsRequestParams.listOwnerEmail = listOwnerEmail;
									deleteSharedListsRequestParams.sharedListsToDeleteArray = sharedListsToDeleteArray;

									promisesMade++; //deleteSharedPlayerListsObjects
									//promiseMadeString = promiseMadeString + ", delete";
								    actions.deleteSharedPlayerListsObjects(deleteSharedListsRequestParams).then(function(deleteSharedPlayerListsResults) { //deleteSharedPlayerListsObjects 
								      if (!deleteSharedPlayerListsResults || deleteSharedPlayerListsResults.length == 0) {
								        console.log("ERROR:"+logTag+"deleting sharedLists using deleteSharedListsRequestParams:"+JSON.stringify(deleteSharedListsRequestParams));
								      } else {
								        console.log(logTag+"successful deleted duplicate sharedLists for:"+deleteSharedListsRequestParams.listOwnerEmail);
								      };

								      if (promisesMade == promisesCompleted){
										  //console.log("DONE:2:"+logTag+"promisesMade matches promisesCompleted:"+promisesCompleted+", resovling");
										  masterPromise.resolve("success");
									  };

								    }, function(error) {
								        console.log("ERROR:"+logTag+"deleting sharedLists: with error:"+JSON.stringify(error));
								       	promisesCompleted++; //deleteSharedPlayerListsObjects error
								       	//promisesCompletedString = promisesCompletedString + ", delete"

								       	if (promisesMade == promisesCompleted){
										  //console.log("DONE:3:"+logTag+"promisesMade matches promisesCompleted:"+promisesCompleted+", resovling");
										  masterPromise.reject("error");
									    };
								  	}) //deleteSharedPlayerListsObjects List END
								    //CLEAN END
								} else {
									//console.log(logTag+"successful updating sharedList, no duplicates");
									if (promisesMade == promisesCompleted){
										  //console.log("DONE:4:"+logTag+"promisesMade matches promisesCompleted:"+promisesCompleted+", resovling");
										  masterPromise.resolve("success");
									};
								}
			              	}
			            }, function(error) {
			                console.log("ERROR:"+logTag+"updating sharedList: with error:"+JSON.stringify(error));
			                promisesCompleted++; //updateSharedPlayerListsObject error
			                //promisesCompletedString = promisesCompletedString + ", update";

					       	if (promisesMade == promisesCompleted){
							  //console.log("DONE:5:"+logTag+"promisesMade matches promisesCompleted:"+promisesCompleted+", resovling");
							  masterPromise.reject("error");
						    };
			          	}) //updateSharedPlayerListsObject List END
					    //BLOCK END
			    	} else {
			    		//console.log(logTag+"returnedSharedPlayerListObjectArray is nil or has no objects");
			    	}
			    }, function(error) { //ERROR processing START
	                console.log("ERROR:"+logTag+"fetching sharedList: with error:"+JSON.stringify(error));
	                promisesCompleted++; //fetchSharedPlayerListsObject error
	                //promisesCompletedString = promisesCompletedString + ", fetch";

	                if (promisesMade == promisesCompleted){
					  //console.log("DONE:9:"+logTag+"promisesMade matches promisesCompleted:"+promisesCompleted+", resovling");
					  masterPromise.reject("error");
				    };
	          	} //ERROR processing END

			    );
			}); //end sharedPlayerListPlayers
			//end
		} else {
			console.log(logTag+"ERROR.  Must send in a valid playersToDeleteFromList and listObjectId to call removeSharedPlayerListToPlayers");
			console.log("ERROR:"+logTag+"with playersToDeleteFromList:"+playersToDeleteFromList);
			console.log("ERROR:"+logTag+"with requestParams.listObjectId:"+requestParams.listObjectId);
			masterPromise.reject(logTag+"ERROR.  Must send in a valid playersToDeleteFromList and listObjectId to call removeSharedPlayerListToPlayers");
		};
		return masterPromise;
		//return Parse.Promise.when(playersUpdatedWithSharedPlayerListPromises);
	
	}, // end removeSharedPlayerListToPlayers


	//NOTIFICATIONS
	notifyPlayersOfNewEvent: function(requestParams) {   //notify invitedPlayers (separate function to notify confiremed players)
		var logTag = "validate.js:notifyPlayersOfNewEvent:"
		//console.log(logTag+"entered... with requestParams:"+JSON.stringify(requestParams));
		var eventInvitedPlayers = requestParams.get("eventInvitedPlayers");
		var playersNotificationPromises = [];
		var eventOrganizerEmail = requestParams.get("eventOrganizerEmail");
		var eventOrganizerFullName = requestParams.get("eventOrganizerFullName");
		var eventName = requestParams.get("eventName");
		var eventStartDate = requestParams.get("eventStartDateAsDate");
		var eventStartDateAsDisplayed = requestParams.get("eventStartDateAsDisplayed");
		var eventStartDateAsDateWithTimeZone = requestParams.get("eventStartDateAsDateWithTimeZone");

		//get the objectId 
		var myString = JSON.stringify(requestParams);
		var myObject = JSON.parse(myString);
		var eObjectId = myObject.objectId;  //requestParams.objectId

		_.each(eventInvitedPlayers, function(invitedPlayerEmail){
			//console.log(logTag+"processing invitedPlayerEmail :"+invitedPlayerEmail);
			var playerNotifiedPromise = new Parse.Promise();
			playersNotificationPromises.push(playerNotifiedPromise);

			//STEP 1. look up user settings for push notifications 
			var requestParamToFetchUser = {};
			requestParamToFetchUser.email = invitedPlayerEmail;
			actions.fetchUser(requestParamToFetchUser).then(function(returnedUserArray){
		    	if (returnedUserArray.length == 0) {
		    		console.log("ERROR:"+logTag+"fetching user settings for:"+invitedPlayerEmail);
		            playerNotifiedPromise.resolve("ERROR:"+logTag+"fetching user settings for:"+invitedPlayerEmail);
		    	} else {
		    		var returnedUser = returnedUserArray[0];
		    		var pushNotifyEnabled = returnedUser.get("pushNotifyEnabled");
		    		var pushNotifyOnRSVP = returnedUser.get("pushNotifyOnRSVP");
		    		var installationId = returnedUser.get("installationId");
		    		var userIsLoggedIn = returnedUser.get("userIsLoggedIn");

		    		//STEP 2.  if pushNotifyEnabled, call push  
		    		if (pushNotifyEnabled == true && userIsLoggedIn == true) {
		    			//console.log(logTag+"PUSH notifying:"+invitedPlayerEmail+" of new event");
			      		//format date and time for use in the messageAlert
			      		var dateToStringFormat = 'dddd, MMM Do';
				      	var dateString = moment(eventStartDate).format(dateToStringFormat);

				      	//DEPRECATED format in eventStartDateAsDateWithTimeZone (not ISO)
				      	//var timeToStringFormat = 'h:mm a z';
				      	//var timeString = moment(eventStartDateAsDateWithTimeZone).format(timeToStringFormat);  
				      	//var timeStringTrimmed = timeString.trim();

			      		var sendPushParams = {};

			  			if (pushNotifyOnRSVP) {
				  			sendPushParams.pushNotifyOnRSVP = pushNotifyOnRSVP;
				  		} else {
				  			sendPushParams.pushNotifyOnRSVP = false;
				  		}
				  		if (installationId) {
				  			sendPushParams.installationId = installationId;
				  		} 
			      		sendPushParams.deviceType = "ios";  //should be dynamic based on users User model
			      		sendPushParams.eventObjectId = eObjectId;
			      		sendPushParams.organizerEmail = eventOrganizerEmail;
			      		sendPushParams.inviteeEmail = invitedPlayerEmail;
			      		sendPushParams.pushCategory = "InviteCategory";  //options are: InviteCategory, RsvpEventCategory, EventCancelledCategory
			      		sendPushParams.messageTitle = "Sportler";
			      		sendPushParams.messageSubTitle = "Event Invitation";
			      		sendPushParams.messageAlert = eventOrganizerFullName+" invites you to "+eventName+" on "+eventStartDateAsDisplayed+". Can you get out and play?";
			      		//console.log(logTag+"set messageAlert:"+sendPushParams.messageAlert);
				  		return push.sendPushNotification(sendPushParams).then(function(sendPushResults){  
				      		//console.log("PUSH:WIN:"+logTag+"sendPushResults:"+JSON.stringify(sendPushResults));
				      		playerNotifiedPromise.resolve(sendPushResults); 
				      	},
				      		function(error) {
				      		console.log("ERROR:"+logTag+"sendPushResults failed with error:"+JSON.stringify(error));
				      		playerNotifiedPromise.resolve(error); 
				      	});
		    		} else {
		    			//STEP 3 - call emailer
		    			//console.log(logTag+"EMAIL notifying:"+invitedPlayerEmail+" of new event");		    			
		    			var requestParamsString = JSON.stringify(requestParams)
		    			var sendEmailParams = JSON.parse(requestParamsString)
				  		var invitePlayerEmailArray = [];
				  		invitePlayerEmailArray.push(invitedPlayerEmail)
				  		sendEmailParams.eventInvitedPlayersToEmail = invitePlayerEmailArray;  

				  		//console.log(logTag+"calling emailPlayersOfNewEvent with sendEmailParams:"+JSON.stringify(sendEmailParams));	
				  		return emailer.emailPlayersOfNewEvent(sendEmailParams).then(function(sendEmailResults){ 
				      		//console.log("EMAIL:WIN:"+logTag+"sendEmailResults:"+JSON.stringify(sendEmailResults));
				      		playerNotifiedPromise.resolve(sendEmailResults); 
				      	},
				      		function(error) {
				      		console.log("ERROR:"+logTag+"sendEmailResults failed with error:"+JSON.stringify(error));
				      		playerNotifiedPromise.resolve(error); 
				      	});
		    		};
		    	}
		    });
		}); //end eventInvitedPlayers
		return Parse.Promise.when(playersNotificationPromises);
	}, //end notifyPlayersOfNewEvent

	notifyConfirmedPlayersOfNewEvent: function(requestParams) {     
		var logTag = "validate.js:notifyConfirmedPlayersOfNewEvent:"
		//console.log(logTag+"entered... with requestParams:"+JSON.stringify(requestParams));
		var eventConfirmedPlayers = requestParams.get("eventConfirmedPlayers");
		var playersNotificationPromises = [];
		var eventOrganizerEmail = requestParams.get("eventOrganizerEmail");
		var eventOrganizerFullName = requestParams.get("eventOrganizerFullName");
		var eventName = requestParams.get("eventName");
		var eventStartDate = requestParams.get("eventStartDateAsDate");
		var eventStartDateAsDisplayed = requestParams.get("eventStartDateAsDisplayed");
		var eventStartDateAsDateWithTimeZone = requestParams.get("eventStartDateAsDateWithTimeZone");

		//get the objectId 
		var myString = JSON.stringify(requestParams);
		var myObject = JSON.parse(myString);
		var eObjectId = myObject.objectId;  //requestParams.objectId

		_.each(eventConfirmedPlayers, function(confirmedPlayerEmail){
			//check that organizerEmail is not confirmedPlayerEmail
			if (eventOrganizerEmail == confirmedPlayerEmail) {
				//console.log(logTag+"Not sending notification of new event to the organizer"); 
			} else {
				var playerNotifiedPromise = new Parse.Promise();
				playersNotificationPromises.push(playerNotifiedPromise);
				//STEP 1. look up user settings for push notifications 
				var requestParamToFetchUser = {};
				requestParamToFetchUser.email = confirmedPlayerEmail;
				actions.fetchUser(requestParamToFetchUser).then(function(returnedUserArray){
			    	if (returnedUserArray.length == 0) {
			    		console.log("ERROR:"+logTag+"fetching user settings for:"+confirmedPlayerEmail);
			            playerNotifiedPromise.resolve("ERROR:"+logTag+"fetching user settings for:"+confirmedPlayerEmail);
			    	} else {
			    		var returnedUser = returnedUserArray[0];
			    		var pushNotifyEnabled = returnedUser.get("pushNotifyEnabled");
			    		var pushNotifyOnRSVP = returnedUser.get("pushNotifyOnRSVP");
			    		var installationId = returnedUser.get("installationId");
		    			var userIsLoggedIn = returnedUser.get("userIsLoggedIn");

			    		//STEP 2.  if pushNotifyEnabled, call push  
			    		if (pushNotifyEnabled == true && userIsLoggedIn == true ) {
			    			console.log(logTag+"PUSH notifying:"+confirmedPlayerEmail+" of auto-confirmation for new event");
			    			
				      		//format date and time for use in the messageAlert
				      		var dateToStringFormat = 'dddd, MMM Do';
					      	var dateString = moment(eventStartDate).format(dateToStringFormat);

				      		//DEPRECATED format in eventStartDateAsDateWithTimeZone (not ISO)
				      		//var timeToStringFormat = 'h:mm a z';
				      		//var timeString = moment(eventStartDateAsDateWithTimeZone).format(timeToStringFormat);  
				      		//var timeStringTrimmed = timeString.trim();				      		

				      		var sendPushParams = {};

				  			if (pushNotifyOnRSVP) {
					  			sendPushParams.pushNotifyOnRSVP = pushNotifyOnRSVP;
					  		} else {
					  			sendPushParams.pushNotifyOnRSVP = false;
					  		}
					  		if (installationId) {
					  			sendPushParams.installationId = installationId;
					  		} 
				      		sendPushParams.deviceType = "ios";  //should be dynamic based on users User model
				      		sendPushParams.eventObjectId = eObjectId;
				      		sendPushParams.organizerEmail = eventOrganizerEmail;
				      		sendPushParams.inviteeEmail = confirmedPlayerEmail;
				      		sendPushParams.pushCategory = "InviteCategory";  //options are: InviteCategory, RsvpEventCategory, EventCancelledCategory
				      		sendPushParams.messageTitle = "Sportler";
				      		sendPushParams.messageSubTitle = "Event Invitation";
				      		sendPushParams.messageAlert = eventOrganizerFullName+" confirmed you for "+eventName+" on "+eventStartDateAsDisplayed;

					  		return push.sendPushNotification(sendPushParams).then(function(sendPushResults){  
					      		//console.log("PUSH:WIN:"+logTag+"sendPushResults:"+JSON.stringify(sendPushResults));
					      		playerNotifiedPromise.resolve(sendPushResults); 
					      	},
					      		function(error) {
					      		console.log("ERROR:"+logTag+"sendPushResults failed with error:"+JSON.stringify(error));
					      		playerNotifiedPromise.resolve(error); 
					      	});
			    		} else {
			    			//STEP 3 - call emailer
			    			console.log(logTag+"EMAIL notifying:"+confirmedPlayerEmail+" of auto-confirmed new event");		    			
			    			var requestParamsString = JSON.stringify(requestParams)
			    			var sendEmailParams = JSON.parse(requestParamsString)
					  		var confirmedPlayerEmailArray = [];
					  		confirmedPlayerEmailArray.push(confirmedPlayerEmail)
					  		sendEmailParams.eventConfirmedPlayersToEmail = confirmedPlayerEmailArray;  
					  		//console.log(logTag+"calling emailPlayersOfNewEvent with sendEmailParams:"+JSON.stringify(sendEmailParams));	
					  		return emailer.emailPlayersOfNewEvent(sendEmailParams).then(function(sendEmailResults){ 
					      		//console.log("EMAIL:WIN:"+logTag+"sendEmailResults:"+JSON.stringify(sendEmailResults));
					      		playerNotifiedPromise.resolve(sendEmailResults); 
					      	},
					      		function(error) {
					      		console.log("ERROR:"+logTag+"sendEmailResults failed with error:"+JSON.stringify(error));
					      		playerNotifiedPromise.resolve(error); 
					      	});
			    		};
			    	}
			    });
			};
		}); //end eventConfirmedPlayers
		return Parse.Promise.when(playersNotificationPromises);
	}, //end notifyConfirmedPlayersOfNewEvent

	notifyWaitingListPlayersOfOpenedEvent: function(requestParams) {   //notify invitedPlayers (separate function to notify confiremed players)
		var logTag = "validate.js:notifyWaitingListPlayersOfOpenedEvent:"
		//console.log(logTag+"entered... with requestParams:"+JSON.stringify(requestParams));

		var eventStatus = requestParams.get("eventStatus");  
		var eventWaitingListPlayers = requestParams.get("eventWaitingListPlayers");
		var notifyWaitingListBool = requestParams.get("notifyWaitingListBool");
		var playersNotificationPromises = [];
		if (eventStatus == "Open" && eventWaitingListPlayers.length > 0 && notifyWaitingListBool == true) { 
			console.log(logTag+"eventStatus is open and eventWaitingListPlayers has:"+eventWaitingListPlayers.length+" players!");
			var eventOrganizerEmail = requestParams.get("eventOrganizerEmail");
			var eventOrganizerFullName = requestParams.get("eventOrganizerFullName");
			var eventName = requestParams.get("eventName");
			var eventStartDate = requestParams.get("eventStartDateAsDate");
			var eventStartDateAsDisplayed = requestParams.get("eventStartDateAsDisplayed");
			var eventStartDateAsDateWithTimeZone = requestParams.get("eventStartDateAsDateWithTimeZone");
			//get the objectId 
			var myString = JSON.stringify(requestParams);
			var myObject = JSON.parse(myString);
			var eObjectId = myObject.objectId;  //requestParams.objectId

			_.each(eventWaitingListPlayers, function(waitingListPlayerEmail){
				console.log(logTag+"processing waitingListPlayerEmail :"+waitingListPlayerEmail);
				var playerNotifiedPromise = new Parse.Promise();
				playersNotificationPromises.push(playerNotifiedPromise);

				//STEP 1. look up user settings for push notifications 
				var requestParamToFetchUser = {};
				requestParamToFetchUser.email = waitingListPlayerEmail;
				actions.fetchUser(requestParamToFetchUser).then(function(returnedUserArray){
			    	if (returnedUserArray.length == 0) {
			    		console.log("ERROR:"+logTag+"fetching user settings for:"+waitingListPlayerEmail);
			            playerNotifiedPromise.resolve("ERROR:"+logTag+"fetching user settings for:"+waitingListPlayerEmail);
			    	} else {
			    		var returnedUser = returnedUserArray[0];
			    		var pushNotifyEnabled = returnedUser.get("pushNotifyEnabled");
			    		var pushNotifyOnRSVP = returnedUser.get("pushNotifyOnRSVP");
			    		var installationId = returnedUser.get("installationId");
		    			var userIsLoggedIn = returnedUser.get("userIsLoggedIn");

			    		//STEP 2.  if pushNotifyEnabled, call push  
			    		if (pushNotifyEnabled == true && userIsLoggedIn == true ) {
			    			console.log(logTag+"PUSH notifying waitlist player:"+waitingListPlayerEmail+" of open event");
				      		//format date and time for use in the messageAlert
				      		var dateToStringFormat = 'dddd, MMM Do';
					      	var dateString = moment(eventStartDate).format(dateToStringFormat);
				      		var sendPushParams = {};

				  			if (pushNotifyOnRSVP) {
					  			sendPushParams.pushNotifyOnRSVP = pushNotifyOnRSVP;
					  		} else {
					  			sendPushParams.pushNotifyOnRSVP = false;
					  		}
					  		if (installationId) {
					  			sendPushParams.installationId = installationId;
					  		} 
				      		sendPushParams.deviceType = "ios";  //should be dynamic based on users User model
				      		sendPushParams.eventObjectId = eObjectId;
				      		sendPushParams.organizerEmail = eventOrganizerEmail;
				      		sendPushParams.inviteeEmail = waitingListPlayerEmail;
				      		sendPushParams.pushCategory = "InviteCategory";  //options are: InviteCategory, RsvpEventCategory, EventCancelledCategory
				      		sendPushParams.messageTitle = "Sportler";
				      		sendPushParams.messageSubTitle = "Event Invitation";
				      		sendPushParams.messageAlert = eventOrganizerFullName+"'s '"+eventName+"' event has been reopened and is scheduled for "+eventStartDateAsDisplayed+". Can you get out and play?";

				      		//console.log(logTag+"set messageAlert:"+sendPushParams.messageAlert);
					  		return push.sendPushNotification(sendPushParams).then(function(sendPushResults){  
					      		//console.log("PUSH:WIN:"+logTag+"sendPushResults:"+JSON.stringify(sendPushResults));
					      		playerNotifiedPromise.resolve(sendPushResults); 
					      	},
					      		function(error) {
					      		console.log("ERROR:"+logTag+"sendPushResults failed with error:"+JSON.stringify(error));
					      		playerNotifiedPromise.resolve(error); 
					      	});
			    		} else {
			    			//STEP 3 - call emailer
			    			console.log(logTag+"EMAIL notifying waitlist player:"+waitingListPlayerEmail+" of open event");		    			
			    			var requestParamsString = JSON.stringify(requestParams)
			    			var sendEmailParams = JSON.parse(requestParamsString)
					  		var waitingListInvitePlayerEmailArray = [];
					  		waitingListInvitePlayerEmailArray.push(waitingListPlayerEmail)
					  		sendEmailParams.eventWaitingListPlayersToEmail = waitingListInvitePlayerEmailArray;  

					  		//console.log(logTag+"calling emailWaitingListPlayersOfOpenedEvent with sendEmailParams:"+JSON.stringify(sendEmailParams));	
					  		return emailer.emailWaitingListPlayersOfOpenedEvent(sendEmailParams).then(function(sendEmailResults){   
					      		//console.log("EMAIL:WIN:"+logTag+"sendEmailResults:"+JSON.stringify(sendEmailResults));
					      		playerNotifiedPromise.resolve(sendEmailResults); 
					      	},
					      		function(error) {
					      		console.log("ERROR:"+logTag+"sendEmailResults failed with error:"+JSON.stringify(error));
					      		playerNotifiedPromise.resolve(error); 
					      	});
			    		};
			    	}
			    });
			}); //end eventWaitingListPlayers
		} else {
			console.log(logTag+"Not processing notifications of the waitlist.  eventStatus:"+eventStatus+", eventWaitingListPlayers count:"+eventWaitingListPlayers.length);
		}
		return Parse.Promise.when(playersNotificationPromises);
	}, //end notifyWaitingListPlayersOfOpenedEvent

	notifyPlayersOfRSVPStatus: function(requestParams) {  //only available for users who enabled push notifications
		var logTag = "validate.js:notifyPlayersOfRSVPStatus:"
		//console.log(logTag+"entered... with requestParams:"+JSON.stringify(requestParams));

		var playersNotificationPromises = [];
		var validRSVPPlayerPromise = new Parse.Promise();
		playersNotificationPromises.push(validRSVPPlayerPromise);

		var eventDecision = requestParams.eventDecision;
		var rsvpPlayerEmail = requestParams.email;
		var eventObjectId = requestParams.eventObjectId;
		var eventBeingProcessed = requestParams.eventBeingProcessed;
		var eventName = eventBeingProcessed.get("eventName");  //check formatting
		var eventStartDate = eventBeingProcessed.get("eventStartDateAsDate");
		var eventStartDateAsDisplayed = eventBeingProcessed.get("eventStartDateAsDisplayed");
		var eventConfirmedPlayers = eventBeingProcessed.get("eventConfirmedPlayers");  //check formatting
		var eventDeclinedPlayers = eventBeingProcessed.get("eventDeclinedPlayers");  //check formatting
		var eventInvitedPlayers = eventBeingProcessed.get("eventInvitedPlayers");  //check formatting
		var eventStatus = eventBeingProcessed.get("eventStatus");  //check formatting
		var notifyPlayersBool = requestParams.notifyPlayersBool;
		//console.log(logTag+"with notifyPlayersBool:"+notifyPlayersBool);

		var sendPushNotificationBool = false;
		var rsvpPlayerEmailIsConfirmed = false;
		var rsvpPlayerEmailIsDeclined = false;

		if (notifyPlayersBool == false ) {
			console.log("NOTIFY:SKIP:"+logTag+"notifyPlayersBool is false, not notifying");
		} else if (eventDecision == "Confirmed" || eventDecision == "confirmed" ) { 
			console.log("NOTIFY:CONFIRM:"+logTag+"confirmed and notifyPlayersBool is:"+notifyPlayersBool);
			var confirmedIndex = eventConfirmedPlayers.indexOf(rsvpPlayerEmail);
	        if (confirmedIndex > -1) { //found user in confirmed list
			    rsvpPlayerEmailIsConfirmed = true;	
			    sendPushNotificationBool = true;
	        };
		} else if (eventDecision == "Declined" || eventDecision == "declined" ) { 
			console.log("NOTIFY:DECLINE:"+logTag+"declined and notifyPlayersBool is:"+notifyPlayersBool);
			var declinedIndex = eventDeclinedPlayers.indexOf(rsvpPlayerEmail);
	        if (declinedIndex > -1) { //found user in confirmed list
			    rsvpPlayerEmailIsDeclined = true;	
			    sendPushNotificationBool = true;
	        };
		} else {
			console.log("WARNING:"+logTag+"player is neither in eventConfirmedPlayers, or eventDeclinedPlayers.  Not sending push notification to other players");
		}

		//STEP 1: Look up the player of requestParams.email, set firstName, lastName, fullName  
		if (rsvpPlayerEmail && sendPushNotificationBool) {
			//set up requestParams
			var fetchPlayerParams = {};
			fetchPlayerParams.email = rsvpPlayerEmail;
		  	return actions.fetchPlayer(fetchPlayerParams).then(function(fetchPlayerResult){
				if ( !fetchPlayerResult || fetchPlayerResult.length == 0 ){  //error out
				    console.log("ERROR:"+logTag+"no player found for rsvpPlayerEmail:"+rsvpPlayerEmail);
				    validRSVPPlayerPromise.reject("ERROR:"+logTag+"no player found for rsvpPlayerEmail:"+rsvpPlayerEmail);
				} else {
					validRSVPPlayerPromise.resolve("Found rsvpPlayerEmail:"+rsvpPlayerEmail);
					var returnedPlayer = fetchPlayerResult[0];  
					var rsvpPlayerFirstName = returnedPlayer.get("firstName");
					var rsvpPlayerLastName = returnedPlayer.get("lastName");
					var rsvpPlayerFullName = rsvpPlayerFirstName+" "+rsvpPlayerLastName;

					//STEP 2: Notify Confirmed Players of other Confirmations (includes organizer)
					_.each(eventConfirmedPlayers, function(confirmedPlayerEmail) {
						if (rsvpPlayerEmail ==  confirmedPlayerEmail) {
							console.log(logTag+"not processing, rsvpPlayerEmail is also confirmedPlayerEmail:"+confirmedPlayerEmail);
						} else {
							console.log(logTag+"processing confirmedPlayerEmail:"+confirmedPlayerEmail);
							var playerNotifiedPromise = new Parse.Promise();
							playersNotificationPromises.push(playerNotifiedPromise);

							//STEP A. look up user settings for push notifications 
							var requestParamToFetchUser = {};
							requestParamToFetchUser.email = confirmedPlayerEmail;
							actions.fetchUser(requestParamToFetchUser).then(function(returnedUserArray){
						    	if (returnedUserArray.length == 0) {
						    		console.log("ERROR:"+logTag+"fetching user settings for:"+confirmedPlayerEmail);
						            playerNotifiedPromise.resolve("ERROR:"+logTag+"fetching user settings for:"+confirmedPlayerEmail);
						    	} else {
						    		var returnedUser = returnedUserArray[0];
						    		var pushNotifyEnabled = returnedUser.get("pushNotifyEnabled");
						    		var pushNotifyOnRSVP = returnedUser.get("pushNotifyOnRSVP");
						    		var installationId = returnedUser.get("installationId");
		    						var userIsLoggedIn = returnedUser.get("userIsLoggedIn");

						    		//STEP B.  if pushNotifyEnabled, call push  
						    		if (pushNotifyEnabled == true  && pushNotifyOnRSVP == true && userIsLoggedIn == true ) {
						    			console.log(logTag+"PUSH notifying RSVP update to:"+confirmedPlayerEmail);
						    
							      		//call sendPushNotification with deviceType, email, messageTitle, messageAlert
							      		//format date and time for use in the messageAlert
							      		var dateToStringFormat = 'dddd, MMM Do';
								      	var dateString = moment(eventStartDate).format(dateToStringFormat);
							      		var sendPushParams = {};

								  		if (installationId) {
								  			sendPushParams.installationId = installationId;
								  		} 
										
										if (eventStatus == "Full") {
											var eventStatusString = " Event is Full!"
										} else {
											var eventStatusString = ""
										}; 
							      		sendPushParams.deviceType = "ios";  //should be dynamic based on users User model
							      		sendPushParams.eventObjectId = eventObjectId;
							      		sendPushParams.pushCategory = "RsvpEventCategory";  //options are: InviteCategory, RsvpEventCategory, EventCancelledCategory
							      		
							      		if (eventDecision == "Confirmed" || eventDecision == "confirmed") {
							      			sendPushParams.messageTitle = "Event Confirmed";
							      			sendPushParams.messageSubTitle = "Event Confirmed";
							      			sendPushParams.messageAlert = rsvpPlayerFullName+" is IN for "+eventName+", scheduled for "+eventStartDateAsDisplayed+"."+eventStatusString;
										} else if (eventDecision == "Declined" || eventDecision == "declined") {
											sendPushParams.messageTitle = "Event Declined";
											sendPushParams.messageSubTitle = "Event Declined";
											sendPushParams.messageAlert = rsvpPlayerFullName+" is OUT for "+eventName+", scheduled for "+eventStartDateAsDisplayed;
										};
							      		//console.log("NOTIFY:3:"+logTag+"set messageAlert:"+sendPushParams.messageAlert);
							      		if (sendPushParams.eventObjectId && sendPushParams.messageTitle && sendPushParams.messageSubTitle ) {
							      			return push.sendPushNotification(sendPushParams).then(function(sendPushResults){  
									      		//console.log("PUSH:WIN:"+logTag+"notified "+confirmedPlayerEmail+" with sendPushResults:"+JSON.stringify(sendPushResults));
									      		playerNotifiedPromise.resolve("notified:"+confirmedPlayerEmail+"with sendPushResults:"+sendPushResults); 
									      	},
									      		function(error) {
									      		console.log("ERROR:"+logTag+"sendPushResults failed with error:"+JSON.stringify(error));
									      		playerNotifiedPromise.resolve(error); 
									      	});
							      		} else {
							      			console.log("WARNING:"+logTag+"not calling sendPushNotification because one of these is nil:eventObjectId, messageTitle, messageSubTitle, eventStatus");
							      			playerNotifiedPromise.resolve("warning:resolving playerNotifiedPromise but nil:eventObjectId, messageTitle, messageSubTitle, eventStatus"); 
							      		};
						    		} else {
						    			//player does not want to receive push notifications on RSVP status
						    			//console.log(logTag+"NOT notifying RSVP updates to:"+confirmedPlayerEmail);
						    			playerNotifiedPromise.resolve("NOT notifying RSVP updates to:"+confirmedPlayerEmail); 
						    		};
						    	}
						    });
						};
					});
				};
		  	},
		  	function(error){
		  		console.log("ERROR:"+logTag+"could not fetch player:"+requestParams.email+", with error:"+JSON.stringify(error));
		  		validRSVPPlayerPromise.reject(error)
		  });
		} else {
			if (sendPushNotificationBool == false){
				console.log(logTag+"sendPushNotificationBool is false, not notifying other confirmed players");
		  		validRSVPPlayerPromise.resolve(logTag+"sendPushNotificationBool was false, not notifying other confirmed players");
			} else {
				console.log("WARNING:"+logTag+"sendPushNotificationBool is true, but rsvpPlayerEmail is nil");
			  	validRSVPPlayerPromise.reject(logTag+"ERROR:sendPushNotificationBool is true, but rsvpPlayerEmail is nil");				
			}
		};

		return Parse.Promise.when(playersNotificationPromises);
	}, //end notifyPlayersOfRSVPStatus

	notifyPlayersOfAutoConfirmedPlayers: function(requestParams) {  //only available for users who enabled push notifications
		var logTag = "validate.js:notifyPlayersOfAutoConfirmedPlayers:"
		//console.log(logTag+"entered... with requestParams:"+JSON.stringify(requestParams));
		console.log(logTag+"entered...");
		var playersNotificationPromises = [];
		var addedConfirmedPlayerSet = requestParams.addedConfirmedPlayerSet;
		var eventObjectId = requestParams.eventObjectId;
		var eventDecision = requestParams.eventDecision;
		var eventBeingProcessed = requestParams.eventBeingProcessed;

		//set up call to notifyPlayersOfRSVPStatus  
		var eventStatusNotificationParams = {}; 
  		eventStatusNotificationParams.eventObjectId = eventObjectId; 
  		eventStatusNotificationParams.eventDecision = eventDecision;
  		eventStatusNotificationParams.eventBeingProcessed = eventBeingProcessed;

		_.each(addedConfirmedPlayerSet, function(autoConfirmedPlayerEmail){
			var playerNotifiedPromise = new Parse.Promise();
			playersNotificationPromises.push(playerNotifiedPromise);
			eventStatusNotificationParams.email = autoConfirmedPlayerEmail;
	  		module.exports.notifyPlayersOfRSVPStatus(eventStatusNotificationParams).then(function(returnedNotifyPlayersOfRSVPStatus){
		        playerNotifiedPromise.resolve("notified of autoConfirmedPlayerEmail:"+autoConfirmedPlayerEmail);
		    });
		});  //end of _.each addedConfirmedPlayerSet
		return Parse.Promise.when(playersNotificationPromises);
	}, //end notifyPlayersOfAutoConfirmedPlayers

	notifyPlayersOfChangedEvent: function(requestParams) {  
		var logTag = "validate.js:notifyPlayersOfChangedEvent:"
		//console.log(logTag+"entered... with requestParams:"+JSON.stringify(requestParams));
		var eventOrganizerEmail = requestParams.get("eventOrganizerEmail");
		var eventOrganizerFullName = requestParams.get("eventOrganizerFullName");
		var eventOrganizerFirstName = requestParams.get("eventOrganizerFirstName");
		var eventInvitedPlayers = requestParams.get("eventInvitedPlayers");
		var addedInvitedPlayerSet = requestParams.get("addedInvitedPlayerSet");
		var addedConfirmedPlayerSet = requestParams.get("addedConfirmedPlayerSet");
		var eventConfirmedPlayers = requestParams.get("eventConfirmedPlayers");
		var eventName = requestParams.get("eventName");
		var eventMaxPlayers = requestParams.get("eventMaxPlayers");
		var eventType = requestParams.get("eventType");
		var eventStartDate = requestParams.get("eventStartDateAsDate");
		var eventStartDateAsDateWithTimeZone = requestParams.get("eventStartDateAsDateWithTimeZone");

      	console.log("DEPRECATED:"+logTag+"invalid ISO date eventStartDateAsDateWithTimeZone:"+eventStartDateAsDateWithTimeZone);

		var dateToStringFormat = 'dddd, MMM Do';
      	var dateString = moment(eventStartDate).format(dateToStringFormat);
      	

      	//DEPRECATED format in eventStartDateAsDateWithTimeZone (not ISO)
  		//var timeToStringFormat = 'h:mm a z';
  		//var timeString = moment(eventStartDateAsDateWithTimeZone).format(timeToStringFormat);  
  		//var timeStringTrimmed = timeString.trim();

		var eventVenueName = requestParams.get("eventVenueName");
		var eventObjectId = requestParams.id;			
		var playersNotificationPromises = [];
		var toStringFormat = 'dddd, MMMM Do YYYY, h:mm a z';
		var eventStartDateAsString = moment(eventStartDate).format(toStringFormat);
		var eventStartDateAsDisplayed = requestParams.get("eventStartDateAsDisplayed");
		var changedEventStartDateBool = requestParams.get("changedEventStartDateBool");
		var changedVenueBool = requestParams.get("changedVenueBool");

		if ( eventName && eventObjectId && eventType && eventMaxPlayers && eventVenueName && eventStartDateAsString && eventOrganizerEmail && eventOrganizerFullName && eventInvitedPlayers && eventStartDateAsDisplayed && addedInvitedPlayerSet ) {
			var mailCreatorParams = {};
			mailCreatorParams.eventName = eventName;
			mailCreatorParams.eventType = eventType;
			mailCreatorParams.eventMaxPlayers = eventMaxPlayers;
			mailCreatorParams.eventObjectId = eventObjectId;
			mailCreatorParams.eventVenueName = eventVenueName;
			mailCreatorParams.eventStartDate = eventStartDate;
			mailCreatorParams.eventStartDateAsString = eventStartDateAsString;
			mailCreatorParams.eventStartDateAsDisplayed = eventStartDateAsDisplayed;
			mailCreatorParams.eventOrganizerEmail = eventOrganizerEmail;
			mailCreatorParams.eventOrganizerFullName = eventOrganizerFullName;
			mailCreatorParams.eventOrganizerFirstName = eventOrganizerFirstName;

			if (config.build.forProduction) {
				mailCreatorParams.eventDetailsBaseURL = "http://events.sportler.io/eventinfo/"+eventObjectId+"?emailrecipient=";
				mailCreatorParams.eventDecisionBaseURL = "http://events.sportler.io/eventdecision/"+eventObjectId+"?emailrecipient=";
			} else {
				console.log(logTag+"using base URL dev-events.sportler.io for notifyPlayersOfChangedEvent");
				mailCreatorParams.eventDetailsBaseURL = "http://dev-events.sportler.io/eventinfo/"+eventObjectId+"?emailrecipient=";
				mailCreatorParams.eventDecisionBaseURL = "http://dev-events.sportler.io/eventdecision/"+eventObjectId+"?emailrecipient=";
			};

			mailCreatorParams.emailArray = []; //init

			var sendPushParamsBase = {};
			sendPushParamsBase.deviceType = "ios";  //should be dynamic based on users User model
			sendPushParamsBase.eventObjectId = eventObjectId;
			sendPushParamsBase.organizerEmail = eventOrganizerEmail;
			sendPushParamsBase.pushCategory = "EventChangedCategory";  //options are: InviteCategory, RsvpEventCategory, EventCancelledCategory, EventChangedCategory
			sendPushParamsBase.messageTitle = "Sportler";
			sendPushParamsBase.messageSubTitle = "Event Changed";
			sendPushParamsBase.messageAlert = eventOrganizerFullName+" changed "+eventName;  //will be updated based on change type below

			if (changedEventStartDateBool || changedVenueBool ) {
				if (changedEventStartDateBool && !changedVenueBool) {
					//notify that only the date/time changed
					mailCreatorParams.template = "eventNotifyOfChangedDate.html";
					sendPushParamsBase.messageAlert = eventOrganizerFullName+" has changed the time for "+eventName+" to "+eventStartDateAsDisplayed;

				} else if (changedVenueBool && !changedEventStartDateBool) {
					//notify that only the venue changed
					mailCreatorParams.template = "eventNotifyOfChangedVenue.html";
					sendPushParamsBase.messageAlert = eventOrganizerFullName+" has changed the venue for "+eventName+" to "+eventVenueName+" on "+eventStartDateAsDisplayed;
				} else {
					//notify that both venue and date/time changed
					mailCreatorParams.template = "eventNotifyOfChangedDateAndVenue.html";
					sendPushParamsBase.messageAlert = eventOrganizerFullName+" has changed the venue and time for "+eventName+" to "+eventVenueName+", on "+eventStartDateAsDisplayed; 
				};

				var sendPushParams = sendPushParamsBase;

				//make sure to notify both eventInvitedPlayers and eventConfirmedPlayers
				_.each(eventInvitedPlayers, function(invitedPlayerEmail){
					var playerNotifiedPromise = new Parse.Promise();
					playersNotificationPromises.push(playerNotifiedPromise);
				
					//STEP 1. look up user settings for push notifications 
					var requestParamToFetchUser = {};
					requestParamToFetchUser.email = invitedPlayerEmail;
					actions.fetchUser(requestParamToFetchUser).then(function(returnedUserArray){
				    	if (returnedUserArray.length == 0) {
				    		console.log("ERROR:"+logTag+"fetching user settings for:"+invitedPlayerEmail);
				            playerNotifiedPromise.resolve("ERROR:"+logTag+"fetching user settings for:"+invitedPlayerEmail);
				    	} else {
				    		var returnedUser = returnedUserArray[0];
				    		var pushNotifyEnabled = returnedUser.get("pushNotifyEnabled");
				    		var pushNotifyOnRSVP = returnedUser.get("pushNotifyOnRSVP");
				    		var installationId = returnedUser.get("installationId");
		    				var userIsLoggedIn = returnedUser.get("userIsLoggedIn");

				    		//STEP 2.  if pushNotifyEnabled, call push  
				    		if (pushNotifyEnabled == true && userIsLoggedIn == true) {
				    			//console.log(logTag+"PUSH notifying:"+invitedPlayerEmail+" of changed event");	
					  			if (pushNotifyOnRSVP) {
						  			sendPushParams.pushNotifyOnRSVP = pushNotifyOnRSVP;
						  		} else {
						  			sendPushParams.pushNotifyOnRSVP = false;
						  		}
						  		if (installationId) {
						  			sendPushParams.installationId = installationId;
						  		} 

						  		return push.sendPushNotification(sendPushParams).then(function(sendPushResults){  
						      		console.log("PUSH:WIN:"+logTag+"notified:"+invitedPlayerEmail+" of changed event with sendPushResults:"+JSON.stringify(sendPushResults));
						      		playerNotifiedPromise.resolve(sendPushResults); 
						      	},
						      		function(error) {
						      		console.log("ERROR:"+logTag+"sendPushResults failed with error:"+JSON.stringify(error));
						      		playerNotifiedPromise.resolve(error); 
						      	});
				    		} else {
				    			//add the invitedPlayerEmail to mailCreatorParams.emailArray 
								//EMAIL BLOCK - START
				    			playerObject = {};
								playerObject.email = invitedPlayerEmail;
								playerObject.firstName = invitedPlayerEmail;  
								mailCreatorParams.emailArray = []
								mailCreatorParams.emailArray.push(playerObject);

								//console.log(logTag+"calling mailCreator with mailCreatorParams:"+JSON.stringify(mailCreatorParams));
								var mailing = emailer.mailCreator(mailCreatorParams).then(function(returnedMailCreator){
									// email each user with their custom template
									var mailSenderParams = {};
									mailSenderParams.userEmail = returnedMailCreator[0].userEmail;
									mailSenderParams.subject = returnedMailCreator[0].eventName;
									mailSenderParams.html = returnedMailCreator[0].emailHTML;
									mailSenderParams.text = returnedMailCreator[0].emailText;

									//console.log(logTag+"calling mailSender with mailSenderParams:"+JSON.stringify(mailSenderParams));
									emailer.mailSender(mailSenderParams).then(function(mailSenderResults){											
										console.log("TRACK:"+logTag+"Event:SendInvitation")
										mixpanel.track('SendInvitation', {
											distinct_id: eventOrganizerEmail,											
											email: eventOrganizerEmail
										});
										//console.log("EMAIL:WIN:"+logTag+" notified:"+invitedPlayerEmail+" of changed event with mailSenderResults:"+JSON.stringify(mailSenderResults));
									  	playerNotifiedPromise.resolve(mailSenderResults);
									},
									function(error) {
										console.log("ERROR:"+logTag+"mailSender failed with error:"+JSON.stringify(error));
										playerNotifiedPromise.reject("ERROR:"+logTag+"mailSender failed with error:"+JSON.stringify(error))
									});
								});
								//EMAIL BLOCK - END
				    		};
				    	}
				    });
				});  //end of _.each eventInvitedPlayers

				var sendPushParams = sendPushParamsBase;

				_.each(eventConfirmedPlayers, function(confirmedPlayerEmail) {
					var playerNotifiedPromise = new Parse.Promise();
					playersNotificationPromises.push(playerNotifiedPromise);
					if (eventOrganizerEmail == confirmedPlayerEmail ) {  //check confirmedPlayerEmail against eventOrganizerEmail
						//console.log(logTag+"eventOrganizerEmail matches confirmedPlayerEmail.  Not sending the notification to "+confirmedPlayerEmail);
						playerNotifiedPromise.resolve();
					} else {
						//STEP 1. look up user settings for push notifications 
						var requestParamToFetchUser = {};
						requestParamToFetchUser.email = confirmedPlayerEmail;
						actions.fetchUser(requestParamToFetchUser).then(function(returnedUserArray){
					    	if (returnedUserArray.length == 0) {
					    		console.log("ERROR:"+logTag+"fetching user settings for:"+confirmedPlayerEmail);
					            playerNotifiedPromise.resolve("ERROR:"+logTag+"fetching user settings for:"+confirmedPlayerEmail);
					    	} else {
					    		var returnedUser = returnedUserArray[0];
					    		//console.log(logTag+"processing confirmed returnedUser:"+JSON.stringify(returnedUser));	
					    		var pushNotifyEnabled = returnedUser.get("pushNotifyEnabled");
					    		var pushNotifyOnRSVP = returnedUser.get("pushNotifyOnRSVP");
					    		var installationId = returnedUser.get("installationId");
		    					var userIsLoggedIn = returnedUser.get("userIsLoggedIn");

					    		//STEP 2.  if pushNotifyEnabled, call push  
					    		if (pushNotifyEnabled == true && userIsLoggedIn == true ) {
					    			console.log(logTag+"PUSH notifying:"+confirmedPlayerEmail+" of changed event");	
						  			if (pushNotifyOnRSVP) {
							  			sendPushParams.pushNotifyOnRSVP = pushNotifyOnRSVP;
							  		} else {
							  			sendPushParams.pushNotifyOnRSVP = false;
							  		}
							  		if (installationId) {
							  			sendPushParams.installationId = installationId;
							  		} 
						      		//console.log(logTag+"set messageAlert:"+sendPushParams.messageAlert);
							  		return push.sendPushNotification(sendPushParams).then(function(sendPushResults){  
							      		console.log("PUSH:WIN:"+logTag+"notified:"+confirmedPlayerEmail+" with sendPushResults:"+JSON.stringify(sendPushResults));
							      		playerNotifiedPromise.resolve(sendPushResults); 
							      	},
							      		function(error) {
							      		console.log("ERROR:"+logTag+"sendPushResults failed with error:"+JSON.stringify(error));
							      		playerNotifiedPromise.resolve(error); 
							      	});
					    		} else {
					    			//add the confirmedPlayerEmail to mailCreatorParams.emailArray 
									//EMAIL BLOCK - START
					    			playerObject = {};
									playerObject.email = confirmedPlayerEmail;
									playerObject.firstName = confirmedPlayerEmail;  
									mailCreatorParams.emailArray = []
									mailCreatorParams.emailArray.push(playerObject);
									var mailing = emailer.mailCreator(mailCreatorParams).then(function(returnedMailCreator){
										// email each user with their custom template
										var mailSenderParams = {};
										mailSenderParams.userEmail = returnedMailCreator[0].userEmail;
										mailSenderParams.subject = returnedMailCreator[0].eventName;
										mailSenderParams.html = returnedMailCreator[0].emailHTML;
										mailSenderParams.text = returnedMailCreator[0].emailText;
										emailer.mailSender(mailSenderParams).then(function(mailSenderResults){											
											console.log("TRACK:"+logTag+"Event:SendInvitation")
											mixpanel.track('SendInvitation', {
												distinct_id: eventOrganizerEmail,
												email: eventOrganizerEmail
											});
											//console.log("EMAIL:WIN:"+logTag+"notified:"+confirmedPlayerEmail+" with mailSenderResults:"+JSON.stringify(mailSenderResults));		      		
										  	playerNotifiedPromise.resolve(mailSenderResults);
										},
										function(error) {
											console.log("ERROR:"+logTag+"mailSender failed with error:"+JSON.stringify(error));
											playerNotifiedPromise.reject("ERROR:"+logTag+"mailSender failed with error:"+JSON.stringify(error))
										});
									});
									//EMAIL BLOCK - END
					    		};
					    	}
					    });
					}
				});
			} else {
				console.log(logTag+"neither changedEventStartDateBool or changedVenueBool is true, not notifying of changed event to existing invitees or confirmees");
			}

			if (addedInvitedPlayerSet && addedInvitedPlayerSet.length > 0) {
				console.log(logTag+"NEW invittees have been added to event. processing...");
				_.each(addedInvitedPlayerSet, function(invitedPlayerEmail) {
					var playerNotifiedPromise = new Parse.Promise();
					playersNotificationPromises.push(playerNotifiedPromise);

					//STEP 1. look up user settings for push notifications 
					var requestParamToFetchUser = {};
					requestParamToFetchUser.email = invitedPlayerEmail;
					actions.fetchUser(requestParamToFetchUser).then(function(returnedUserArray){
				    	if (returnedUserArray.length == 0) {
				    		console.log("ERROR:"+logTag+"fetching user settings for:"+invitedPlayerEmail);
				            playerNotifiedPromise.resolve("ERROR:"+logTag+"fetching user settings for:"+invitedPlayerEmail);
				    	} else {
				    		var returnedUser = returnedUserArray[0];
				    		var pushNotifyEnabled = returnedUser.get("pushNotifyEnabled");
				    		var pushNotifyOnRSVP = returnedUser.get("pushNotifyOnRSVP");
				    		var installationId = returnedUser.get("installationId");
		    				var userIsLoggedIn = returnedUser.get("userIsLoggedIn");

				    		//STEP 2.  if pushNotifyEnabled, call push  
				    		if (pushNotifyEnabled == true && userIsLoggedIn == true ) {
				    			console.log(logTag+"PUSH notifying:"+invitedPlayerEmail+" of new event");
					      		var sendPushParams = sendPushParamsBase;

					  			if (pushNotifyOnRSVP) {
						  			sendPushParams.pushNotifyOnRSVP = pushNotifyOnRSVP;
						  		} else {
						  			sendPushParams.pushNotifyOnRSVP = false;
						  		}
						  		if (installationId) {
						  			sendPushParams.installationId = installationId;
						  		} 
					      		sendPushParams.inviteeEmail = invitedPlayerEmail;
					      		sendPushParams.pushCategory = "InviteCategory";  //options are: InviteCategory, RsvpEventCategory, EventCancelledCategory
					      		sendPushParams.messageTitle = "Sportler";
					      		sendPushParams.messageSubTitle = "Event Invitation";
					      		sendPushParams.messageAlert = eventOrganizerFullName+" invites you to "+eventName+" on "+eventStartDateAsDisplayed+". Can you get out and play?";

					      		//console.log(logTag+"set messageAlert:"+sendPushParams.messageAlert);

						  		return push.sendPushNotification(sendPushParams).then(function(sendPushResults){  
						      		//console.log("PUSH:WIN:"+logTag+"sendPushResults:"+JSON.stringify(sendPushResults));
						      		playerNotifiedPromise.resolve(sendPushResults); 
						      	},
						      		function(error) {
						      		console.log("ERROR:"+logTag+"sendPushResults failed with error:"+JSON.stringify(error));
						      		playerNotifiedPromise.resolve(error); 
						      	});
				    		} else {
				    			//STEP 3 - call emailer
				    			console.log(logTag+"EMAIL notifying:"+invitedPlayerEmail+" of new event");	

				    			var requestParamsString = JSON.stringify(requestParams);
				    			var sendEmailParams = JSON.parse(requestParamsString);

						  		var invitePlayerEmailArray = [];
						  		invitePlayerEmailArray.push(invitedPlayerEmail)
						  		sendEmailParams.eventInvitedPlayersToEmail = invitePlayerEmailArray;  

						  		//console.log(logTag+"calling emailPlayersOfNewEvent with sendEmailParams:"+JSON.stringify(sendEmailParams));	
						  		return emailer.emailPlayersOfNewEvent(sendEmailParams).then(function(sendEmailResults){ 
						      		//console.log("EMAIL:WIN:"+logTag+"sendEmailResults:"+JSON.stringify(sendEmailResults));
						      		playerNotifiedPromise.resolve(sendEmailResults); 
						      	},
						      		function(error) {
						      		console.log("ERROR:"+logTag+"sendEmailResults failed with error:"+JSON.stringify(error));
						      		playerNotifiedPromise.resolve(error); 
						      	});
				    		};
				    	}
				    });
				});
			} else {
				//console.log(logTag+"No new invittees have been added to the changed event.");
			}

			//NEW confirmees added - START  
			if (addedConfirmedPlayerSet && addedConfirmedPlayerSet.length > 0) {
				console.log(logTag+"NEW confirmees have been added to event. processing notifications to these players...");
				_.each(addedConfirmedPlayerSet, function(confirmedPlayerEmail) {
					var playerNotifiedPromise = new Parse.Promise();
					playersNotificationPromises.push(playerNotifiedPromise);
					//STEP 1. look up user settings for push notifications 
					var requestParamToFetchUser = {};
					requestParamToFetchUser.email = confirmedPlayerEmail;
					actions.fetchUser(requestParamToFetchUser).then(function(returnedUserArray){
				    	if (returnedUserArray.length == 0) {
				    		console.log("ERROR:"+logTag+"fetching user settings for:"+invitedPlayerEmail);
				            playerNotifiedPromise.resolve("ERROR:"+logTag+"fetching user settings for:"+invitedPlayerEmail);
				    	} else {
				    		var returnedUser = returnedUserArray[0];
				    		var pushNotifyEnabled = returnedUser.get("pushNotifyEnabled");
				    		var pushNotifyOnRSVP = returnedUser.get("pushNotifyOnRSVP");
				    		var installationId = returnedUser.get("installationId");
		    				var userIsLoggedIn = returnedUser.get("userIsLoggedIn");

				    		//STEP 2.  if pushNotifyEnabled, call push  
				    		if (pushNotifyEnabled == true && userIsLoggedIn == true ) {
				    			console.log(logTag+"PUSH notifying:"+confirmedPlayerEmail+" of auto-confirmation for changed event");					      		

				    			var sendPushParams = sendPushParamsBase;  
					      		//format date and time for use in the messageAlert
					      		var dateToStringFormat = 'dddd, MMM Do';
						      	var dateString = moment(eventStartDate).format(dateToStringFormat);

						      	//DEPRECATED format in eventStartDateAsDateWithTimeZone (not ISO)
						  		//var timeToStringFormat = 'h:mm a z';
						  		//var timeString = moment(eventStartDateAsDateWithTimeZone).format(timeToStringFormat);  
						  		//var timeStringTrimmed = timeString.trim();

					  			if (pushNotifyOnRSVP) {
						  			sendPushParams.pushNotifyOnRSVP = pushNotifyOnRSVP;
						  		} else {
						  			sendPushParams.pushNotifyOnRSVP = false;
						  		}
						  		if (installationId) {
						  			sendPushParams.installationId = installationId;
						  		} 
					      		sendPushParams.inviteeEmail = confirmedPlayerEmail;
					      		sendPushParams.pushCategory = "InviteCategory";  //options are: InviteCategory, RsvpEventCategory, EventCancelledCategory
					      		sendPushParams.messageSubTitle = "Event Invitation";
					      		sendPushParams.messageAlert = eventOrganizerFullName+" confirmed you for "+eventName+" on "+eventStartDateAsDisplayed;

						  		return push.sendPushNotification(sendPushParams).then(function(sendPushResults){  
						      		//console.log("PUSH:WIN:"+logTag+"sendPushResults:"+JSON.stringify(sendPushResults));
						      		playerNotifiedPromise.resolve(sendPushResults); 
						      	},
						      		function(error) {
						      		console.log("ERROR:"+logTag+"sendPushResults failed with error:"+JSON.stringify(error));
						      		playerNotifiedPromise.resolve(error); 
						      	});
				    		} else {
				    			//STEP 3 - call emailer
				    			console.log(logTag+"EMAIL notifying:"+confirmedPlayerEmail+" of auto-confirmed new event");		    			
				    			var requestParamsString = JSON.stringify(requestParams)
				    			var sendEmailParams = JSON.parse(requestParamsString)
						  		var confirmedPlayerEmailArray = [];
						  		confirmedPlayerEmailArray.push(confirmedPlayerEmail)
						  		sendEmailParams.eventConfirmedPlayersToEmail = confirmedPlayerEmailArray; 
					  			//console.log(logTag+"calling emailPlayersOfNewEvent with sendEmailParams:"+JSON.stringify(sendEmailParams));
						  		return emailer.emailPlayersOfNewEvent(sendEmailParams).then(function(sendEmailResults){ 
						      		//console.log("EMAIL:WIN:"+logTag+"sendEmailResults:"+JSON.stringify(sendEmailResults));
						      		playerNotifiedPromise.resolve(sendEmailResults); 
						      	},
						      		function(error) {
						      		console.log("ERROR:"+logTag+"sendEmailResults failed with error:"+JSON.stringify(error));
						      		playerNotifiedPromise.resolve(error); 
						      	});
				    		};
				    	}
				    });
				});
			} else {
				console.log(logTag+"No new confirmees have been added to the changed event.");
			}
			//NEW confirmees added - END

		} else {
			console.log("ERROR:"+logTag+"notifyPlayersOfChangedEvent: requires parameters: eventName && eventObjectId && eventType && eventMaxPlayers && eventVenueName && eventStartDateAsString && eventOrganizerEmail && eventOrganizerFullName && eventInvitedPlayers && eventStartDateAsDisplayed && addedInvitedPlayerSet");
			console.log(" --> "+logTag+"with eventName:"+eventName);
			console.log(" --> "+logTag+"with eventObjectId:"+eventObjectId);
			console.log(" --> "+logTag+"with eventType:"+eventType);
			console.log(" --> "+logTag+"with eventMaxPlayers:"+eventMaxPlayers);
			console.log(" --> "+logTag+"with eventVenueName:"+eventVenueName);
			console.log(" --> "+logTag+"with eventStartDateAsString:"+eventStartDateAsString);
			console.log(" --> "+logTag+"with eventOrganizerEmail:"+eventOrganizerEmail);
			console.log(" --> "+logTag+"with eventOrganizerFullName:"+eventOrganizerFullName);  //undefined
			console.log(" --> "+logTag+"with eventInvitedPlayers:"+eventInvitedPlayers);
			console.log(" --> "+logTag+"with eventStartDateAsDisplayed:"+eventStartDateAsDisplayed); //undefined
			console.log(" --> "+logTag+"with addedInvitedPlayerSet:"+addedInvitedPlayerSet);

			var completedPromise = new Parse.Promise();
			playersNotificationPromises.push(completedPromise);
			completedPromise.resolve("No added players for the event.  Resolving successful...")
		}
		return Parse.Promise.when(playersNotificationPromises);
	}, //end notifyPlayersOfChangedEvent

	notifyPlayersOfCancelledEvent: function(requestParams) {   
		var logTag = "validate.js:notifyPlayersOfCancelledEvent:"
		//console.log(logTag+"entered... with requestParams:"+JSON.stringify(requestParams));
		var playersNotificationPromises = [];

		var eventOrganizerEmail = requestParams.get("eventOrganizerEmail");
		var eventOrganizerFullName = requestParams.get("eventOrganizerFullName");
		var eventOrganizerFirstName = requestParams.get("eventOrganizerFirstName");
		var eventInvitedPlayers = requestParams.get("eventInvitedPlayers");
		var eventConfirmedPlayers = requestParams.get("eventConfirmedPlayers");
		var eventName = requestParams.get("eventName");
		var eventMaxPlayers = requestParams.get("eventMaxPlayers");
		var eventType = requestParams.get("eventType");
		var eventStartDate = requestParams.get("eventStartDateAsDate");
		var eventStartDateAsDisplayed = requestParams.get("eventStartDateAsDisplayed");
		var eventStartDateAsDateWithTimeZone = requestParams.get("eventStartDateAsDateWithTimeZone");
		var eventVenueName = requestParams.get("eventVenueName");
		var eventObjectId = requestParams.id;			
		var toStringFormat = 'dddd, MMMM Do YYYYeventStartDateAsDateWithTimeZone, h:mm a z';
		var eventStartDateAsString = moment(eventStartDate).format(toStringFormat);

		if ( eventName && eventObjectId && eventType && eventMaxPlayers && eventVenueName && eventStartDateAsString && eventOrganizerEmail && eventOrganizerFullName && eventInvitedPlayers && eventStartDateAsDisplayed ) {
			var mailCreatorParams = {};
			mailCreatorParams.eventName = eventName;
			mailCreatorParams.eventType = eventType;
			mailCreatorParams.eventMaxPlayers = eventMaxPlayers;
			mailCreatorParams.eventObjectId = eventObjectId;
			mailCreatorParams.eventVenueName = eventVenueName;
			mailCreatorParams.eventStartDate = eventStartDate;
			mailCreatorParams.eventStartDateAsString = eventStartDateAsString;
			mailCreatorParams.eventStartDateAsDisplayed = eventStartDateAsDisplayed;
			mailCreatorParams.eventOrganizerEmail = eventOrganizerEmail;
			mailCreatorParams.eventOrganizerFullName = eventOrganizerFullName;
			mailCreatorParams.eventOrganizerFirstName = eventOrganizerFirstName;

			if (config.build.forProduction) {
				mailCreatorParams.eventDetailsBaseURL = "http://events.sportler.io/eventinfo/"+eventObjectId+"?emailrecipient=";
				mailCreatorParams.eventDecisionBaseURL = "http://events.sportler.io/eventdecision/"+eventObjectId+"?emailrecipient=";
			} else {
				console.log(logTag+"using base URL dev-events.sportler.io for notifyPlayersOfCancelledEvent");
				mailCreatorParams.eventDetailsBaseURL = "http://dev-events.sportler.io/eventinfo/"+eventObjectId+"?emailrecipient=";
				mailCreatorParams.eventDecisionBaseURL = "http://dev-events.sportler.io/eventdecision/"+eventObjectId+"?emailrecipient=";
			};

			mailCreatorParams.template = "eventNotifyOfCancellation.html";
			
			_.each(eventConfirmedPlayers, function(confirmedPlayerEmail) {

				if (eventOrganizerEmail == confirmedPlayerEmail) {
					//console.log(logTag+"Not sending notification of cancelled event to the organizer"); 
				} else {
					var playerNotifiedPromise = new Parse.Promise();
					playersNotificationPromises.push(playerNotifiedPromise);

					//STEP 1. look up user settings for push notifications 
					var requestParamToFetchUser = {};
					requestParamToFetchUser.email = confirmedPlayerEmail;
					actions.fetchUser(requestParamToFetchUser).then(function(returnedUserArray){
				    	if (returnedUserArray.length == 0) {
				    		console.log("ERROR:"+logTag+"fetching user settings for:"+confirmedPlayerEmail);
				    		playerNotifiedPromise.resolve();

				    	} else {
				    		var returnedUser = returnedUserArray[0];
				    		var pushNotifyEnabled = returnedUser.get("pushNotifyEnabled");
				    		var pushNotifyOnRSVP = returnedUser.get("pushNotifyOnRSVP");
				    		var installationId = returnedUser.get("installationId");
		    				var userIsLoggedIn = returnedUser.get("userIsLoggedIn");

				    		//STEP 2. if pushNotifyEnabled, call push  
				    		if (pushNotifyEnabled == true && userIsLoggedIn == true ) {
				    			console.log(logTag+"PUSH notifying:"+confirmedPlayerEmail+" of cancelled event");

					      		//call sendPushNotification with deviceType, email, messageTitle, messageAlert
					      		var dateToStringFormat = 'dddd, MMM Do';
					      		var dateString = moment(eventStartDate).format(dateToStringFormat);

								//DEPRECATED format in eventStartDateAsDateWithTimeZone (not ISO)
						  		//var timeToStringFormat = 'h:mm a z';
						  		//var timeString = moment(eventStartDateAsDateWithTimeZone).format(timeToStringFormat);  
						  		//var timeStringTrimmed = timeString.trim();

					      		var sendPushParams = {};

					  			if (pushNotifyOnRSVP) {
						  			sendPushParams.pushNotifyOnRSVP = pushNotifyOnRSVP;
						  		} else {
						  			sendPushParams.pushNotifyOnRSVP = false;
						  		}

						  		if (installationId) {
						  			sendPushParams.installationId = installationId;
						  		} 
					      		sendPushParams.deviceType = "ios";  //should be dynamic based on users User model
					      		sendPushParams.eventObjectId = eventObjectId;
					      		sendPushParams.organizerEmail = eventOrganizerEmail;
					      		sendPushParams.confirmedPlayerEmail = confirmedPlayerEmail;
					      		sendPushParams.pushCategory = "EventCancelledCategory";  //options are: InviteCategory, RsvpEventCategory, EventCancelledCategory
					      		sendPushParams.messageTitle = "Sportler";
					      		sendPushParams.messageSubTitle = "Event Cancelled";
						  		sendPushParams.messageAlert = eventOrganizerFullName+" cancelled "+eventName+", originally scheduled for "+eventStartDateAsDisplayed+". Hope you get out and play soon!";

						  		return push.sendPushNotification(sendPushParams).then(function(sendPushResults){  
						      		//console.log("PUSH:WIN:"+logTag+"sendPushResults:"+JSON.stringify(sendPushResults));
						      		playerNotifiedPromise.resolve(); 
						      	},
						      		function(error) {
						      		console.log("ERROR:"+logTag+"sendPushResults failed with error:"+JSON.stringify(error));
						      		playerNotifiedPromise.resolve(error); 
						      	});
				    		} else {
						      	//STEP 3 - call emailer for remaining users
				    			console.log(logTag+"EMAIL notifying:"+confirmedPlayerEmail+" of cancelled event");	
				    			playerObject = {};
								playerObject.email = confirmedPlayerEmail;
								playerObject.firstName = confirmedPlayerEmail;  //placeholder
								mailCreatorParams.emailArray = [];
								mailCreatorParams.emailArray.push(playerObject);
								//console.log(logTag+"calling emailer.mailCreator with mailCreatorParams:"+JSON.stringify(mailCreatorParams));

								var mailing = emailer.mailCreator(mailCreatorParams).then(function(returnedMailCreator){
									// email user with their custom template
									var mailSenderParams = {};
									mailSenderParams.userEmail = returnedMailCreator[0].userEmail;
									mailSenderParams.subject = "Cancelled: "+returnedMailCreator[0].eventName;
									mailSenderParams.html = returnedMailCreator[0].emailHTML;
									mailSenderParams.text = returnedMailCreator[0].emailText;
									emailer.mailSender(mailSenderParams).then(function(mailSenderResults){
											//console.log("EMAIL:WIN:"+logTag+"mailSenderResults:"+JSON.stringify(mailSenderResults));
											playerNotifiedPromise.resolve();
										},
										function(error) {
											console.log("ERROR:"+logTag+"mailSender failed with error:"+JSON.stringify(error));
										playerNotifiedPromise.resolve(error);
									});
					  			});  
				    		} 
				    	}
				    });
				};				
			});
		} else {
			console.log("ERROR:"+logTag+"notifyPlayersOfCancelledEvent: requires parameters: eventName && eventObjectId && eventType && eventMaxPlayers && eventVenueName && eventStartDateAsString && eventOrganizerEmail && eventOrganizerFullName && eventInvitedPlayers && eventStartDateAsDisplayed")
			console.log(" --> "+logTag+"with eventName:"+eventName);
			console.log(" --> "+logTag+"with eventType:"+eventType);
			console.log(" --> "+logTag+"with eventMaxPlayers:"+eventMaxPlayers);
		}

		return Parse.Promise.when(playersNotificationPromises);
	} //end notifyPlayersOfCancelledEvent
}

