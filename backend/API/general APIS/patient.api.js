var patientModel = require("../../Models/MedicalModels/patient.model");

module.exports = function createPatientsAPIS(app) {

  //get all patients 
  app.get("/getpatients", async (req, resp) => {
    try {
      let patients = await patientModel.find({});
      resp.status(200).send(patients);
    } catch (err) {
      resp.status(400).send("error in getting patients");
    }
  });

  //get patient by ID
  app.get("/getpatient/:p_id", async (req, resp) => {
    try {
      const { p_id } = req.params;
      let patients = await patientModel.find({ _id: p_id });
      resp.status(200).send(patients[0]);
    } catch (err) {
      resp.status(400).send("check patient ID plz");
    }
  });

  //remove patient
  app.post("/removepatient", async (req, resp) => {
    try {
      const { p_id } = req.body;
      let result = await patientModel.remove({ _id: p_id });
      resp.status(200).json(result);
    } catch (err) {
      resp.status(400).send("error in removing Patient");
    }
  });

  //remove all patients {reset model}
  app.get("/removeallpatients", async (req, resp) => {
    let output = await patientModel.remove({});
    resp.json({ message: "success", result: output });
  });


  //edit patient data 
  app.put(`/editpatient/:id`, async (req, resp) => {
    try {
      const { id } = req.params;
      patientModel.findOne({ _id: id }, function (err, foundObject) {
        if (err) {
          resp.status(500).json("error 1");
        } else {
          if (!foundObject) {
            resp.status(404).send();
          } else {
            if (req.body.firstName) {
              foundObject.firstName = req.body.firstName;
            }
            if (req.body.lastName) {
              foundObject.lastName = req.body.lastName;
            }
            if (req.body.email) {
              foundObject.email = req.body.email;
            }
            if (req.body.password) {
              foundObject.password = req.body.password;
            }
            if (req.body.phone) {
              foundObject.phone = req.body.phone;
            }
            if (req.body.gender) {
              foundObject.gender = req.body.gender;
            }
            if (req.body.date) {
              foundObject.date = req.body.date;
            }
            if (req.body.location) {
              foundObject.location = req.body.location;
            }
            if (req.body.snn) {
              foundObject.snn = req.body.snn;
            }
            if (req.body.medicines) {
              foundObject.medicines = req.body.medicines;
            }
            foundObject.save(function (err, updateObject) {
              if (err) {
                resp.status(500).send();
              } else {
                resp.send(updateObject);
              }
            });
          }
        }
      });
    } catch (err) { }
  });

};
