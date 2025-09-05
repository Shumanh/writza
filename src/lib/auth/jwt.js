import jwt from 'jsonwebtoken';
const JWT_SECRET = process.env.JWT_SECRET;

export function generateToken(user) {
    const payload = {
        id: user._id,
        email: user.email,
        username: user.username
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: '7d' });
}

export function verifyToken(token) {
    try {
        return jwt.verify(token, JWT_SECRET);
    } catch (error) {
        return null;
    }
}