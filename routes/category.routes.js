const express = require('express');
const { createCategory, getAllCategories, updateCategory, deleteCategory } = require('../controllers/category.controller');
const { authenticate, authorizeRoles } = require('../middlewares/auth.middleware');
const { check, validationResult } = require('express-validator');
const router = express.Router();

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

// router.post('/', authenticate, authorizeRoles('admin'), createCategory);
// router.get('/', getAllCategories);
// router.put('/:id', authenticate, authorizeRoles('admin'), updateCategory);
// router.delete('/:id', authenticate, authorizeRoles('admin'), deleteCategory);


/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201:
 *         description: Category created successfully
 *       400:
 *         description: Invalid input
 */

router.post(
  '/',
  authenticate,
  authorizeRoles('admin'),
  [check('name').notEmpty().withMessage('Name is required')],
  validate,
  createCategory
);

/**
 * @swagger
 * /api/categories/{id}:
 *   put:
 *     summary: Update a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the category to update
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Category updated successfully
 *       404:
 *         description: Category not found
 */

router.put(
  '/:id',
  authenticate,
  authorizeRoles('admin'),
  [
    check('name')
      .optional()
      .notEmpty()
      .withMessage('If provided, name must not be empty'),
  ],
  validate,
  updateCategory
);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200:
 *         description: A list of categories
 */
router.get('/', getAllCategories);

/**
 * @swagger
 * /api/categories/{id}:
 *   delete:
 *     summary: Delete a category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: ID of the category to delete
 *     responses:
 *       200:
 *         description: Category deleted successfully
 *       404:
 *         description: Category not found
 */

router.delete('/:id', authenticate, authorizeRoles('admin'), deleteCategory);

module.exports = router;