var https = require("https");
var options = {
	hostname: "hooks.slack.com",
	port: 443,
	path: "/services/TG818QD46/BGDA18K5M/hMBG52LBMDyfD8NRJJUaJcEM",
	method: "POST",
	headers: {
		"Content-Type": "application/json"
	}
};
var req = https.request(options, function (res) {
	if (res.statusCode === 200) {
		console.log("Status: " + res.statusCode);
		//console.log('Headers: ' + JSON.stringify(res.headers));
		res.setEncoding("utf8");
		res.on("data", function (body) {
			//console.log('Body: ' + body);
		});
	}
});
req.on("error", function (e) {
	console.log("Problem with request: " + e.message);
});
// write data to request body
req.write('{"text": "Anonymity @ Work is now installed.  Use /anonhelp to learn more."}');
req.end();