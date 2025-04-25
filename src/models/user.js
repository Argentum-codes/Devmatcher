const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    firstName: {
        type: String,
        required: true,
        minLenngth: 1,
        index: true,
        maxLength: 50,
    },
    lastName: {
        type: String
    },
    emailId: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error("Email is not valid:" + value);  
            }
        }
    },
    password: {
        type: String,
        required: true,
        validate(value){
            if(!validator.isStrongPassword(value)){
                throw new Error("Password is not strong enough");
            }
        }
    },
    age:{
        type: Number,
        min: 18,
    },
    gender: {
        type: String,
        validate(value){
            if(!["male", "female", "others"].includes(value)){
                throw new Error("gender is not valid");
            }
        }
    },
    photoUrl:{
        type: String,
        default:"https://static.vecteezy.com/system/resources/previews/020/987/083/non_2x/user-icon-fake-photo-sign-profile-button-simple-style-social-media-poster-background-symbol-user-brand-logo-design-element-user-t-shirt-printing-for-sticker-free-vector.jpg",
        validate(value){
            if(!validator.isURL(value)){
                throw new Error("Photo-url is not valid");
            }
        }
    },
    about:{
        type: String,
        default:"This is the Default About"
    },
    skills:{
        type: [String]
    }
},{
    timestamps: true,
})

userSchema.index({firstName: 1, lastName: 1});


userSchema.methods.getJWT = async function(){//dont use arrow func here -- this does  not  work there

    const user = this;
    const token = jwt.sign({_id : user._id}, "DEV@Baby10", {
        expiresIn: "7d"
    })

    return token
}

userSchema.methods.validatePassword = async function(passwordInputByUser){
    const user = this;
    const passwordHash= user.password;

    const isPasswordValid = await bcrypt.compare(passwordInputByUser, passwordHash);

    return isPasswordValid;
}

const User = mongoose.model('User', userSchema);//like a class 

module.exports = User;