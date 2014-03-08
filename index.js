/*
 * Glass Trello Integration
 * By Jonathan Warner (@jaxbot)
 *
 * Highly experimental right now
 * 
 */

// uses glass-prism Node.js library to interface with Glass
var prism = require("glass-prism");

var Trello = require("node-trello");

// load configuration for this instance
var config = require("./config.json");

var t = new Trello(config.trello_key, config.trello_token);

config.callbacks = {
	newclient: onNewClient
};

prism.init(config, function(err) {
	getShoppingList();
});

function onNewClient(tokens) {
	getShoppingList();
};

function onSubscription(err, payload) {
	console.log(payload);

	getShoppingList();
	/* 
			if (config.commands[i].aliases[j] == data.text) {
				exec(config.commands[i].command, function(err, stdout, stderr) {
					console.log(stdout);

					var html = prism.cards.stdout({ stdout: stdout, command: config.commands[i].command });

					if (config.commands[i].sendback)
					prism.insertCard({ token: payload.token, card: html });
				});
			}
		}
	}
	*/
};

function getShoppingList() {
	t.get("/1/lists/" + config.lists["shopping"] + "/cards", function(err,data) {
		var html = prism.cards.main(data);
		prism.updateAllCards({ card: html, pinned: true, id: "trello_cover", bundleId: "trelloshop", isBundleCover: true });
		for (var i = 0; i < data.length; i++) {
			var html = prism.cards.listitem(data[i]);
			prism.updateAllCards({ card: html, pinned: true, id: "trello_" + data[i].id, bundleId: "trelloshop", isBundleCover: false });
		}
	});
};

