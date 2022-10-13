const mongoose = require('mongoose')

const subjectSchema = mongoose.Schema(
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

module.exports = mongoose.model('Subject',subjectSchema);