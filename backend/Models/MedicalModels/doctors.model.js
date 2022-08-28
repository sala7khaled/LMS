var mongoose = require('mongoose')

var DoctorsModel = new mongoose.model('Patients',{
    _id:mongoose.Schema.Types.ObjectId,
    doctor_name:String,
    doctor_number:String,
    doctor_email:{type:String,require:true},
    doctor_password:{type:String,require:true},
    medicines: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Medicines' }],

})
module.exports = DoctorsModel