const express = require('express');
const bodyParser = require('body-parser');
const mongodb = require('./db/connect');
const nJwt = require('njwt');
const secretKey = process.env.SECRET;
const port = process.env.PORT || 8080;
const app = express();
const swaggerUi = require('swagger-ui-express');
const swaggerDocument = require('./swagger.json');
const { auth, requiredScopes } = require('express-oauth2-jwt-bearer');

    // Authorization middleware. When used, the Access Token must
    // exist and be verified against the Auth0 JSON Web Key Set.
    const checkJwt = auth({
      tokenSigningAlg: "HS256",
      audience: process.env.CLIENT_ID,
      issuerBaseURL: process.env.ISSUER_BASE_URL
    });

    // This route doesn't need authentication
    app.get('/api/public', function(req, res) {
      res.json({
message: 'Hello from a public endpoint! You don\'t need to be authenticated to see this.'
      });
    });

    // This route needs authentication
    app.get('/api/private', checkJwt, function(req, res) {
      res.json({
message: 'Hello from a private endpoint! You need to be authenticated to see this.'
      });
    });

    const checkScopes = requiredScopes('read:messages');

    app.get('/api/private-scoped', checkJwt, checkScopes, function(req, res) {
      res.json({
message: 'Hello from a private endpoint! You need to be authenticated and have a scope of read:messages to see this.'
      });
    });

app
  .use(bodyParser.json())
  .use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader(
      'Access-Control-Allow-Headers',
      'Origin, X-Requested-With, Content-Type, Accept, Z-Key'
    );
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    next();
  })
  .use('/', require('./routes'));

/*
const db = require('./models');
db.mongoose
  .connect(db.url, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  })
  .then(() => {
    app.listen(port, () => {
      console.log(`DB Connected and server running on ${port}.`);
    });
  })
  .catch((err) => {
    console.log('Cannot connect to the database!', err);
    process.exit();
  });
*/

mongodb.initDb((err, mongodb) => {
  if (err) {
    console.log(err);
  } else {
    app.listen(port);
    console.log(`Connected to DB and listening on ${port}`);
  }
});

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));