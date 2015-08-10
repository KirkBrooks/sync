/*  collections.js  */

Materials = new Mongo.Collection('materials');
//  type: 	RMU
//  qty: 	# units in the lot
//  price: 	price per unit
//  expire: if not bought by this time offer will expire
//  seller: user Id or null 

Stockpile = new Mongo.Collection('stockpile');
// userId:  the user id
// qty:     total qoh
// value:   total value

Ledger = new Mongo.Collection('ledger');
// userId:
// date:
// account: Cash, invengtory etc
// class:   A / L / Eq / S / C / Ex 
// amount;  postive for debits / negative for credits
// comment: instead of a journal

BalSheet = new Mongo.Collection('balsheet');
  // userId:
  // date:
  // assets:
  //   cash
  //   inventory
  //   a/r
  // liabilities:
  //   a/p
  //   notes
  //   taxesPayable
  // equity
  //   stock
  //   netIncome
  // sales
  // cog
  // expenses

  GameParams = new Mongo.Collection('gameparams');
    //  various parameters for the game
    //  name  -- different names for different games. Each player can only be in one game
    //  rmuContracts:
    //      minTime
    //      maxTime
    //      minPrice
    //      maxPrice
    //      playerTime
