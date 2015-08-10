/*   materials.js   */

function updateStockpile (userId, qty, totalValue) {

	var stockpile = Stockpile.findOne ({userId: userId});
	var qty = qty * 1;

	if(stockpile) {
		Stockpile.update ({userId: userId }, 
			{$inc: {
			qty: qty,
			value: totalValue
		}});
	} else {
		Stockpile.insert ({
			userId: userId,
			qty: qty,
			value: totalValue
		});	
	}
};

function addRmuContract ( qty, price, expire, userId) {
	if (qty > 0) {
	  	Materials.insert ({
	  		type: "RMU",
	  		qty: qty,
	  		price: price,
	  		expire: expire,
	  		userId: userId
		  	});
	}
};


Meteor.methods ({
	newOffer: function () {
		//  insert a new offer into the Materials collection
		//  this could be more accurate if the qty is random between 
		//  0 and 90% of max offered to min of 10. This will simulate 
		//  market responses to increased demand with increased 
		//  production.

		// need to get the game params
		var game = GameParams.findOne({name : 'theGame'});


		var qty = Math.floor((Math.random() * game.rmuContracts.maxQty)); // random 0 to 10

		// random $10 to $90
		var minPrice = game.rmuContracts.minPrice;
		var maxPrice = game.rmuContracts.maxPrice;
		var price = ((Math.random() * (maxPrice - minPrice)) + minPrice).toFixed(2); 


		// could add some variablility into the expire times
		var secs = (Math.random() * game.rmuContracts.maxTime) + game.rmuContracts.minTime; // rand time: 30 - 150 seconds
		var expire = moment().add( secs, 'seconds');


		addRmuContract ( qty, price, expire, null );
	}
})

Meteor.methods({ 
	userGetCash: function (userId) {
		var bs = BalSheet.findOne ({userId: userId});
		return bs.cash;
		console.log("method, cash: " + bs.cash);
	}
});

Meteor.methods ({
	deleteExpired: function () {	// delete any expired offers
		var cutOff = moment();

		// if there is no userId just delete them
		Materials.remove({ $and: [ {type: "RMU"}, {expire: {$lte: cutOff}}, {userId: null} ]});

		// for the expired user contracts put them back into Stockpile
		var olds = Materials.find ({$and: 
			[ {type: "RMU"}, 
			{expire: {$lte: cutOff}},
			{userId: {$ne: null} }
			]});

		olds.forEach(function (contract) {
		  //  add these items back to Stockpile
		  var rmuId = contract._id;
		  var qty = contract.qty;
		  var price = contract.price;
		  var totalValue = (qty * price);
		  var userId = contract.userId;
		  console.log("qty: " + qty + ", user: " + userId);

		  updateStockpile (userId, qty, totalValue);

		  //  remove this contract
		Materials.remove ({_id: rmuId});
		});
	}
});

Meteor.methods ({
	sellRMU: function (userId, qty, price, cost) {
		var costValue = (qty * cost);
		//  create a contract for these items & remove them from his inventory
		var expire = moment().add(120, 'seconds'); // these sales last just a little longer

		addRmuContract ( qty, price, expire, userId );

	//  take these items out of user's Stockpile
		updateStockpile (userId, -qty, -costValue);

	}
});

Meteor.methods ({  // a user attempts to buy a RMU contract
	buyRMU: function (rmuId) {
		var rmu = Materials.findOne ({_id: rmuId});
		if (rmu) {
			var qty = rmu.qty;
			var price = rmu.price;
			var totalValue = (qty * price); // total value of this transaction

			// just add it to the player's stockpile
			var userId = Meteor.userId(); 

			updateStockpile (userId, qty, totalValue);
			var comment = "Buy RMU, " + qty + " units";

			Meteor.accounting.ledgerUpdate (userId, totalValue, 'inventory', 'cash', comment);

			Materials.remove({_id: rmuId});

		} else {
			return "That offer expired or was already bought."
		}
	}
});

