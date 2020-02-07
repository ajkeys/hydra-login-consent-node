var fetch = require('node-fetch')
var querystring = require('querystring');

var membershipUrl = process.env.MEMBERSHIP_URL
var membershipKey = process.env.MEMBERSHIP_KEY

// A little helper that takes type (can be "login" or "consent") and a challenge and returns the response from ORY Hydra.
function get(sessionToken) {
  const url = new URL('/members', membershipUrl)
  url.search = querystring.stringify({ 'apikey': membershipKey })

  var headers = {
    'MEMBERSHIP-SESSION-TOKEN': sessionToken
  }

  return fetch(url.toString(), { method: 'GET', headers: headers })
    .then(function (res) {
      if (res.status < 200 || res.status > 302) {
        // This will handle any errors that aren't network related (network related errors are handled automatically)
        return res.json().then(function (body) {
          console.error('An error occurred while making a HTTP request: ', body)
          return Promise.reject(new Error(body.error.message))
        })
      }

      return res.json();
    });
}

var membership = {
  // Fetches information on a login request.
  getMember: function (sessionToken) {
    return get(sessionToken);
  },
};

module.exports = membership;
