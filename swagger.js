const swaggerAutogen = require('swagger-autogen')();

const doc = {
  info: {
    title: 'Data management API',
    description: 'Swagger API for CSE341 student Camden'
  },
  host: 'localhost:8080/api-docs',
  schemes: ['http']
};

const outputFile = './swagger.json';
const routes = ['./routes/index.js'];

/* NOTE: If you are using the express Router, you must pass in the 'routes' only the 
root file where the route starts, such as index.js, app.js, routes.js, etc ... */

swaggerAutogen(outputFile, routes, doc);