import mongoose from 'mongoose';
import bcrypt from "bcrypt"


const userSchema = new mongoose.Schema({
    firstName:{type: String, required: true},
    lastName:{type: String, required: true},
    studentNum: {type: String, required: false},
    role: {type: String, required:true}, 
    sex: {type: String, required:true},
    email:{type: String, required:true, unique:true},
    password: {type: String, required:true},
    phoneNum: {type: String, required:false},
    fraud: {type: Boolean, required:false},
    guardianName: {type:String, required: false},
    guardianContact: {type:String, required:false} 
});


// userSchema.statics.signup= async (firstName, lastName, studentNum, role, sex, email, username, password)=>{
    
//     const exists= false//await this.findOne({username})
    

//     if(exists){
//         throw Error('Email already exists')
//     }else{
//         const salt= await bcrypt.genSalt(10)
//         const hash= await bcrypt.hash(password, salt)

//         const user= await this.create({firstName, lastName, studentNum, role, sex , email, username, password:hash })

//         return user
//     }
// }

userSchema.pre("save", function(next) {
    const user = this;
  
    if (!user.isModified("password")) return next();
  
    return bcrypt.genSalt((saltError, salt) => {
      if (saltError) { return next(saltError); }
  
      return bcrypt.hash(user.password, salt, (hashError, hash) => {
        if (hashError) { return next(hashError); }
  
        user.password = hash;
        return next();
      });
    });
  });

userSchema.methods.comparePassword = function(password, callback) {
    bcrypt.compare(password, this.password, callback);
  }

// mongoose.model('Student', userSchema);
const user=mongoose.model('User', userSchema);
export{user}