/* router.js */


FlowRouter.route('/', {
	name: 'home',
	action: function (params) {
		BlazeLayout.render("main", {});
		console.log("This is the main template.", params);
	}
});



