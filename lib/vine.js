var request = require("request"),
	querystring = require("querystring"),
	BASE_URL = "https://api.vineapp.com/",
	headers = {
		"User-Agent": "com.vine.iphone/1.0.3 (unknown, iPhone OS 6.0.1, iPhone, Scale/2.000000)",
		"Accept-Language": "en, sv, fr, de, ja, nl, it, es, pt, pt-PT, da, fi, nb, ko, zh-Hans, zh-Hant, ru, pl, tr, uk, ar, hr, cs, el, he, ro, sk, th, id, ms, en-GB, ca, hu, vi, en-us;q=0.8",
		"Accept": "application/json",
		"Content-Type": "application/x-www-form-urlencoded"
	},
	slice = Array.prototype.slice;

function make_request(endpoint, data, callback) {

	var req = {
		uri: BASE_URL + endpoint,
		method: (data ? "POST" : "GET"),
		headers: headers
	};

	if (data) {
		req.body = querystring.stringify(data);
	}

	request(req, handle_response(callback));
}

function handle_response(callback) {
	return function(error, response, body) {
		var code, message;
		if (response && response.statusCode > 400) {
			code = response.statusCode;
			message = "HTTP Error Code " + code + " was returned.";
		}
		if (body) {
			try {
				body = JSON.parse(body);
			} catch (e) {
				message = "Response from Vine API is malformed.";
			}
		} else {
			message = "No response from Vine API was received.";
		}

		return callback(error, body.data);
	};
}

module.exports = {

	login: function(username, password, callback) {
		make_request("users/authenticate", {
			username: username,
			password: password,
		}, function(error, response) {
			// Set session key for subsequent requests
			headers["vine-session-id"] = response.key;
			callback(error, response);
		});
	},

	popular: function(callback) {
		make_request("timelines/popular", null, callback);
	}
};