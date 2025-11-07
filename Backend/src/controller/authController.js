const userModel=require('../models/user');
const bcrypt=require('bcryptjs');
const jwt=require('jsonwebtoken');
async function registerUser(req,res){
    const {email,fullName:{firstName,lastName},password}=req.body;
    const userAlreadyExists=await userModel.findOne({email});
    if(userAlreadyExists){
        res.status(400).json({
            message:"User already exists"
        })
    }
    const hashPassword=await bcrypt.hash(password,10);
    const user=await userModel.create({
        fullName:{firstName,lastName},
        email,
        password:hashPassword
    });
    const token=jwt.sign({id:user._id},process.env.JWT_SECRET);
    res.cookie('token',token);
    res.status(201).json({
        message:"User registered successfully",
        user:{
            email: user.email,
            id: user._id,
            fullName: user.fullName
        }
    });
};

async function loginUser(req, res) {

    const { email, password } = req.body;

    const user = await userModel.findOne({
        email
    })

    if (!user) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);


    if (!isPasswordValid) {
        return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET);


    res.cookie("token", token);


    res.status(200).json({
        message: "user logged in successfully",
        user: {
            email: user.email,
            _id: user._id,
            fullName: user.fullName
        }
    })

}

async function verifyUser(req,res){
    try{
        const token=req.cookies.token;
    if(!token){
        return res.status(401).json({valid:'false',message:"Unauthorized"});
    }
    const decoded=jwt.verify(token,process.env.JWT_SECRET);
    const user=await userModel.findById(decoded.id).select('-password');
    if(!user){
        return res.status(401).json({valid:'false',message:"Unauthorized"});
    }
    res.status(200).json({valid:'true',message:"User verified",user});
    }catch(err){
        res.status(401).json({valid:'false',message:"Unauthorized"});
    };
};


module.exports = {
    registerUser,
    loginUser,
    verifyUser
}

