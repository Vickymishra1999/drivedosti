const mongoose=require('mongoose');

const BookingSchema=new mongoose.Schema({

    username:String,
    useremail:String,
    driverid:String,
    drivername:String,
    driverphone:Number,
    pickup:String,
    pickuptime:String,

}
);

module.exports=mongoose.model('bookings',BookingSchema);