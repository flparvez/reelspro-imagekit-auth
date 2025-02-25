import mongoose, { model, models } from "mongoose";
import bcrypt from "bcryptjs";

export interface IUser {
    name : string;
    email : string;
    password : string;
    role : string;
    _id?:mongoose.Types.ObjectId
    createdAt? : Date;
    updatedAt?: Date;
    googleId? : string
    
}

const userSchema = new mongoose.Schema<IUser>({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true,
        unique : true,
    },
    password : {
        type : String,
        required : true,
    },
   role : {
    type : String,
    enum : ["user", "admin"],
    default : "user"
   },
   googleId : {
    type : String
   }
},
{
    timestamps : true
});

userSchema.pre("save", async function(next){
    if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
    }

    next();
});

const User =models?.User || model<IUser>("User", userSchema);

export default User