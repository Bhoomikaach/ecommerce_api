const { CartItem, Product } = require('../models');
const { validationResult } = require('../middlewares/validate.middleware')

//add item to cart
exports.addToCart = async (req, res) => {
    //   const errors = validationResult(req);
    //   if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });
    console.log("reqqq", req)
    const { product_id, quantity } = req.body;
    const user_id = req.user.id;

    try {

        const product = await Product.findByPk(product_id);
        if (!product) return res.status(404).json({ message: 'Product not found' });

        const existing = await CartItem.findOne({ where: { user_id, product_id: product.id } });

        if (existing) {
            existing.quantity += quantity;
            // existing.total_price = existing.quantity * product.price;
            await existing.save();
            // return res.json({ message: 'Cart updated', item: existing });
            return res.json({
                message: 'Cart updated',
                item: {
                    ...existing.toJSON(),
                    subtotal: existing.quantity * product.price // add subtotal for clarity
                }
            });
        }

        const newItem = await CartItem.create({
            user_id,
            product_id,
            quantity,
            price: product.price,
            image_url: product.image_url
        });

        res.status(201).json({ message: 'Added to cart', item: newItem });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// get cart items
exports.getCart = async (req, res) => {
    const user_id = req.user.id;

    try {
        const cartItems = await CartItem.findAll({
            where: { user_id },
            include: [{ model: Product, attributes: ['name', 'price', 'image_url'] }]
        });

        let totalItems = 0;
        let totalAmount = 0;

        // const cart = cartItems.map(item => ({
        //   id: item.id,
        //   product_id: item.product_id,
        //   name: item.Product?.name,
        //   price: item.price,
        //   quantity: item.quantity,
        //   total_price: item.price * item.quantity,
        //   image_url: item.image_url
        // }));

        // const grandTotal = cart.reduce((acc, item) => acc + item.total_price, 0);

        // res.json({ cart, grandTotal });
        const items = cartItems.map(item => {
            const quantity = item.quantity;
            const price = item.price;
            const subtotal = price * quantity;

            totalItems += quantity;
            totalAmount += subtotal;

            return {
                product_id: item.product_id,
                name: item.Product.name,
                image: item.Product.image_url,
                price,
                quantity,
                subtotal
            };
        });

        res.json({ items, totalItems, totalAmount });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

// update cart item
exports.updateCartItem = async (req, res) => {
    const { id } = req.params;
    const { quantity } = req.body;
    const user_id = req.user.id;

    try {
        const item = await CartItem.findOne({ where: { id, user_id } });

        if (!item) return res.status(404).json({ message: 'Cart item not found' });

        item.quantity = quantity;
        await item.save();

        res.json({ message: 'Cart item updated', item });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};


exports.removeCartItem = async (req, res) => {
    const { id } = req.params;
    const user_id = req.user.id;

    try {
        const item = await CartItem.findOne({ where: { id, user_id } });

        if (!item) return res.status(404).json({ message: 'Item not found in cart' });

        await item.destroy();

        res.json({ message: 'Item removed from cart', item });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};

exports.clearCart = async (req, res) => {
    const user_id = req.user.id;

    try {
        await CartItem.destroy({ where: { user_id } });
        res.json({ message: 'Cart cleared' });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Server error' });
    }
};