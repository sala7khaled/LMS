var mongoose = require("mongoose");
var patientModel = require("../../Models/MedicalModels/patient.model");
var medicinesModel = require("../../Models/MedicalModels/medicines.model");

module.exports = function createPatientsAPIS(app) {
  //add new medicine 
  app.post("/addmedicine", async (req, resp) => {
    try {
      const {
        medicine_Name,
        medicine_Price,
        medicine_Description,
        medicine_Quantity,
        medicine_ImageUrl,
        medicine_Unit
      } = req.body;
      let medicine = new medicinesModel({
        _id: mongoose.Types.ObjectId(),
        medicine_Name,
        medicine_Price,
        medicine_Description,
        medicine_Quantity,
        medicine_ImageUrl,
        medicine_Unit
      });
      await medicine.save();

      resp.status(200).json(medicine);
    } catch (err) {
      resp.status(400).json("error adding medecine");
    }
  });

  //get all medicines 
  app.get("/getmedicines", async (req, resp) => {
    try {
      let medicines = await medicinesModel.find({});
      resp.status(200).json(medicines);
    } catch (err) {
      resp.status(400).json("error fetching medicines");
    }
  });

  //add medicine to patient's medicines list 
  app.post("/addmedecinetopatient", async (req, resp) => {
    try {
      const { p_id, m_id } = req.body;
      let medicine = await medicinesModel.findOne({ _id: m_id });
      if (medicine) {
        let SelectedPatient = await patientModel.findOne({ _id: p_id });
        if (SelectedPatient) {
          SelectedPatient.medicines.push(m_id);
          SelectedPatient.medicines_name.push(medicine.medicine_Name);

        }
        await SelectedPatient.save();
        resp.status(200).json(SelectedPatient);
      }


    } catch (err) {
      resp.status(400).send("error in Updating Medicines");
    }
  });


  //delete medicine 
  app.post("/delmedicine", async (req, resp) => {
    try {
      const { m_id } = req.body
      await medicinesModel.remove({ _id: m_id });
      resp.status(200).json('success');
    } catch (err) {
      resp.status(400).json("error deleting medicines");
    }
  });

  //get medicine by id  
  app.get(`/getMedicinebyid/:m_id`, async (req, resp) => {
    try {
      const { m_id } = req.params;

      let medicine = await medicinesModel.findOne({ _id: m_id })
      resp.status(200).json(medicine);

    } catch (err) {
      resp.status(400).json("error fetching medicine check medicine ID ");

    }
  })

  // edit medicine   
  app.put(`/editmedicine/:m_id`, async (req, resp) => {
    try {
      const { m_id } = req.params;
      medicinesModel.findOne({ _id: m_id }, function (err, foundObject) {
        if (err) {
          resp.status(500).json("error 1");
        } else {
          if (req.body.medicine_Name) {
            foundObject.medicine_Name = req.body.medicine_Name;
          }
          if (req.body.medicine_Price) {
            foundObject.medicine_Price = req.body.medicine_Price;
          }
          if (req.body.medicine_Description) {
            foundObject.medicine_Description = req.body.medicine_Description;
          }
          if (req.body.medicine_Quantity) {
            foundObject.medicine_Quantity = req.body.medicine_Quantity;
          }
          if (req.body.medicine_ImageUrl) {
            foundObject.medicine_ImageUrl = req.body.medicine_ImageUrl;
          }
          if (req.body.medicine_Unit) {
            foundObject.medicine_Unit = req.body.medicine_Unit;
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
