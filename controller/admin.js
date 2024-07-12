const Orders = require('../models/order')
const driver = require('../models/drivers')
const bcrypt = require('bcrypt');
const admin = require('../models/admin');
const order = require('../models/order');


exports.getlogin = (req, res) => {
    res.render('admin/admin_login',{editing:false})
    console.log('admin controller')
};
exports.postlogin = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
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
    try{
    const admi = await admin.get_admin_details_emaill(email)
    if(!admi){
        res.render('admin/admin_login', { editing: true, email: email })
    }
    if(admi){
        
        const isMatch = await bcrypt.compare(password, admi.password);
        if (isMatch) {
            //console.log(admi)
            console.log('trynig main')
            res.render('admin/admin_main', {admin:admi, pagetitle: 'adminMain' })
                

        }
    }}catch(err){
        console.log('error')
        res.render('admin/admin_login', { editing: true, email: email })}
}
exports.getmain = (req, res) => {
    res.render('admin/admin_main')
}
exports.getadminregister = async (req, res) => {
    res.render('admin/admin_register', { edit: '' })
};
exports.add_admin = async (req, res) => {
    const name = req.body.aname;
    const phone = req.body.aphone;
    const email = req.body.aemail;
    const password = req.body.apassword;
    const confirmpassword = req.body.aconfirmpassword;
    const company_id = req.body.aCompanyid;

    // Log to check if all fields are correctly received
    //console.log("Received data:", { name, phone, email, password, confirmpassword, company_id });

    if (!name || !phone || !email || !password || !confirmpassword || !company_id) {
        return res.render('admin/admin_register', { edit: 'missing' });
    }

    try {
        const npassword = await bcrypt.hash(password, 10);
        //console.log("Hashed password:", npassword);
        //console.log("Email:", email);

        const gadmin = await admin.get_admin_details_emaill(email);
        if (gadmin) {
            return res.render('admin/admin_register', { edit: 'exists' });
        }

        const isMatch = password === confirmpassword;
        if (isMatch) {
            const Admin = new admin(name,company_id, phone, email, npassword );
            Admin.add_admin();
            return res.render('admin/admin_login', { email: email,editing:true, path: 'drivers_list' });
        } else {
            return res.render('admin/admin_register', { edit: 'mismatch' });
        }
    } catch (err) {
        console.log("Error:", err);
        return res.render('admin/admin_register', { edit: 'na' });
    }
}

exports.get_orders=(req,res)=>{
    const company_id = req.params.companyid
    order.get_orders_admin(company_id).then(orders=>{
        //console.log(orders)
        res.render('admin/admin_orders',{order:orders,companyid:company_id})
    }).catch(err=>{
        console.log('error fetching oredrs')
    })
}
exports.add_order=(req,res)=>{
    const company_id = req.body.cid
    console.log('fetching add order'+company_id)
    res.render('admin/add_order',{companyid:company_id})
}

exports.post_add_order = (req, res) => {
    const adress = req.body.address
    const phone = req.body.phone
    const company_id = req.body.companyid
    const email = req.body.email
    const pincode = req.body.pincode
    const area = req.body.area
    const city = req.body.city
    const state = req.body.state
    console.log(area,city,state)
    const addres = adress+''+area+','+pincode+','+city+','+state
    console.log(addres)
    let slot_no= req.body.slotno
    if(slot_no==0 || !slot_no){
        const currentHour = new Date().getHours();
        console.log(currentHour);
        if(currentHour<12){
            slot_no='1';
        }
        else if(currentHour<14){
            slot_no='2';
        }
        else if(currentHour<16){
            slot_no='3';
        }
    }
   
    const orde = new Orders(addres, phone, email, company_id,slot_no,pincode,'0')
    orde.add_order()
    order.get_orders_admin(company_id).then(orders=>{
        res.render('admin/admin_orders',{order:orders,companyid:company_id})
    }).catch(err=>{
        console.log('error fetching oredrs')
    })
    
}
exports.delete_order=(req,res)=>{
    const orderid= req.body.order_id
    const companyid = req.body.company_id
    console.log(orderid)
    order.delete_order_byid(orderid)
    order.get_orders_admin(companyid).then(orders=>{
        res.render('admin/admin_orders',{order:orders,companyid:companyid})
    }).catch(err=>{
        console.log('error fetching oredrs')
    })
}

exports.get_drivers = (req, res) => {
    const company_id =req.params.companyid;
    console.log('in get driver',company_id)
    driver.get_alldrivers_details(company_id)
        .then(drivers => {
            console.log(" got drivers ",drivers)
            res.render('admin/admin_drivers', { driver: drivers})
        }).catch(err => {
            console.log(err)
        })
}

exports.get_admin_details = (req, res) => {
    const admin_id = req.body.admin_id
    admin.get_admindetails(admin_id)
        .then(admin => {
            res.render('', { admin: admin, pagetitle: 'admin details', path: 'admin_details' })
        })
}


