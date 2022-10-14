const mongoose = require('mongoose')


const studentSchema = mongoose.Schema(
    {
        name:{
            type:String,
            trim:true
        },
        subject:{
            type:String,
            trim:true
        },
        mark:{
            type:Number,
            trim:true
        },
        email:{
            type:String,
            unique:true,
            trim:true
        },
        password:{
            type:String,
            trim:true
        },
        deletedAt: {
            type: Date,
            default:null
        },
        isDeleted: {
            type: Boolean,
            default: false
        }

    },{ timestamps:true}
);

module.exports = mongoose.model('Student',studentSchema);