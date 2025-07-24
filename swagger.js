// swagger.js
const swaggerJsDoc = require('swagger-jsdoc');
// const swaggerUi = require('swagger-ui-express');

const options = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'E-Commerce REST API',
            version: '1.0.0',
            description: 'API for E-Commerce Backend using Node.js, Express & Sequelize',
        },
        servers: [
            { url: 'http://localhost:5000/api-docs' }
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: 'http',
                    scheme: 'bearer',
                    bearerFormat: 'JWT',
                },
            },
        },
        security: [{ bearerAuth: [] }],
    },
    apis: ['./routes/**/*.js']
};

const swaggerSpec = swaggerJsDoc(options);

// const swaggerDocs = (app) => {
//     app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
// };

module.exports = swaggerSpec;
