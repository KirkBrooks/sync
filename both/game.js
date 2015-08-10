//  game.js  //

Meteor.game = {
	newGameParams: function (name) {
	    // create a new, default gameParam reocrd
	    // and return the _id. Only called on the server side
	
	    //'name' shoud not be duplicated or re-initialized
	    var game = GameParams.findOne({name: name});

	    if( ! game ) {    // build the intial parameters
	    	    var rmuContracts = {
	    	          minTime : 45,
	    	          maxTime : 120,
	    	          minQty : 0,
	    	          maxQty : 10,
	    	          minPrice : 5,
	    	          maxPrice : 50,
	    	          playerTime : 145
	    	      };
	    
	    	    var game = GameParams.insert({
	    	    	name: name,
	    		    rmuContracts : rmuContracts
	    		});}

		return game._id;
    },


};

