const mongodb = require('mongodb')
const getbd=require('../util/database').getdb

class order{
    constructor(adress,phone,email,company_id,slot_no,pincode,status,id){
        this.adress=adress
        this.phone=phone
        this.email=email
        this.company_id=company_id
        this.slot_no=slot_no
        this.pincode=pincode
        this.status=status
        this._id=id
    }
    add_order(){
        const db = getbd()
        if(this._id){
            db.collection('orders')
            .updateOne({_id:new mongodb.BSON.ObjectId(this._id)},{$set:this})
        }else{
        db.collection('orders').insertOne(this).then()
        .catch(err=>{
            console.log(err)
        })}
    }
    // static edit_order(order_id){
    //     const db=getbd()
    //     db.collection('orders')
    //         .updateOne({_id:new mongodb.BSON.ObjectId(order_id)},{$set:this})
    // }
    static get_order(orderid){
        const db=getbd()
        return db.collection('orders').find({_id:new mongodb.BSON.ObjectId(orderid)}).next()
        .then(orders=>{
            return orders
        }).catch(err=>{
            console.log(err)
        })
    }
    static get_orders_admin(company_id){
        const db=getbd()
        return db.collection('orders').find({company_id:company_id}).toArray()
        .then(orders=>{
            return orders
        }).catch(err=>{
            console.log(err)
        })
    }
    static async get_orders_pin(pincode,companyid,slotno){
        console.log(pincode,companyid,slotno)
        const db=getbd()
        return await db.collection('orders').find({pincode:pincode,company_id:companyid,slot_no:String(slotno),status:'0'}).toArray()
        .then(orders=>{
            return orders
        }).catch(err=>{
            console.log(err)
        })
    }

    static delete_order_byid(order_id){
        const db=getbd()
        return db.collection('orders').deleteOne({_id:new mongodb.BSON.ObjectId(order_id)})
        
    }
    
}
module.exports = order;