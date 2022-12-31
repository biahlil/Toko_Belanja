const { Category,Product } = require('../models');

class CategoryController {

    static add(req,res) {
        let { type } = req.body;
        Category.create({ 
            type: type
        })
        .then(result => {
            let response ={
                category: {
                    id: result.id,
                    type: result.type,
                    updatedAt: result.updatedAt,
                    createdAt: result.createdAt,                
                    sold_product_amount: result.sold_product_amount
                }
            }
            res.status(201).json(response);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    }

    static getAll(req, res) {
        Category.findAll(
            {include: [Product]}
            )
        .then(result => {
            let responses = {
                categories: result
            }
            res.status(200).json(responses);
        })
        .catch(err => {
            res.status(500).json(err);
        })
    }

    static update(req, res) {
        const id = +req.params.categoryId;
        const {type} = req.body;
        let data = {
            type: type
        };
        Category.update(
            data,{
                where:{id},
                returning: true
            }
        )
        .then(result => {
            let response ={
                category: {
                    id: result[1][0].id,    
                    type: result[1][0].type,
                    sold_product_amount: result[1][0].sold_product_amount,
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
        const id = +req.params.categoryId;
        Category.destroy({
            where: {
              id: id
            }
          })
          .then(result => {
            let response ={
                message: 'Category has been successfully deleted'
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
}
module.exports = CategoryController;