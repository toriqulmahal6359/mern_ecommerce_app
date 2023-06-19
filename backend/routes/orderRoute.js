const express = require('express');
const router = express.Router();
const { isAuthenticatedUser, authorizeRoles } = require('../middlewares/auth');
const { newOrder, successOrder, getSingleOrder, myOrder, updateOrder, getAllOrders, deleteOrder } = require("../controllers/orderController");

router.route('/order/new').post(isAuthenticatedUser, newOrder);
router.route("/order/:id").get(isAuthenticatedUser, getSingleOrder);
router.route("/order/success/:tran_id").post(isAuthenticatedUser, successOrder);
router.route("/orders/me").get(isAuthenticatedUser, myOrder);
router.route("/admin/orders").get(isAuthenticatedUser, authorizeRoles('admin'), getAllOrders);
router.route("/admin/order/:id").put(isAuthenticatedUser, authorizeRoles('admin'), updateOrder).delete(isAuthenticatedUser, authorizeRoles('admin'), deleteOrder);

module.exports = router;