const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { User } = require('../models');
require('dotenv').config();

const generateToken = (user) => {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
};

exports.signup = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log("body", req.body)
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }
    const existing_user = await User.findOne({where:{email}});
    if(existing_user){
        return res.status(400).json({message:"Email already in use"});
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({ name, email, password: hashedPassword, role: role || 'customer' });
    // const token = generateToken(user);
    // res.status(201).json({ token });
    res.status(201).json({
        message: "User registered successfully", 
        user:{
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role
        }
    })
  } catch (error) {
    console.log("error", error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if(!email || !password){
        return res.status(401).json({message: "Email and password are required"})
    }
    const user = await User.findOne({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const is_match = await bcrypt.hash(password, user.password)
    if(!is_match){
        return res.status(401).json({ message: 'Invalid credentials' });
    }
    const token = generateToken(user);
    res.status(200).json({ 
        id: user.id, 
        name: user.name,
        email: user.email,
        message: "Login successful", 
        token });
  } catch (error) {
    console.log("error", error)
    res.status(500).json({ error: error.message });
  }
};
