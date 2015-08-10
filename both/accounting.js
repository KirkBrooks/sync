/*  accounting.js  */
//  functions used in accounting anywhere
//    called as Meteor.accounting.fucntion (params...)
//  ALL account field names are lower case !!
//  LEDGER collection:
	// userId:
	// date:
	// account: cash, inventory etc
	// acct:   A / L / Eq / S / C / Ex 
	// amount;  postive for debits / negative for credits
	// comment: instead of a journal



Meteor.accounting = {  
	// returns a number as a formatted value
	strNumber: function (n, digits) {
		var value = Intl.NumberFormat('en-US', { 
			style: 'currency', 
			currency: 'USD',
			minimumFractionDigits: 2 
		}).format(n);
		//  console.log("strNumber  n: " + n + ", digits: " + digits + ", value: " + value)
		return value;
	},

	ledgerUpdate: function (userId, amount, dbAccount, crAccount, comment) {
		// post the ledger records
		var now = new Date();

		Ledger.insert({
			userId: userId,
			date: now,
			account: dbAccount,
			amount: amount,
			comment: comment
		});

		Ledger.insert({
			userId: userId,
			date: now,
			account: crAccount,
			amount: -amount,
			comment: comment
		});

		Meteor.accounting.bsUpdate (userId, amount, dbAccount, crAccount);

	},

		/////////////////////
	bsUpdate: function (user, amount, dbAccount, crAccount ){
		console.log(user + ", " + amount + ", " +  dbAccount + ", " + crAccount);
	    var inc = EJSON.parse(
	    	"{" + 
		    "\"" + dbAccount + "\"" + ":" +  
	    	amount + "," +  
	    	"\"" + crAccount + "\"" + ":" +  
	    	(amount * -1) + "}"
		);

        var attr = { $setOnInsert: {userId: user }};
		attr.$inc = inc;

		console.log("attr = " + JSON.stringify(attr));

		 var bs = BalSheet.findOne({userId: user});
		if (! bs) {
			console.log("Need to create the balSheet object.")
		}

		// console.log(bs);

		var bsId = BalSheet.upsert ( {userId: user }, attr);
		console.log(bsId);		
	},

	// called when a new player registers
	trxnNewPlayer: function (userId) {
		// give new players $10k in cash
		Meteor.accounting.ledgerUpdate (userId, 10000, 'cash', 'stock', 'New player');
	},


	trxnBuyRmuCr: function (userId, totalValue, comment){

		var now = moment();

		Ledger.insert({
			userId: userId,
			date: now,
			account: 'A/P',
			acct: 'L',
			amount: -totalValue,
			comment: comment
		});

		Ledger.insert({
			userId: userId,
			date: now,
			account: 'Inventory',
			acct: 'A',
			amount: totalValue,
			comment: comment
		});
	},

	trxnSellRmuCash: function (userId, totalValue, comment){

		var now = moment();

		Ledger.insert({
			userId: userId,
			date: now,
			account: 'Cash',
			acct: 'A',
			amount: totalValue,
			comment: comment
		});

		Ledger.insert({
			userId: userId,
			date: now,
			account: 'Inventory',
			acct: 'A',
			amount: -totalValue,
			comment: comment
		});
	}, 

	////////////  ///////////
	getMyCash: function (userId){
		// get the cash balance from the BalSheet
		var bs = BalSheet.findOne({userId: Meteor.userId()});
		if(bs) {
			return bs.cash;
		}

	}

}


