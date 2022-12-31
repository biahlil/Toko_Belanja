const { User } = require('../models');
const bcrypt = require('bcrypt');
const {generateToken, getPayloadId} = require('../helpers/jwt');

class UserController {

    static register(req,res) {
        let { full_name,email,password,gender } = req.body;
        User.create({ 
            full_name: full_name,
            email: email,
            password: password,
            gender: gender,
            role: "customer",
            balance: 0
        })
        .then(result => {
            let response ={
                User: {
                    id: result.id,
                    full_name: result.full_name,
                    email: result.email,
                    gender: result.gender,
                    balance: result.balance,
                    createdAt: result.createdAt                
                }
            }
            res.status(201).json(response);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    }

    static login(req, res) {
        let { email, password } = req.body;
        User.findOne({
            where: {email}
        })
        .then(user => {
            let isCorrect = bcrypt.compareSync(password, user.password);
            if (email != user.email) {
                let handlerror = {
                    name: 'User Login Failed',
                    devMessage: 'User password with email ' + user.email + ' does not match'
                }
                throw handlerror;
            }
            if(!isCorrect) {
                let handlerror = {
                    name: 'User Login Failed',
                    devMessage: 'User password with email ' + user.email + ' does not match'
                }
                throw handlerror;
            }
            let payload = {
                id: user.id,
                email: user.email
            }
            let token = generateToken(payload);
            let output = {
                token: token
            }
            return res.status(200).json(output);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    }

    static update(req, res) {
        const idToken = getPayloadId(req.get('token'));
        const id = +req.params.userId;
        try {
            if (idToken != id) {
                let handlerror = {message: "You cannot edit other people's accounts"};
                throw handlerror;
            }    
            const {full_name,email} = req.body;
            let data = {
                full_name: full_name,
                email: email
            };
            User.update(
                data,{
                    where:{id},
                    returning: true
                }
            )
            .then(result => {
                let response ={
                    User: {
                        id: result[1][0].id,    
                        full_name: result[1][0].full_name,
                        email: result[1][0].email,
                        createdAt: result[1][0].createdAt,                
                        updatedAt: result[1][0].updatedAt
                    }
                }            
                res.status(200).json(response);
            })
            .catch(err => {
                let handlerror = {
                    path: err.path,
                    type: err.type,
                    message: err.message
                }
                res.status(500).json(handlerror);
            })
        } catch (error) {
            res.status(500).json(error);
        }
    }

    static delete(req, res) {
        const idToken = getPayloadId(req.get('token'));
        const id = +req.params.userId;
        try {
            if (idToken != id) {
                let handlerror = {message: "You cannot delete other people's accounts"};
                throw handlerror;
            }
            User.destroy({
                where: {
                  id: id
                }
              })
              .then(result => {
                let response ={
                    message: 'Your account has been successfully deleted'
                }            
                res.status(200).json(response);
            })
            .catch(err => {
                let handlerror = {
                    path: err.errors[0].path,
                    type: err.errors[0].type,
                    message: err.message
                }
                res.status(500).json(handlerror);
                })
        } catch (err) {
            res.status(500).json(err);
        }
    }

    static topup(req, res) {
        const id = getPayloadId(req.get('token'));
        const {balance} = req.body;
        let data = {
            balance: balance
        };
        User.update(
            data,{
                where:{id},
                returning: true
            }
        )
        .then(result => {
            let response ={
                message: "Your balance has been successfully updated to " + "Rp"+ result[1][0].balance.toLocaleString('id-JD') + ",00"
            }            
            res.status(200).json(response);
        })
        .catch(err => {
            let handlerror = {
                path: err.path,
                type: err.type,
                message: err.message
            }
            res.status(500).json(handlerror);
        })
    }
}
module.exports = UserController;