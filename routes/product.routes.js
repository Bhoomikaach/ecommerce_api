/**
 * @swagger
 * tags:
 *   name: Products
 *   description: Product management
 */


const express = require('express');
const { check, validationResult } = require('express-validator');
const { createProduct, getAllProducts, updateProduct, deleteProduct, getProductById } = require('../controllers/product.controller');
const { authenticate, authorizeRoles } = require('../middlewares/auth.middleware');

const upload = require('../middlewares/upload.middleware');

const router = express.Router();


const validate = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty())
        return res.status(400).json({ errors: errors.array() });
    next();
};



/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - description
 *               - price
 *               - category_id
 *               - quantity
 *             properties:
 *               name:
 *                 type: string
 *               description:
 *                 type: string
 *               price:
 *                 type: number
 *               category_id:
 *                 type: integer
 *               quantity:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: Product created successfully
 *       400:
 *         description: Validation error
 */

//admin
router.post(
    '/',
    authenticate,
    authorizeRoles('admin'),
    upload.single('image'),
    [
        check('name').notEmpty().withMessage('Name is required'),
        check('price')
            .notEmpty()
            .withMessage('Price is required')
            .isFloat({ gt: 0 })
            .withMessage('Price must be a number greater than 0'),
        check('stock')
            .notEmpty()
            .withMessage('Stock is required')
            .isInt({ min: 0 })
            .withMessage('Stock must be a non-negative integer'),
        check('category_id')
            .notEmpty()
            .withMessage('Category ID is required')
            .isInt()
            .withMessage('Category ID must be an integer'),
    ],
    validate,
    createProduct
);


/**
 * @swagger
 * /api/products/{id}:
 *   put:
 *     summary: Update a product
 *     tags: [Products]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the product to update
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               price:
 *                 type: number
 *               stock:
 *                 type: integer
 *               category_id:
 *                 type: integer
 *               image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Product updated successfully
 *       404:
 *         description: Product not found
 */

//update
router.put(
    '/:id',
    authenticate,
    authorizeRoles('admin'),
    upload.single('image'),
    [
        check('name').optional().notEmpty().withMessage('Name cannot be empty'),
        check('price')
            .optional()
            .isFloat({ gt: 0 })
            .withMessage('Price must be a number greater than 0'),
        check('stock')
            .optional()
            .isInt({ min: 0 })
            .withMessage('Stock must be a non-negative integer'),
        check('category_id')
            .optional()
            .isInt()
            .withMessage('Category ID must be an integer'),
    ],

    validate,
    updateProduct
);



/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     tags: [Products]
 *     responses:
 *       200:
 *         description: List of all products
 */

//get
router.get('/', getAllProducts);


/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     tags: [Products]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Product data
 *       404:
 *         description: Product not found
 */
router.get('/:id', authenticate, getProductById);

// router.get('/',
//   (req, res, next) => {
//     if (req.query.id) {
//       return getProductById(req, res, next);
//     }
//     next();
//   },
//   getAllProducts
// );


/**
 * @swagger
 * /api/products/{id}:
 *   delete:
 *     summary: Delete a product
 *     tags: [Products]
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
 *         description: Product deleted
 *       404:
 *         description: Product not found
 */

router.delete('/:id', authenticate, authorizeRoles('admin'), deleteProduct);

module.exports = router;
