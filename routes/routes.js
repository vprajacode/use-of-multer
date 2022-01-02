const express= require("express");
const router= express.Router();
const User=require("../models/users");
const multer=require("multer");
const fs=require("fs");
const { request } = require("http");
// const users = require("../models/users");

var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,"./uploads");
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
});
var upload=multer({
    storage:storage,
}).single('image');

//insert
router.post("/add",upload,(req,res)=>{
    const user=new User({
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image:req.file.filename,
    });
    user.save((err)=>{
        if(err){
          res.json({message: err.message,type:"danger"});
        }
        else{
            req.session.message={
                type:'success',
                message:'User added successfully',
            };
           res.redirect("/display");
        }
    });

   
});


router.get("/",(req,res)=>{
    res.render('index',{title:"homepage"});
});

router.get("/add",(req,res)=>{
    res.render('add_user',{title:"Add Users"});
});

router.get("/display",(req,res)=>{
    User.find().exec((error,users)=>{
        if(error)
        {
            res.json({message:error.message});
        }
        else{
            res.render('display',{title:"Users List",users:users});
        }
    });
   
});

router.get("/edit/:id",(req,res)=>{
    let id=req.params.id;
    User.findById(id,(err,users)=>{
        if(err)
        {
            res.redirect("/");
        }
        else if(users==null)
        {
            res.redirect("/");
        }
        else{
            res.render('edit_user',
            {title:"Edit user",
             users:users  });
        }
        
    });
    
});
router.post("/update/:id",upload,(req,res)=>{
    let id=req.params.id;
    let new_img="";
    if(req.file){
        new_img=req.file.filename;
        try{
            fs.unlinkSync("./uploads/"+req.body.old_image);
        }catch(err){
            console.log(err);
        }
    }else{
        new_img=req.body.old_image;
    }
    User.findByIdAndUpdate(id,{
        name:req.body.name,
        email:req.body.email,
        phone:req.body.phone,
        image:new_img,
    },(err,result)=>{
        if(err){
            res.json({message: err.message,type:'danger'});
        }else{
            req.session.message={
                type:"success",
                message:'User updated successfully'
            }
        }
        res.redirect("/display");

    });
});


router.get("/delete/:id",(req,res)=>{
    let id=req.params.id;
    User.findByIdAndRemove(id,(err,result)=>{
        if(result.image !='')
        {
            try{
                fs.unlinkSync("./uploads/"+result.image);
            }catch(err){
                console.log(err);
            }
        }
        if(err){
            res.json({message: err.message,type:'danger'});
        }else{
            req.session.message={
                type:"success",
                message:'User deleted successfully'
            }
        }
        res.redirect("/display");
    });
        
});


module.exports=router;