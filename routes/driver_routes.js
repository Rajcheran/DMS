const express = require('express')

const routes = express.Router()

const drivercontroller = require('../controller/driver')

routes.get('/driver-register',drivercontroller.getdriverregister)
routes.post('/driver-register',drivercontroller.post_driver_register)

routes.get('/driverlogin',drivercontroller.getlogin)

routes.post('/driver-main',drivercontroller.postlogin)

//routes.get('/driver-orders/:companyid/:pincode',drivercontroller.getorders)
routes.post('/driver-orders/',drivercontroller.getorders)
routes.post('/edit-product',drivercontroller.edit_order)

routes.get('/logout',drivercontroller.logout)

routes.post('/driver-map',drivercontroller.get_indmap);
routes.get('/driv-maps/:company_id/:pincode',drivercontroller.get_mpa);
routes.get('/maps/:company_id/:pincode',drivercontroller.get_map_details);
routes.get('/getmaps',drivercontroller.getmaps);


module.exports = routes;