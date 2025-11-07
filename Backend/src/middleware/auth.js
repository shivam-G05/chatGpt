const userModel=require('../models/user');

const jwt=require('jsonwebtoken');

async function authUser(req,res,next){
    const {token}=req.cookies;
    if(!token){
        return res.status(401).json({message:"Unauthorized"});
    };

    try{
        const decoded=jwt.verify(token,process.env.JWT_SECRET);
        const user=await userModel.findById(decoded.id).select('-password');
        req.user=user;
        next();
    }catch(error){
        return res.status(401).json({message:"Unauthorized"});
    };
};

module.exports={
    authUser
}