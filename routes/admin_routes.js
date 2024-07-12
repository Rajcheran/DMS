const express = require('express')

const routes = express.Router()

const admincontroller = require('../controller/admin')

routes.get('/',admincontroller.add_admin);

routes.get('/admin-login',admincontroller.getlogin)

routes.post('/admin-main',admincontroller.postlogin)

routes.get('/admin-register',admincontroller.getadminregister)
routes.post('/admin-register',admincontroller.add_admin)

routes.get('/admin-drivers/:companyid',admincontroller.get_drivers)


routes.get('/admin-orders/:companyid',admincontroller.get_orders);
routes.post('/add-orders',admincontroller.add_order);

routes.post('/add-order',admincontroller.post_add_order);

routes.post('/delete-order',admincontroller.delete_order)







module.exports = routes;