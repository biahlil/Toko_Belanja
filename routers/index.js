const router = require('express').Router();
const authToken = require('../middlewares/authToken');
const authRole = require('../middlewares/authRole');
const UserController = require('../controllers/userController');
const CategoryController = require('../controllers/categoryController');
const ProductController = require('../controllers/productController');
const TransactionController = require('../controllers/transactionController');


router.post('/users/register',UserController.register);
router.post('/users/login',UserController.login);

router.use(authToken);
router.put('/users/:userId',UserController.update);
router.delete('/users/:userId',UserController.delete);
router.patch('/users/topup',UserController.topup);

router.get('/products',ProductController.getAll);
router.post('/transactions',TransactionController.add);
router.get('/transactions/user',TransactionController.getAllUser);
router.get('/transactions/:transactionId',TransactionController.getByID);

router.use(authRole);
router.post('/categories',CategoryController.add);
router.get('/categories',CategoryController.getAll);
router.patch('/categories/:categoryId',CategoryController.update);
router.delete('/categories/:categoryId',CategoryController.delete);

router.post('/products',ProductController.add);
router.put('/products/:productId',ProductController.putUpdate);
router.patch('/products/:productId',ProductController.patchUpdate);
router.delete('/products/:productId',ProductController.delete);

router.get('/transactions/admin',TransactionController.getAll);
router.post('/transactions/admin',TransactionController.getAll);


module.exports = router;