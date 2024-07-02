const jwt = require('jsonwebtoken');
require('dotenv').config();


module.exports = (user, expiresIn = "1y") => {
    const payload = {
        id: user.id,
        username: user.username,
        role: user.role
    }

    return jwt.sign(payload, process.env.JWT_SECRET, { expiresIn })
}