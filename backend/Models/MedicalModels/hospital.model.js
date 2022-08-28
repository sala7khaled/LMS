var mongoose = require('mongoose')


var HospitalModel = new mongoose.model('Hospital',{
    _id:mongoose.Schema.Types.ObjectId,
    hospital_name:String,
    hospital_location:String,
    hospital_phone:String,
    hospital_website:String,
    hospital_facebook:String,
    hospital_email:String,
    hospital_generalManager:String,
    hospital_adminstratonManager:String,
    hospital_itManager:String,
    hospital_MarketingManager:String,
    hospital_PurchasingManager:String,

})
module.exports = HospitalModel