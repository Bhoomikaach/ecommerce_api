const express = require('express');
const { authenticate, authorizeRoles } = require('../middlewares/auth.middleware');
const { placeOrder, getMyOrders, getAllOrders, getOrderbyId } = require('../controllers/order.controller');

const router = express.Router();

/**
 * @swagger
 * /api/orders:
 *   post:
 *     summary: Place a new order from the user's cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               shipping_address:
 *                 type: string
 *                 example: "123 Main St, City, Country"
 *     responses:
 *       201:
 *         description: Order placed successfully
 *       400:
 *         description: Cart is empty or invalid request
 *       401:
 *         description: Unauthorized
 */

// Customer routes
router.post('/place_order', authenticate, placeOrder);


/**
 * @swagger
 * /api/orders:
 *   get:
 *     summary: Get all orders placed by the authenticated user
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user's orders
 *       401:
 *         description: Unauthorized
 */

router.get('/my_orders', authenticate, getMyOrders);


/**
 * @swagger
 * /api/orders/all:
 *   get:
 *     summary: Get all orders (admin only)
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all orders
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden – Admins only
 */

// Admin routes
router.get('/', authenticate, authorizeRoles('admin'), getAllOrders);

/**
 * @swagger
 * /api/orders/{id}:
 *   get:
 *     summary: Get a specific order by its ID
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Order details
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Order not found
 */
router.get('/:id', authenticate, getOrderbyId);

module.exports = router;
