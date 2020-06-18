const express = require('express');
const path = require('path');
const app = express();
const fs = require('fs');

var bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({
  extended: true
}));

var saml2 = require('saml2-js');

// Create service provider
var sp_options = {
  entity_id: "https://localhost:5000/api/saml/metadata.xml",
  private_key: fs.readFileSync("certs/saml/sp/sp_private.key").toString(),
  certificate: fs.readFileSync("certs/saml/sp/sp_certificate.crt").toString(),
  assert_endpoint: "https://localhost:5000/api/saml/assert",
  allow_unencrypted_assertion: true
};
var sp = new saml2.ServiceProvider(sp_options);

// Create identity provider
var idp_options = {
  relay_state: "relay_state_test",
  sso_login_url: "http://localhost:8282/login.php",
  sso_logout_url: "http://localhost:8282/logout.php",
  certificates: [fs.readFileSync("certs/saml/idp/cert.pem").toString()]
};
var idp = new saml2.IdentityProvider(idp_options);

const PORT = process.env.PORT || 5000;

app
  .use(express.static(path.join(__dirname, '/build')))
  .listen(PORT, () => console.log(`Listening on ${PORT}`));

// Saml related paths

// Endpoint to retrieve metadata
app.get("/api/saml/metadata.xml", function(req, res) {
  console.log('metadata');
  res.type('application/xml');
  res.send(sp.create_metadata());
});

// Starting point for login
app.get("/api/saml/login", function(req, res) {
  sp.create_login_request_url(idp, {}, function(err, login_url, request_id) {
    if (err != null)
      return res.send(500);
    res.redirect(login_url);
  });
});

// Assert endpoint for when login completes
app.post("/api/saml/assert", function(req, res) {
  var options = {request_body: req.body};
  sp.post_assert(idp, options, function(err, saml_response) {
    if (err != null)
      return res.status(500);

    console.log(saml_response);
    // Save name_id and session_index for logout
    // Note:  In practice these should be saved in the user session, not globally.
    name_id = saml_response.user.name_id;
    session_index = saml_response.user.session_index;

    res.send(`Hello ${saml_response.user.name_id}!`);
  });
});

// Starting point for logout
app.get("/api/saml/logout", function(req, res) {
  var options = {
    name_id: name_id,
    session_index: session_index
  };

  sp.create_logout_request_url(idp, options, function(err, logout_url) {
    if (err != null)
      return res.send(500);
    res.redirect(logout_url);
  });
});

// Proxy api calls
app.get('/api/*', (req, res) => {
  // Add actual implementation for api calls.
  res.status(200).json({message: 'express server output'});
});

// Serve react app.
app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, '/build/index.html'));
});

