var mongoose = require("mongoose");
let ResultsModel = new mongoose.model("Results", {


    _id: mongoose.Schema.Types.ObjectId,
    accepted_request: { type: Object },
    result_file_id: { type: String },
    acc_id: { type: String },
    result_file_name: { type: String }

});
module.exports = ResultsModel;
