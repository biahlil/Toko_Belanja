const { User } = require('../models');
const { verifyToken } = require('../helpers/jwt');

function authRole(req, res, next) {
    try {
        const token = req.get('token');
        const userDecoded = verifyToken(token);

        User.findOne({
            where: {
                id: userDecoded.id,
                email: userDecoded.email
            } 
        })
        .then(user => {
            if (user.role !== 'admin') {
                return res.status(403).json({
                    name: 'Authentication Error',
                    devMessage: "Forrbiden you can't acces this page."
                })
            }
            res.locals.user = user;
            return next();
        })
        .catch (err => {
            res.status(500).json(err);
        })
    }
    catch (err) {
        return res.status(403).json(err);
    }
}

module.exports = authRole;