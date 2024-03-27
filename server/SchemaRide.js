const mongoose=require('mongoose');

const RideSchema=new mongoose.Schema({

    name:String,
    email:String,
    phone:Number,
    pickup:String,
    charge:Number,
    time:String,
    mode:String,
    imageUrl:String,
    date:String,

},
{
    collection:'users',
}

);
module.exports=mongoose.model('users',RideSchema);