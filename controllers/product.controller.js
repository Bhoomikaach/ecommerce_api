const { where } = require('sequelize');
const { Product, Category, Sequelize } = require('../models');
const { Op } = Sequelize;

exports.createProduct = async(req, res) => {
  try {
    const { name, description, price, stock, category_id } = req.body;
    // const imageUrl = req.body.image_url || '';
    const image_url = req.file?.path; 
    console.log("req.file", req.file);
    const product = await Product.create({ name, description, price, stock, category_id, image_url });
    res.status(201).json(product);
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
};

exports.getAllProducts = async (req, res) => {
  try {
    const {category, min_price, max_price, product_name, page=1, limit=10} = req.query;
    console.log("query", req.query);
    const where ={};
    if(category){
        where.category_id = category;
    }

    if (min_price || max_price) {
      where.price = {};
      if (min_price) where.price[Op.gte] = parseFloat(min_price);
      if (max_price) where.price[Op.lte] = parseFloat(max_price);
    }

    if (product_name) {
      where.name = { [Op.iLike]: `%${product_name}%`};
    }

    const offset = (parseInt(page) - 1) * parseInt(limit);

    const products = await Product.findAndCountAll({
      where,
      include: [{ model: Category }],
      offset,
      limit: parseInt(limit),
      order: [['created_at', 'DESC']]
    });

    res.json({
      total_items: products.count,
      total_pages: Math.ceil(products.count / limit),
      current_page: parseInt(page),
      products: products.rows
    });

    // const products = await Product.findAll({ include: Category });
    res.json(products);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getProductById = async (req, res) => {
  try {
    const {id} = req.params;
    console.log("query", req.params);

    const product = await Product.findByPk(id,{include: [{model: Category}]});
    console.log("productfsvd", product);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    res.status(201).json({product});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, price, stock, category_id } = req.body;

    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    product.image_url = req.file?.path || product.image_url;
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.stock = stock || product.stock;
    product.categoryId = category_id || product.category_id;
    // product.imageUrl = image_url || product.image_url;
    await product.save();

    res.json(product);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const product = await Product.findByPk(id);
    if (!product) return res.status(404).json({ error: 'Product not found' });
    const deleted = await Product.destroy({ where: { id } });
    // if (!deleted) return res.status(404).json({ error: 'Not found' });
    res.json({ message: 'Product deleted', product });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
