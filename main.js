/* Import bodyparser, express, and request modules*/
const port = process.env.PORT || 3000;
const clientId = "";
const clientSecret = "";
const express = require("express");
const request = require("request");
const bodyParser = require("body-parser");

var app = express();
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

/* Let's start our server */
app.listen(port, function () {
	/* Callback triggered when server is successfully listening. Hurray!*/
	console.log("Anonymity @ Work server listening: " + port);
});

/* This route handles GET requests to our root ngrok address and responds with
 * the same "Ngrok is working message" we used before*/
app.get("/", function (req, res) {
	res.send("Anonymity @ Work server listening: " + port);
});

/* This route handles get request to a /oauth endpoint. We'll use this endpoint
 * for handling the logic of the Slack oAuth process behind our app.*/
app.get("/oauth", function (req, res) {
	/* When a user authorizes an app, a code query parameter is passed on the
	 * oAuth endpoint. If that code is not there, we respond with an error
	 * message.*/
	if (!req.query.code) {
		res.status(500);
		res.send({"Error": "Looks like we're not getting code."});
		console.log("Looks like we're not getting code.");
	} else {
		/* If it's there we'll do a GET call to Slack's `oauth.access`
		 * endpoint, passing our app's client ID, client secret, and the
		 * code we just got as query parameters.*/
		request({
			url: "https://slack.com/api/oauth.access",
			qs: {code: req.query.code, client_id: clientId, client_secret: clientSecret},
			method: "GET"
		}, function (error, response, body) {
			if (error) {
				console.log(error);
			} else {
				res.json(body);
			}
		});
	}
});

app.post("/anon", function (req, res) {
	/* This function handles anonymous posting and recording who sent
	 * messages. */
	const fs = require("fs");
	var response_address = req.body.response_url;
	var text = req.body.text;
	/* Send notification to user to prevent timeout error. */
	res.send("One moment, posting anonymously.");

	/* Prepare data for posting.*/
	var postData = JSON.stringify({
		response_type: "in_channel",
		channel: req.body.channel_id,
		text: text,
		as_user: false
	});

	/* Set up server options. */
	var clientServerOptions = {
		uri: response_address,
		body: postData,
		method: "POST",
		headers: {
			"Content-Type": "application/json"
		}
	};

	/* Send request to server. */
	request(clientServerOptions, function (error, response) {
		if (error) {
			console.log(error, response.body);
		} else {
			return;
		}
	});
	/* Record sender's user id in a text file. Should this log the name instead? */
	fs.appendFileSync("messages.txt", `${req.body.user_id} sent an anonymous message\n`, "utf8");
});

app.post("/anonhelp", function (req, res) {
	/* Display help message showing simple usage. */
	res.send("Running the integration is pretty simple.  Simply type /anon followed by your message.  You can try it out by entering \"/anon Testing Anonymity @ Work\" (without quotes) to send that message to the channel you are in.  Give it a try!");
});