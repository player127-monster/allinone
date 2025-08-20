const express=require('express');
const { newOrder, getSingleOrder, myOrders, orders, updateOrder, deleteOrder } = require('../controllers/orderController');
const {isAuthenticatedUser, authorizedRoles} = require('../middlewares/authenticate');

const router = express.Router();


//Create new order ---- api/v1/order/new
router.route('/order/new').post(isAuthenticatedUser,newOrder);

//Create single order ---- api/v1/order/:id
router.route('/order/:id').get(isAuthenticatedUser,getSingleOrder);

//get loged in user orders -------- api/v1/myorder
router.route('/myorders').get(isAuthenticatedUser,myOrders);

//==============admin routes==========

// admin - get all orders  --------api/v1/orders
router.route('/admin/orders').get(isAuthenticatedUser,authorizedRoles('admin'),orders);

// admin - update order(stock reduce, orderStatus(process to delivered) change)  --------api/v1/order:id
router.route('/admin/order/:id').put(isAuthenticatedUser,authorizedRoles('admin'),updateOrder);

// admin - Delete order  --------api/v1/order:id
router.route('/admin/order/:id').delete(isAuthenticatedUser,authorizedRoles('admin'),deleteOrder);

module.exports=router;