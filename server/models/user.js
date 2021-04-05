const mongoose= require('mongoose');
const bcrypt = require('bcrypt');
const jwt= require('jsonwebtoken');
const ObjectId = require('mongodb').ObjectId;
const saltRounds = 10;
const secret='secret';

const userSchema=mongoose.Schema({

    name:{
        type:String,
        maxLength:50
    },
    email:{
        type:String,
        trim:true,
        unique:1
    },
    password:{
        type:String,
        minLength:5

    },
    lastName:{
        type:String,
        maxLength:50
    },
    role:{
        type:Number,
        default:0
    },
    token:{
        type:String
    },
    tokenExp:{
        type:Number
    }


});


userSchema.pre('save', function(next){

   var user=this;
   console.log('in pre save');
   if(user.isModified('password')){
  
        bcrypt.genSalt(saltRounds, function(err, salt) {
    
                if (err) return next(err);
                console.log('in genSalt')
                bcrypt.hash(user.password, salt, function(err, hash) {
                    if (err) return next(err);
                    user.password=hash;
                    console.log('in hash')
                    next();
                });
        });
   }
   else{

        next();
   }

})


userSchema.methods.comparePassword=function(plainPassword,cb){

    bcrypt.compare(plainPassword,this.password, function( err,isMatch){
        if(err)return cb(err); 
        cb(null, isMatch);
    })


}


userSchema.methods.generateToken=function(cb){
    var user= this;
    console.log(user._id);
    var token = jwt.sign({ _id: user._id},secret);
    user.token=token;
    user.save(function(err,user){

        if(err)return cb(err);
       
        return cb(null, user);
    })
}






userSchema.statics.findByToken=function(token, cb){
    var user= this;
    jwt.verify(token,secret,function(err,payload){
   //"id":ObjectId(payload._id),
   let query={"_id":new ObjectId(payload._id),"token": token};
   
   console.log(query)
        user.findOne(query, function (err, user){
            if(err)return cb(err);
            cb(null,user);
        })


    });
 
    
}
const User=mongoose.model('User',userSchema);

module.exports={ User }