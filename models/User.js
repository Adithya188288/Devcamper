const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please add a name"]
    },
    email: {
        type: String,
        required: [true, "Please add a email"],
        unique: true,
        match: [
            /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
            'Please add a valid email'
        ]
    },
    role: {
        type: String,
        enum: ['user', 'publisher'],
        default: "user",
    },
    password: {
        type: String,
        required: [true, "Please add a password"],
        minlength: 6,
        select: false
    },
    resetPasswordToken: String,
    resetPasswordExpire: Date
}, { timestamps: true });


userSchema.pre("save", async function (next) {
    if(!this.isModified('password')){
        next()
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});


userSchema.methods.getSignedJwtToken = function(){
    const token = jwt.sign({id:this._id}, process.env.JWT, { expiresIn: process.env.JWT_EXPIRE})
    return token;
}


userSchema.methods.comparePassword = function(password){
    const result = bcrypt.compare(password,this.password)
    return result;
}

userSchema.methods.getResetToken = function(){
    let token = crypto.randomBytes(20).toString("hex");

    this.resetPasswordToken = crypto.createHash("sha256").update(token).digest("hex");

    this.resetPasswordExpire = Date.now() + 10 * 60 * 1000; 

    return token;
}


module.exports = mongoose.model("User", userSchema);