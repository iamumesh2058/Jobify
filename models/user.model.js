import mongoose from "mongoose";

const userModel = new mongoose.Schema({
    firstName: String,
    email:String,
    password:String,
    lastName: {
        type: String,
        default: "last name"
    },
    location: {
        type: String,
        default: "my city"
    },
    role: {
        type: String,
        enum: ['user', 'admin'],
        default: 'user',
    },
    avatar: String,
    avatarPublicId: String,
}, {timestamps: true});


userModel.methods.toJSON = function(){
    let obj = this.toObject()
    delete obj.password;
    return obj;
};


export default mongoose.model("User", userModel);