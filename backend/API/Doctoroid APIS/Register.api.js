var mongoose = require("mongoose");
var patientModel = require("../../Models/MedicalModels/patient.model");

module.exports = function (app) {
  //first step of signup new patient by mob
  app.post("/signup", async (req, resp) => {
    try {
      const {
        firstName,
        lastName,
        email,
        password,
        phone,
        gender,
        confirm // false
      } = req.body;

      var patient = new patientModel({
        _id: mongoose.Types.ObjectId(),
        firstName,
        lastName,
        email,
        password,
        phone,
        gender,
        confirm
      });
      await patient.save();
      patient.confirm == false;
      resp.status(200).send(patient);
    } catch (err) {
      resp.status(400).send("error in adding Patient");
    }
  });

  //second step of signup new patient by mob
  app.post("/confirmsignup", async (req, resp) => {
    try {
      const { p_id, location, date, confirm, snn, medicines } = req.body;
      let selectedPatient = await patientModel.findOneAndUpdate(
        { _id: p_id },
        { location, date, confirm, snn, medicines }
      );
      if (selectedPatient.confirm == "false") {
        selectedPatient.confirm = "true";

        await selectedPatient.save();

        resp.status(200).send(selectedPatient);
      } else {
        resp.status(400).send("error in confirming signup");
      }
    } catch (err) {
      resp.status(400).send("error in confirming signup");

    }
  });

};
