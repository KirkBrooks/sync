/*  server.js  */

// optionally set the collection's name that synced cron will use
SyncedCron.config({
  collectionName: 'somethingDifferent'
});

SyncedCron.add({
  name: 'increment counter',
  schedule: function(parser) {
    // parser is a later.parse object
    return parser.text('every 10 seconds');
  }, 

  job: function(intendedAt) {
  	Meteor.call('newOffer');
  	Meteor.call('deleteExpired');
  }
});



Meteor.startup(function () {
  // for the time being there is only one game in town
  var gameId = Meteor.game.newGameParams('theGame');



  // code to run on server at startup
  SyncedCron.start();
  
  var mins = 60;
  Meteor.setTimeout(function() { SyncedCron.stop(); }, 60 * mins * 1000);
});


Accounts.onCreateUser (function (options, user) {
  Meteor.accounting.trxnNewPlayer(user._id);
  return user;
});



