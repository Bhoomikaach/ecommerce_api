const { Category } = require('../models');

exports.createCategory = async (req, res) => {
    try {
        const { name, description } = req.body;
        if (!name) {
            return res.status(400).json({ message: 'Category Name is required' });
        }

        const category = await Category.create({ name, description });
        res.status(201).json({ message: 'Category created successfully', category });
    } catch (error) {
        console.error("Error creating category:", error);
        res.status(500).json({ error: error.message });
    }
}

exports.updateCategory = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, description } = req.body;
        const category = await Category.findByPk(id);
        console.log("category", category)
        if (!category) return res.status(404).json({ error: 'Category not found' });

        category.name = name || category.name;
        category.description = description || category.description;
        await category.save();
        res.status(201).json({ message: "Category updated successfully", category });
    } catch (error) {
        console.log("error", error)
        res.status(500).jsom({ error: error.message })
    }
}

exports.deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await Category.findByPk(id);
    if (!category) return res.status(404).json({ error: 'Category not found' });
    await Category.destroy({ where: { id } });

    // if (!deleted) return res.status(404).json({ error: 'Not found' });

    res.json({ message: 'Category deleted', category });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getAllCategories = async (req, res) => {
  try {
    const categories = await Category.findAll();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};