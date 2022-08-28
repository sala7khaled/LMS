var mongoose = require("mongoose");

let CategoriesModel = new mongoose.model("Categories", {
  _id: mongoose.Schema.Types.ObjectId,
  category_title: String,
  category_imgLink: String,
  category_description: String,

  category_medical_tests: [
    {
      _id: mongoose.Schema.Types.ObjectId,
      test_title: String,
      test_period: Number,
      test_price: Number,
      test_precautions_en: String,
      test_precautions_ar: String,
      test_description: String
    }
  ]

});
module.exports = CategoriesModel