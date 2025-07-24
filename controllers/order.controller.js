const { CartItem, Order, OrderItem, Product } = require('../models');

exports.placeOrder = async (req, res) => {
  const userId = req.user.id;

  try {
    const cartItems = await CartItem.findAll({
      where: { user_id: userId },
      include: [Product]
    });
    console.log("cartitems", cartItems)

    if (!cartItems.length) return res.status(400).json({ message: 'Cart is empty' });

   const totalPrice = cartItems.reduce((sum, item) => {
      return sum + item.price * item.quantity;
    }, 0);

    // cartItems.forEach(item => {
    //   totalAmount += item.price * item.quantity;
    // });

    const order = await Order.create({
      user_id: userId,
      total_price: totalPrice,
    });

    const orderItems = cartItems.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.price,
    //   image_url: item.image_url
    }));



    await OrderItem.bulkCreate(orderItems);

    await CartItem.destroy({ where: { user_id: userId } });

    res.status(201).json({ message: 'Order placed successfully', order_id: order.id, orderItems, totalAmount: totalPrice.toFixed(2), });
  } catch (err) {
    console.error('Order placement Error:', err);
    res.status(500).json({ message: 'Checkout failed' });
  }
};

exports.getMyOrders = async (req, res) => {
  const userId = req.user.id;
  const orders = await Order.findAll({
    where: { user_id: userId },
    include: [{ model: OrderItem, include: ['Product'] }]
  });
  res.json(orders);
};

exports.getAllOrders = async (req, res) => {
  const orders = await Order.findAll({
    include: [{ model: OrderItem, include: ['Product'] }]
  });
  res.json(orders);
};


exports.getOrderbyId = async (req, res) => {
  try {
    const {id} = req.params;
    console.log("query", req.params);

    const order = await Order.findByPk(id,{include: [{model: OrderItem, include: ['Product']}]});
    console.log("productfsvd", order);
    if (!Order) return res.status(404).json({ error: 'Order not found' });

    res.status(201).json({order});

  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};