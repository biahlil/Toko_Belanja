const { TransactionHistory,Product,User,Category,sequelize } = require('../models');
const {generateToken, getPayloadId} = require('../helpers/jwt');

class TransactionController {

    static async add(req,res) {
        let transaction;
        try {
            const UserId = getPayloadId(req.get('token'));
            let { ProductId,quantity } = req.body;
            transaction = await sequelize.transaction();
            
            const getProduct = await Product.findByPk(ProductId, {hooks: false});
            const getUser = await User.findByPk(UserId);
            const getCategory = await Category.findByPk(getProduct.CategoryId);

            if (!getProduct) {
                let handlerror = ('Product you requested not found'); 
                throw handlerror;
            }
            if (getProduct.stock < quantity) {
                let handlerror = ('Product in stock is lower than you requested'); 
                throw handlerror;
            }
            
            let total_price = getProduct.price * quantity;

            if (getUser.balance < total_price) {
                let handlerror = ('Your balance is lower than your total price'); 
                throw handlerror;
            }

            const transactionAdd = await TransactionHistory.create({ 
                ProductId: ProductId,
                UserId: UserId,
                total_price: total_price,
                quantity: quantity
            }, { transaction });
            const id = +transactionAdd.id;

            const productStockUpdate = await Product.update({
                stock: getProduct.stock - quantity
            }, { 
                where:{id : ProductId},
                returning: true,
                transaction 
            });

            const userBalanceUpdate = await Product.update({
                balance: getUser.balance - total_price
            }, { 
                where:{id : UserId},
                returning: true,
                transaction 
            });
            
            const categoryBalanceUpdate = await Category.update({
                sold_product_amount: getCategory.sold_product_amount + quantity
            }, { 
                where:{id : getProduct.CategoryId},
                returning: true,
                transaction 
            });


            await transaction.commit(); 

            const result = await TransactionHistory.findOne(
                {
                    where: {id: id},
                    include: [Product]
                });
            
            
            let response ={
                message: "You have successfully purchased the product",
                transactionBill: {
                    total_price: result.total_price,
                    quantity: result.quantity,
                    product_name: result.Product.title
                }
            }
            res.status(200).json(response);

    
        } catch (Error) {
            console.log(Error);
            if(transaction) {
               await transaction.rollback();
            }
            res.status(500).json(Error);
        }
    }

    static getAllUser(req, res) {
        const UserId = getPayloadId(req.get('token'));
        TransactionHistory.findAll(
            {
                where: {UserId},
                include: [Product]
            }
            )
        .then(result => {

            let responses = {
                transactionHistories: result
            }
            res.status(200).json(responses);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    }
    
    // static getAll(req, res) {
        // Category.findAll(
            // {include: [Product]}
            // )
        // .then(result => {
            // let responses = {
                // categories: result
            // }
            // res.status(200).json(responses);
        // })
        // .catch(err => {
            // res.status(500).json(err);
        // })
    // }

    static getAll(req, res) {
        const UserId = getPayloadId(req.get('token'));
        TransactionHistory.findAll(
            {
                include: [Product,User]
            }
            )
        .then(result => {
            console.log(result);
            let responses = {
                transactionHistories: result
            }
            res.status(200).json(responses);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    }

    static getByID(req, res) {
        const id = +req.params.transactionId;
        TransactionHistory.findOne({
            where: {id}
            // include: [Product]
        })
        .then(result => {
            let responses = {
                transactionHistories: result
            }
            res.status(200).json(responses);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    }
    
}
module.exports = TransactionController;