const chatModel=require('../models/chat');

async function createChat(req,res){
    const{title}=req.body;
    const user=req.user;
    const chat=await chatModel.create({
        user:user._id,
        title:title
    });
    res.status(201).json({
        message:"Chat created successfully",
        chat:{
            id:chat._id,
            title:chat.title,
            user:chat.user,
            lastActivity:chat.lastActivity,
        }
    });
};

async function getChat(req,res){
    try {
    const chats = await chatModel.find({ user: req.userId })
      .sort({ updatedAt: -1 }) // latest chats first
      .select("_id title"); // only send what’s needed
    res.status(200).json({ chats });
  } catch (err) {
    res.status(500).json({ message: "Error fetching chats", error: err.message });
  }
}module.exports={
    createChat,
    getChat
};