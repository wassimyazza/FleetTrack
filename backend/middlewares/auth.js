import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const auth = async (req, res, next) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    
    if (!token) {
        return res.status(401).json({ message: "Access denied" });
    }
    
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
        const user = await User.findById(decoded.id);
        
        if (!user) {
            return res.status(401).json({ message: "Invalid token" });
        }
        
        req.user = {
            id: user._id.toString(),
            email: user.email,
            role: user.role
        };
        
        next();
    } catch (error) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

export default auth;