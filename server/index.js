
const express= require('express');
const mongoose=require('mongoose');
const bodyParser=require('body-parser');
const cookieParser=require('cookie-parser');
const config= require('./config/key');
const {auth}=require('./middleware/auth')

const {User} =require('./models/user');



mongoose.connect(config.mongoURI,
    {
        useNewUrlParser:true, 
        useUnifiedTopology:true,
        useFindAndModify:false
    }).then(()=>console.log('DB connected'))
    .catch(err=> console.error(err));

const app=express();
app.use(bodyParser.urlencoded({extented:true}));
app.use(bodyParser.json());
app.use(cookieParser());

app.get('/api/users/auth',auth,(req, res)=>{
    res.status(200).json({
        _id:req._id,
        isAuth:true,
        email:req.user.email,
        name:req.user.name,
        lastname:req.user.lastname,
        role:req.user.role,

    })
})

app.post('/api/users/register',(req, res)=>{
    const user= new User(req.body);
    console.log("inside /api/users/register")
    user.save((err,userData)=>{

        if(err){
            console.log(err);
            return res.status(400).json({success: false,err});}
        console.log(userData);
        return res.status(200).json({success:true,})
    })
    
})

app.post('/api/users/login',(req,res)=>{
    // find email
    console.log(req.body);
    User.findOne({email: req.body.email},(err,user)=>{
        if (err)
        return(501).json({
            loginSuccess: false,
            message: "Error while finding user"
            });
    
        if(!user)
        return res.json({
        loginSuccess: false,
        message: "Login failed, email not found"
        });



        user.comparePassword(req.body.password, (err, isMatch)=>{
            if(!isMatch)
            return res.json({
            loginSuccess: false,
            message: "Password not same"
            })
    
        });
        // generate token
        user.generateToken((err, user)=>{
    
            if(err){
            return res.status(400).json({ successLogin: false, message: "Auth failed , User not saved"})
            }
            res.cookie("x_auth",user.token.trim()).status(200).json({successLogin:true});
            
        })


    });

  app.get('/api/users/logout',auth,(req,res)=>{
    
    User.findOneAndUpdate({_id: req.user._id},{token:""},(err, doc)=>{
        if (err) return res.status(200).json({success: false , err});
        return res.status(200).json({success: true , err: null}
        );
    })
  });

    

});

const PORT=process.env.PORT||5000;
app.listen(PORT||5000, ()=>{
    console.log('server running at port '+PORT);    
});