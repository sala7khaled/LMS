var mongoose = require("mongoose");
var CategoriesModel = require("../../Models/MedicalModels/Categories.model");
var lodash = require("lodash")
module.exports = function categoriesAPI(app) {


  // Add new Medical Category 
  app.post("/addcategory", async (req, resp) => {
    try {
      const { category_title, category_imgLink, category_description } = req.body;

      let Category = new CategoriesModel({
        _id: mongoose.Types.ObjectId(),
        category_title,
        category_imgLink,
        category_description
      });
      await Category.save();
      resp.status(200).json(Category);
    } catch (err) {
      resp.status(400).json("error adding Category");
    }
  });

  //Edit Existed Medical Category {unused api in dashboard}
  app.put(`/editcategory`, async (req, resp) => {
    try {
      const { cat_id } = req.body;
      CategoriesModel.findOne({ _id: cat_id }, function (err, foundObject) {
        if (err) {
          resp.status(500).json("error 1");
        } else {
          if (req.body.category_title) {
            foundObject.category_title = req.body.category_title;
          }
          if (req.body.category_imgLink) {
            foundObject.category_imgLink = req.body.category_imgLink;
          }
          if (req.body.category_description) {
            foundObject.category_description = req.body.category_description;
          }

          foundObject.save(function (err, updateObject) {
            if (err) {
              resp.status(500).send();
            } else {
              resp.send(updateObject);
            }
          });
        }
      });
    } catch (err) { }
  });


  // Fetching all categories from Categories Collection
  app.get("/listcategories", async (req, resp) => {
    let categories = await CategoriesModel.find({});
    resp.json(categories);
  });

  //get category by id 
  app.get(`/getcategorybyid/:cat_id`, async (req, resp) => {
    try {
      const { cat_id } = req.params;
      let Category = await CategoriesModel.findOne({ _id: cat_id });
      let arr = Category.category_medical_tests
      resp.status(200).json(arr);
    } catch (err) {
      resp.status(400).json("error fetching Category .. check category ID");

    }
  })


  // get medical analysis precautions 
  app.post(`/getprecautions/:cat_id`, async (req, resp) => {
    try {
      const { cat_id } = req.params;
      const { t_id } = req.body
      let Category = await CategoriesModel.findOne({ _id: cat_id });
      var test = lodash.filter(Category.category_medical_tests, x => x.id === t_id)
      if (test) {
        let en_pre = test[0].test_precautions_en;
        let ar_pre = test[0].test_precautions_ar;
        resp.status(200).json({ english: en_pre, arabic: ar_pre });
      }

    } catch (err) {
      resp.status(400).json("error fetching Category .. check category ID")
    }
  })


  // add new Medical test to specific category
  app.post("/addtest", async (req, resp) => {
    try {
      const {
        cat_id,
        test_title,
        test_period,
        test_price,
        test_description,
        test_precautions_en,
        test_precautions_ar
      } = req.body;
      let Selectedcategory = await CategoriesModel.findOne({ _id: cat_id });
      if (Selectedcategory) {
        Selectedcategory.category_medical_tests.push({
          _id: mongoose.Types.ObjectId(),
          test_title,
          test_period,
          test_price,
          test_description,
          test_precautions_en,
          test_precautions_ar
        });
      }
      await Selectedcategory.save();
      resp.status(200).json(Selectedcategory);
    } catch (err) {
      resp.status(400).json("error adding Tests");
    }
  });

  //delete Category
  app.post('/delcategory', async (req, resp) => {
    try {
      const { cat_id } = req.body
      await CategoriesModel.remove({ _id: cat_id });
      resp.status(200).json("success");

    } catch (err) {
      resp.status(400).send("error .. check Category ID ");

    }
  })

  //delete specific test from category
  app.post("/deltest", async (req, resp) => {
    try {
      const { cat_id, t_id } = req.body;
      let Selectedcategory = await CategoriesModel.findOne({ _id: cat_id });
      let arr = [];
      let index = 0;
      for (i = 0; i < Selectedcategory.category_medical_tests.length; i++) {
        if (Selectedcategory.category_medical_tests[i].id != t_id) {
          arr[index] = Selectedcategory.category_medical_tests[i]
          index++;
        }
      }
      Selectedcategory.category_medical_tests = arr;
      await Selectedcategory.save();
      resp.status(200).json("success");
    } catch (err) {
      resp.status(400).send("error .. check request ID ");
    }
  });
};
