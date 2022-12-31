const { Product,Category } = require('../models');

class ProductController {

    static add(req,res) {
        let { title,price,stock,CategoryId } = req.body;
        Product.create({ 
            title: title,
            price: price,
            CategoryId: CategoryId,
            stock: stock
            
        })
        .then(result => {
            let response ={
                product: {
                    id: result.id,
                    title: result.title,
                    price: result.price,
                    stock: result.stock,
                    CategoryId: result.CategoryId,
                    createdAt: result.createdAt,                
                    updatedAt: result.updatedAt
                }
            }
            res.status(201).json(response);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    }

    static getAll(req, res) {
        Product.findAll()
        .then(result => {
            let responses = {
                products: result
            }
            res.status(200).json(responses);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    }

    static putUpdate(req, res) {
        const id = +req.params.productId;
        let { title,price,stock } = req.body;
        let data = {
            title: title,
            price: price,
            stock: stock
        };
        Product.update(
            data,{
                where:{id},
                individualHooks: true,
                returning: true
            }
        )
        .then(result => {
            let response ={
                product: {
                    id: result[1][0].id,    
                    title: result[1][0].title,
                    price: result[1][0].price,
                    stock: result[1][0].stock,
                    createdAt: result[1][0].createdAt,                
                    updatedAt: result[1][0].updatedAt
                }
            }            
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            let handlerror = {
                path: err.path,
                type: err.type,
                message: err.message
            }
            res.status(500).json(handlerror);
        })
    }
    
    static delete(req, res) {
        const id = +req.params.productId;
        Product.destroy({
            where: {
              id: id
            }
          })
          .then(result => {
            let response ={
                message: 'Product has been successfully deleted'
            }            
            res.status(200).json(response);
        })
        .catch(err => {
            let handlerror = {
                path: err.errors[0].path,
                type: err.errors[0].type,
                message: err.message
            };
            res.status(500).json(handlerror);
        });
    }

    static patchUpdate(req, res) {
        const id = +req.params.productId;
        let { CategoryId } = req.body;
        let data = {
            CategoryId: CategoryId
        };
        Product.update(
            data,{
                where:{id},
                returning: true
            }
        )
        .then(result => {
            let response ={
                product: {
                    id: result[1][0].id,    
                    title: result[1][0].title,
                    price: result[1][0].price,
                    stock: result[1][0].stock,
                    CategoryId: result[1][0].CategoryId,
                    createdAt: result[1][0].createdAt,                
                    updatedAt: result[1][0].updatedAt
                }
            }            
            res.status(200).json(response);
        })
        .catch(err => {
            console.log(err);
            let handlerror = {
                path: err.path,
                type: err.type,
                message: err.message
            }
            res.status(500).json(handlerror);
        })
    }

}
module.exports = ProductController;