
Accounts.ui.config({
  requestPermissions: {
    facebook: ['user_likes'],
    github: ['user', 'repo']
  },
  requestOfflineToken: {
    google: true
  },
  passwordSignupFields: 'USERNAME_AND_EMAIL'
});

Template.materials.helpers({
	item: function () {
		var item = Materials.find({type: "RMU"}, {sort: {price: 1}});
		return item;
	},
});

Template.materials.events ({
	'click .buyBtn': function () {
		var rmuId = this._id;
		Meteor.call('buyRMU', rmuId);

		Meteor.call ('userGetCash', Meteor.userId(), function (error, result) {
		if(error) {	alert(error); } 
		result = Meteor.accounting.strNumber(result, 2);
		Session.set('cash', result);
		});
	}
});

Template.myMaterials.helpers({
	rmus: function () {
		var userId = Meteor.userId();
		var rmus = Stockpile.findOne({userId: userId});
	
		//  add the average price
		if(rmus) {
			var qty = rmus.qty;
			var value = (rmus.value);
			var avgPrice = (value / qty);

			rmus.value = Meteor.accounting.strNumber(value, 2);
			rmus.avgPrice = Meteor.accounting.strNumber(avgPrice, 2);

			Session.set('rmuVALUE', value);
			return rmus;
		}
	},

	myCash: function () {
		var userId = Meteor.userId();
		Meteor.call ('userGetCash', userId, function (error, result) {
			if(error) {
				alert(error);
			} 
			result = Meteor.accounting.strNumber(result, 2);
			Session.set('cash', result);
		});

		return Session.get('cash');
	},

});



Template.sellRMU.events ({
	'click .sell-rmu': function () {
		event.preventDefault();

		var userId = Meteor.userId();
		var rmus = Stockpile.findOne({userId: userId});
		var price = $("[name='price']").val();
		var qty = $("[name='qty']").val();
		var cost = Session.get('rmuCost');

		// rules: 1) qty > 0 & qty <= rmus.qty
		//        2) price > 0 
	if (price <= 0) {
	    alert("Your Sales Price may not be zero or less.");
	} else if (qty <= 0) {
	    alert("You may not sell zero or fewer items.");
	}else if (qty > rmus.qty) {
		alert("You only have " + rmus.qty + " items. You may not sell more than that.");
	} else {  
		//  this is the success condition
	 	console.log(" OK to sell: " + qty + " @ " + price);
		Meteor.call('sellRMU', userId, qty, price, cost, function(error, result) {});

		// clear the form inputs
		$("[name='price']").val(0);
		$("[name='qty']").val(0);
	 }

	}
});


