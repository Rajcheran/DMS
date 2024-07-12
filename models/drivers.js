const mongodb = require('mongodb')
const getd = require('../util/database').getdb

class driver{
    constructor(name,password,pincode,phone,email,company_id){
        this.name=name
        this.password=password
        this.pincode=pincode
        this.phone=phone
        this.email=email
        this.company_id=company_id
    }
    async save(){
        const db = getd();
        console.log(db);
        db.collection('drivers').insertOne(this)
        .then(result=>{
            console.log('user entered')
        }).catch(err=>{
            console.log(err)
        })
    }
    static edit_driver(driver_id){
        const db = getd();
        return db.collection('drivers').find({_id:new mongodb.BSON.ObjectId(driver_id)}).next()
        .then(driver=>{
            return driver
        }).catch(err=>{
            console.log(err)
        })
    }
    static getdriver_details(driver_id){
        const db = getd()
        db.collection('drivers').findOne({_id:driver_id})
        .then(driver=>{
            return driver
        }).catch(err=>{
            console.log(err)
        })
    }
    static get_alldrivers_details(company_id){
        const db = getd()
        return db.collection('drivers')
        .find({company_id:company_id})
        .toArray()
        .then(drivers=>{
            return drivers
        }).catch(err=>{
            console.log(err)
        })
    }
    static get_driver_details_emaill(emai){
        const db = getd()
        return  db.collection('drivers')
        .findOne({ email: emai })
        .then(driver => {
            console.log("found it "+driver.email)
          return driver;
        })
        .catch(err => {
          console.log(err);
        });
    }
    
}
module.exports = driver;