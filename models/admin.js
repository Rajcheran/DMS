const getdb = require('../util/database').getdb
const mongodb = require('mongodb')

class admin{
    constructor(name,company_id,phone,email,password){
        this.name=name
        this.company_id=company_id
        this.phone=phone
        this.email=email
        this.password=password
    }
    add_admin(){
        const db = getdb()
        db.collection('admin').insertOne(this).then()
        .catch(err=>{
            console.log(err)
        })
    }
    static edit_admin(admin_id){
        const db = getdb()
       return db.collection('admin').find({_id:new mongodb.BSON.ObjectId(admin_id)}).next()
        .then(admin=>{
            return admin
        }).catch(err=>{
            console.log(err)
        })
    }
    static get_admindetails(admin_id){
        const db = getdb()
       return db.collection('admin').find({_id:new mongodb.BSON.ObjectId(admin_id)}).next()
        .then(admin=>{
            return admin
        }).catch(err=>{
            console.log(err)
        })
    }
    static get_admin_details_emaill(emai){
        const db = getdb()
        return  db.collection('admin')
        .findOne({ email: emai })
        .then(admin => {
            console.log("found it "+admin.email)
          return admin;
        })
        .catch(err => {
          console.log(err);
        });
    }
}
module.exports = admin;