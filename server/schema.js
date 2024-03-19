const mongoose = require('mongoose')
// a schema is a template or blueprint for how the user data is going to be stored in the database
// The reason we use required and unique is to make sure that it's verified on both ends not just a client side when it's submitted in the form
// And the reason we set the type to string is because that's what the data is in the req body

let userSchema = new mongoose.Schema({
    fullName: {
       type: String,
       required: false,
       unique: false
    },
    username: {
        type: String,
        required: false,
        unique: false
    },
    pass: {
        type: String,
        required: false,
        unique: false
    },
    confirmPass: {
        type: String,
        required: false,
        unique: false
    },
    email: {
        type: String,
        required: false,
        unique: false
    },
    phone: {
        type: String,
        required: false,
        unique: false
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', userSchema);

module.exports = User;