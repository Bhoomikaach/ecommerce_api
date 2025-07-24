const express = require('express');
const { check, param} = require('express-validator');
const {addToCart, getCart, updateCartItem, removeCartItem, clearCart} = require('../controllers/cart.controller');

const { authenticate } = require('../middlewares/auth.middleware');
const validate = require('../middlewares/validate.middleware');

const router = express.Router();

router.use(authenticate);

/**
 * @swagger
 * /api/cart:
 *   post:
 *     summary: Add product to user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - product_id
 *               - quantity
 *             properties:
 *               product_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Product added/updated in cart
 *       400:
 *         description: Invalid input
 *       401:
 *         description: Unauthorized
 */

router.post(
  '/',
  authenticate,
  [
    check('product_id')
      .notEmpty().withMessage('Product ID is required')
      .isInt({ gt: 0 }).withMessage('Product ID must be a positive integer'),
    check('quantity')
      .notEmpty().withMessage('Quantity is required')
      .isInt({ gt: 0 }).withMessage('Quantity must be a positive integer')
  ],
  validate,
  addToCart
);

/**
 * @swagger
 * /api/cart:
 *   get:
 *     summary: Get the authenticated user's cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: User's cart retrieved successfully
 *       401:
 *         description: Unauthorized
 */

router.get('/', authenticate, getCart);

/**
 * @swagger
 * /api/cart/{product_id}:
 *   put:
 *     summary: Update quantity of a product in the cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - quantity
 *             properties:
 *               quantity:
 *                 type: integer
 *     responses:
 *       200:
 *         description: Cart item updated
 *       400:
 *         description: Invalid input
 *       404:
 *         description: Product not found in cart
 */

router.put(
  '/:id',
  authenticate,
  [
    param('id').isInt({ gt: 0 }).withMessage('Cart item ID must be a positive integer'),
    check('quantity')
      .notEmpty().withMessage('Quantity is required')
      .isInt({ gt: 0 }).withMessage('Quantity must be a positive integer')
  ],
  validate,
  updateCartItem
);

/**
 * @swagger
 * /api/cart/{product_id}:
 *   delete:
 *     summary: Remove product from cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: product_id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product removed from cart
 *       404:
 *         description: Product not found in cart
 */

router.delete(
  '/:id',
  authenticate,
  [
    param('id').isInt({ gt: 0 }).withMessage('Cart item ID must be a positive integer')
  ],
  validate,
  removeCartItem
);

/**
 * @swagger
 * /api/cart:
 *   delete:
 *     summary: Clear the user's entire cart
 *     tags: [Cart]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Cart cleared
 */

router.delete(
  '/:id',
  authenticate,
  [
    param('id').isInt({ gt: 0 }).withMessage('Cart item ID must be a positive integer')
  ],
  validate,
  removeCartItem
);

router.delete('/', authenticate, clearCart);

module.exports = router;