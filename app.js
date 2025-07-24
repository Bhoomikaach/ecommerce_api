const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
require('dotenv').config();
const swaggerUi = require('swagger-ui-express');
// const swaggerSpec = require('./swagger/swaggerConfig');

const swaggerDocs = require('./swagger');


const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

// swaggerDocs(app);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

const authRoutes = require('./routes/auth.routes');
app.use('/api/auth', authRoutes);

const categoryRoutes = require('./routes/category.routes')
app.use('/api/categories', categoryRoutes )

const productRoutes = require('./routes/product.routes');
app.use('/api/products', productRoutes);

const cartRoutes = require('./routes/cart.routes');
app.use('/api/cart', cartRoutes);

const orderRoutes = require('./routes/order.routes');
app.use('/api/order', orderRoutes);

module.exports = app;
