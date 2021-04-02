//e2wTJmkzgNJaAe7i
//ritheshdcruz
//const uri='mongodb+srv://ritheshdcruz:e2wTJmkzgNJaAe7i@reactblogcluster.a0nfn.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';
const uri ='mongodb://ritheshdcruz:e2wTJmkzgNJaAe7i@reactblogcluster-shard-00-00.a0nfn.mongodb.net:27017,reactblogcluster-shard-00-01.a0nfn.mongodb.net:27017,reactblogcluster-shard-00-02.a0nfn.mongodb.net:27017/myFirstDatabase?ssl=true&replicaSet=atlas-agea6k-shard-0&authSource=admin&retryWrites=true&w=majority';
const express= require('express');
const mongoose=require('mongoose');


mongoose.connect(uri,
    {
        useNewUrlParser:true, 
        useUnifiedTopology:true,
        useFindAndModify:false
    }).then(()=>console.log('DB connected'))
    .catch(err=> console.error(err));

const app=express();

app.get('/',(req, res)=>{
    res.send('hello');
})



app.listen(5000);