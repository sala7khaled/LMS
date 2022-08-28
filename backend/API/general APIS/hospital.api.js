var mongoose = require("mongoose");
var HospitalModel = require("../../Models/MedicalModels/hospital.model");
module.exports = function (app) {

  //assign hospital or laboratory data to show in mob
  app.post("/hospitaldata", async (req, resp) => {
    try {
      const {
        hospital_name,
        hospital_location,
        hospital_phone,
        hospital_website,
        hospital_facebook,
        hospital_email,
        hospital_generalManager,
        hospital_adminstratonManager,
        hospital_itManager,
        hospital_MarketingManager,
        hospital_PurchasingManager
      } = req.body;
      let hospital = new HospitalModel({
        _id: mongoose.Types.ObjectId(),
        hospital_name,
        hospital_location,
        hospital_phone,
        hospital_website,
        hospital_facebook,
        hospital_email,
        hospital_generalManager,
        hospital_adminstratonManager,
        hospital_itManager,
        hospital_MarketingManager,
        hospital_PurchasingManager
      });
      await hospital.save();
      resp.status(200).json(hospital);
    } catch (err) {
      resp.status(400).json("error ");
    }
  });

  //get hospital data 
  app.get("/hospitalinfo", async (req, resp) => {
    let hospital = await HospitalModel.findOne({});
    resp.json(hospital);
  });
  app.get(`/gethospital`, async (req, resp) => {
    try {


      let hospital = await HospitalModel.findOne({})
      resp.status(200).json(hospital);

    } catch (err) {
      resp.status(400).json("error");

    }
  })


  //edit hospital data 
  app.put("/edithospital", async (req, resp) => {
    try {
      const { hos_id } = req.body;
      HospitalModel.findOne({ _id: hos_id }, function (err, foundObject) {
        if (err) {
          resp.status(500).json("error 1");
        } else {
          if (req.body.hospital_name) {
            foundObject.hospital_name = req.body.hospital_name;
          }
          if (req.body.hospital_location) {
            foundObject.hospital_location = req.body.hospital_location;
          }
          if (req.body.hospital_phone) {
            foundObject.hospital_phone = req.body.hospital_phone;
          }
          if (req.body.hospital_website) {
            foundObject.hospital_website = req.body.hospital_website;
          }
          if (req.body.hospital_facebook) {
            foundObject.hospital_facebook = req.body.hospital_facebook;
          }
          if (req.body.hospital_email) {
            foundObject.hospital_email = req.body.hospital_email;
          }
          if (req.body.hospital_generalManager) {
            foundObject.hospital_generalManager = req.body.hospital_generalManager;
          }
          if (req.body.hospital_adminstratonManager) {
            foundObject.hospital_adminstratonManager = req.body.hospital_adminstratonManager;
          }
          if (req.body.hospital_itManager) {
            foundObject.hospital_itManager = req.body.hospital_itManager;
          }
          if (req.body.hospital_MarketingManager) {
            foundObject.hospital_MarketingManager = req.body.hospital_MarketingManager;
          }
          if (req.body.hospital_PurchasingManager) {
            foundObject.hospital_PurchasingManager = req.body.hospital_PurchasingManager;
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
};
