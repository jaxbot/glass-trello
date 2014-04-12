/*
 * Glass Trello Integration
 * By Jonathan Warner (@jaxbot)
 *
 * Highly experimental right now
 * 
 */

// uses glass-prism Node.js library to interface with Glass
var prism = require("glass-prism");

// include the node-trello api library
var Trello = require("node-trello");

// load configuration for this instance
var config = require("./config.json");

// init with key and token from Trello
var trello = new Trello(config.trello_key, config.trello_token);

prism.init(config, function(err) {
	getShoppingList();
});

prism.on('newclient', onNewClient);
prism.on('subscription', onSubscription);

function onNewClient(tokens) {
	getShoppingList();
};

function onSubscription(err, payload) {
	console.log(payload);
	if (payload.data.operation == "DELETE") {
		var cardid = payload.item.sourceItemId.split("trello_")[1];
		trello.del("/1/cards/" + cardid, function(err,data) {
			console.log("Info: card deleted on Trello");
		});
	}
	if (payload.data.operation == "INSERT") {
		trello.post("/1/lists/" + config.lists["shopping"] + "/cards", { name: payload.item.text }, function(err,data) {
			console.log(err);
			console.log(data);
		});
	}
};

function getShoppingList() {
	//prism.deleteBundle({ "bundleId": "trelloshop" });

	trello.get("/1/lists/" + config.lists["shopping"] + "/cards", function(err,data) {
		var html = prism.cards.main(data);
		prism.all.updateCard({ html: html, pinned: true, sourceItemId: "trello_cover", bundleId: "trelloshop", isBundleCover: true });
		for (var i = 0; i < data.length; i++) {
			var html = prism.cards.listitem(data[i]);
			prism.all.updateCard({ html: html, pinned: true, sourceItemId: "trello_" + data[i].id, bundleId: "trelloshop", isBundleCover: false });
		}
	});
};

