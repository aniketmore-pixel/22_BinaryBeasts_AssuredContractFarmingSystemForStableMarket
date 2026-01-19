const User = require('../models/User');
const { generateToken } = require('../utils/jwt');
const { validateRegister, validateLogin } = require('../utils/validators');

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
    try {
        const { name, email, password, role, phone, location } = req.body;

        const validation = validateRegister(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ status: "error", message: validation.errors[0], errors: validation.errors });
        }

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ status: "error", message: "User already exists" });
        }

        const user = await User.create({
            name,
            email,
            password,
            role,
            phone,
            location
        });

        const token = generateToken(user._id, user.role);

        res.status(201).json({
            status: "success",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        const validation = validateLogin(req.body);
        if (!validation.isValid) {
            return res.status(400).json({ status: "error", message: validation.errors[0] });
        }

        const user = await User.findOne({ email }).select('+password');
        if (!user || !(await user.comparePassword(password))) {
            return res.status(401).json({ status: "error", message: "Invalid credentials" });
        }

        const token = generateToken(user._id, user.role);

        res.status(200).json({
            status: "success",
            token,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });
    } catch (error) {
        next(error);
    }
};

// @desc    Get current user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
    try {
        // req.user is attached by protect middleware
        const user = await User.findById(req.user.id);

        res.status(200).json({
            status: "success",
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                role: user.role,
                phone: user.phone,
                location: user.location
            }
        });
    } catch (error) {
        next(error);
    }
};
