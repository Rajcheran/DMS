const orders = require('../models/order')
const driver = require('../models/drivers')

const bcrypt = require('bcrypt');

exports.getlogin = (req, res) => {
    const editmode = false
    res.render('driver/driver_login', { editing: editmode, email: null, password: null })
    console.log('controller')
};

exports.getdriverregister = async (req, res) => {
    console.log('here')
    res.render('driver/driver_register', { edit: '' })
};

exports.post_driver_register = async (req, res, next) => {
    const { name, password, confirmpassword, Pincode, phone, email, Companyid, editmode } = req.body;

    try {
        const npassword = await bcrypt.hash(password, 10);
        console.log(email);

        const gdriver = await driver.get_driver_details_emaill(email);
        if (gdriver) {
            return res.render('driver/driver_register', { edit: 'exists' });
        }
        // driver.get_driver_details_emaill(email).then(driver=>{
        //     return res.render('driver/driver_register',{edit:'exists'});
        // }).catch().next() //it some what works
        const isMatch = await bcrypt.compare(confirmpassword, npassword);
        if (isMatch) {
            const ndriver = new driver(name, npassword, Pincode, phone, email, Companyid);
            ndriver.save();
            res.render('driver/driver_login', { editing: editmode, email: email });
        } else {
            res.render('driver/driver_register', { edit: 'mismatch' });
        }
    } catch (err) {

        res.render('driver/driver_register', { edit: 'na' });
    }
};



exports.postlogin = async (req, res) => {
    const email = req.body.driver_email;
    const password = req.body.driver_password;
    console.log("login " + email);
    // const d = await driver.get_driver_details_emaill(email);
    // if (d) {
    //     const driverid = d._id;
    //     const isMatch = await bcrypt.compare(password, d.password);
    //     if (isMatch) {
    //         driver.getdriver_details(driverid,
    //             driver => {
    //                 res.render('driver/driver_main', { driver: driver, pagetitle: 'driver Main' })
    //             }
    //         )

    //     }
    // }
    driver.get_driver_details_emaill(email).then(async drive => {
        const driverid = drive._id;
        console.log(driverid)
        //console.log(drive.password)
        const isMatch = await bcrypt.compare(password, drive.password);
        if (isMatch) {
            //console.log('matched')
            //    const d = driver.getdriver_details(driverid)//.then(
            //         if(d) {
            console.log('trynig main')
            console.log('fetched driver ', drive)
            res.render('driver/driver_main', { driver: drive, pagetitle: 'driver Main' })
            // }
            //)

        }
        else {
            res.render('driver/driver_login', { editing: true, email: email })
        }
    }).catch(err => {
        console.log(err)
        console.log('error')
        res.render('driver/driver_login', { editing: true, email: email })
    })
}

exports.getprofile = (req, res) => {
    const driverid = req.body.driver_id
    driver.getdriver_details(driverid)
        .then(driver => {
            console.log('ye in')
            res.render('driver/driver_main', { driver: driver })
        })
}
let n = 0;
exports.getorders = async (req, res) => {
    //const pincode = req.params.pincode
    //const companyid = req.params.companyid
    const pincode = req.body.pincode
    const companyid = req.body.companyid
    console.log(pincode, companyid)
    const currentHour = new Date().getHours();
    //console.log(currentHour);
    let slot_no = 3
    if (currentHour < 12) {
        slot_no = 1;
    }
    else if (currentHour < 14) {
        slot_no = 2;
    }
    else if (currentHour < 16) {
        slot_no = 3;
    }
    //console.log(slot_no)
    // slot no based on the time              not implemented yet
    orders.get_orders_pin(pincode, companyid, slot_no).then(orders => {
        console.log('get oder for driver  ', orders)
        res.render('driver/driver_orders', { order: orders, pagetitle: 'orders', patch: '' })
    }).catch(err => {
        console.log(err)
    })
    // try{
    //     n=n+1;
    //     console.log(n)
    // const order = await orders.get_orders_pin(pincode,companyid,slot_no)
    // if(order) {
    //     console.log('get oder for driver  ',order)
    //     res.render('driver/driver_orders', { order: order, pagetitle: 'orders', patch: '' })
    // }}
    // catch(err) {
    //     console.log(err)
    // }
}

exports.edit_order = async (req, res) => {
    const orderid = req.body.order_id
    const status = req.body.status
    console.log(orderid, status)

    /// same slot no baded on time 
    const currentHour = new Date().getHours();
    //console.log(currentHour);

    let slot_no = '0'
    if (status == '0') {
        if (currentHour < 9) {
            slot_no = '2';
        }
        else if (currentHour < 12) {
            slot_no = '3';
        }
        else if (currentHour < 14) {
            slot_no = '1';
        }
    }

    try {
        const order = await orders.get_order(orderid)
        const adress = order.adress
        const phone = order.phone
        const email = order.email
        const company_id = order.company_id
        const pincode = order.pincode
        console.log(adress, phone, order._id, ' editing ', slot_no)
        const orde = new orders(adress, phone, email, company_id, slot_no, pincode, status, order._id)
        orde.add_order()
        if (status == '1') {
            var nodemailer = require('nodemailer');

            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: 'ras.d0019190@gmail.com',
                    pass: 'hqwx hwxj gucp jybq'
                }
            });

            var mailOptions = {
                from: 'ras.d0019190@gmail.com',
                to: email,
                subject: 'Delivery',
                text: 'Your product is deleiverd, time:'+currentHour
            };

            transporter.sendMail(mailOptions, function (error, info) {
                if (error) {
                    console.log(email);
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });
        }
        orders.get_orders_pin(pincode, company_id, slot_no).then(orders => {
            console.log('get oder for driver  ', orders)
            res.render('driver/driver_orders', { order: orders, pagetitle: 'orders', patch: '' })
        }).catch(err => {
            console.log(err)
        })
    } catch (err) {

    }
}

exports.logout = (req, res) => {
    res.render('driver/driver_login')
}

exports.get_indmap = (req, res) => {
    const add = req.body.adress;
    res.render('driver/driver_map', { destination: add });
}

var stops = []
exports.get_map_details=(req,res)=>{
    const pincode = req.params.pincode
    const companyid = req.params.company_id
    console.log(pincode, companyid)
    const currentHour = new Date().getHours();
    //console.log(currentHour);
    let slot_no = 3
    if (currentHour < 12) {
        slot_no = 1;
    }
    else if (currentHour < 14) {
        slot_no = 2;
    }
    else if (currentHour < 16) {
        slot_no = 3;
        
    }
    stops=[]
    //console.log(slot_no)
    // slot no based on the time              not implemented yet
    orders.get_orders_pin(pincode, companyid, slot_no).then(orders => {
        console.log('get oder for map  ', orders)
        for(let o of orders){
            console.log(o.adress)
            stops.push(o.adress)
        }
        console.log(stops)
        res.render('driver/map', { order: orders,stops:stops, pagetitle: 'orders', patch: '' })
    }).catch(err => {
        console.log(err)
    })
 
}
exports.get_mpa=(req,res)=>{
    const company_id = req.params.company_id
    const pincode = req.params.pincode
    console.log(company_id,pincode)
    res.render('driver/get_map',{company_id:company_id,pincode:pincode})
}
exports.getmaps=(req,res)=>{
    console.log(stops)
    res.json({ stops });
}