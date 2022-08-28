var mongoose = require("mongoose");
var RequestsModel = require("../../Models/MedicalModels/Requests.model");
var CategoriesModel = require("../../Models/MedicalModels/Categories.model");
var PatientsModel = require("../../Models/MedicalModels/patient.model");
var lodash = require("lodash")
var resultsModel = require("../../Models/MedicalModels/results.model")

module.exports = function (app) {
  //making medical analysis test  request 
  app.post("/addreq", async (req, resp) => {
    try {
      const {
        c_id,
        t_id,
        req_status,
        req_time,
        req_date,
        req_comment,
        req_test,
        req_p_id,
        req_p_name,
        req_p_phone,
        req_notes,
        req_category,
        req_testPeriod,
        req_testPrice,
        req_testDesc,

      } = req.body;
      let Request = new RequestsModel({
        _id: mongoose.Types.ObjectId(),
        c_id,
        t_id,
        req_status,
        req_time,
        req_date,
        req_comment,
        req_test,
        req_p_id,
        req_p_name,
        req_p_phone,
        req_notes,
        req_category,
        req_testPeriod,
        req_testPrice,
        req_testDesc,
      });
      let Selectedcategory = await CategoriesModel.findOne({ _id: c_id });
      var cat = Selectedcategory.category_title;

      var test = lodash.filter(Selectedcategory.category_medical_tests, x => x.id === t_id)
      if (test) {
        var testPeriod = test[0].test_period;
        var testPrice = test[0].test_price;
        var testDesc = test[0].test_description;
        var testTitle = test[0].test_title;

        Request.req_test = testTitle;
        Request.req_notes = "Empty";
        Request.req_status = "Pending";
        Request.req_category = cat
        Request.req_testPeriod = testPeriod
        Request.req_testPrice = testPrice
        Request.req_testDesc = testDesc

      }

      await Request.save();
      let SelectedPatient = await PatientsModel.findOne({ _id: req_p_id });
      if (SelectedPatient) {
        Request.req_p_name =
          SelectedPatient.firstName + " " + SelectedPatient.lastName;
        Request.req_p_phone = SelectedPatient.phone;
        await Request.save();
        SelectedPatient.requests.push(Request.id);
        await SelectedPatient.save();
      }

      resp.status(200).json(Request);
    } catch (err) {
      resp.status(400).json(" error requesting ");
    }
  });

  // getting only accepted requests 
  app.get("/accepted", async (req, resp) => {
    try {
      let test = await RequestsModel.find({});
      var acceptedTest = lodash.filter(test, x => x.req_status === "Accepted")

      if (acceptedTest) {

        resp.status(200).json(acceptedTest);
      }
    } catch (err) {
      resp.status(400).json(" error finding accepted requests ");

    }
  })


  // Accepting request
  app.post("/acceptreq", async (req, resp) => {
    try {
      const { req_id } = req.body
      let selectedReq = await RequestsModel.findOne({ _id: req_id });
      selectedReq.req_status = "Accepted";
      selectedReq.save();
      let acceptedReq = new resultsModel({
        _id: mongoose.Types.ObjectId(),
        result_file_id: "NULL",
        accepted_request: selectedReq,
        acc_id: req_id,
        result_file_name: ""

      })
      await acceptedReq.save();
      resp.status(200).json(acceptedReq);
    } catch (err) {
      resp.status(400).json(" error finding accepted requests ");
    }
  })
  //Rejecting request 
  app.post("/rejectreq", async (req, resp) => {
    try {
      const { req_id } = req.body
      let selectedReq = await RequestsModel.findOne({ _id: req_id });
      selectedReq.req_status = "Rejected";
      await selectedReq.save();

      resp.status(200).json(selectedReq);
    } catch (err) {
      resp.status(400).json(" error finding accepted requests ");
    }
  })
  // Pend request
  app.post("/pendreq", async (req, resp) => {
    try {
      const { req_id } = req.body
      let selectedReq = await RequestsModel.findOne({ _id: req_id });
      selectedReq.req_status = "Pending";
      await selectedReq.save();

      resp.status(200).json(selectedReq);
    } catch (err) {
      resp.status(400).json(" error finding accepted requests ");
    }
  })



  //get all requests 
  app.get("/getreq", async (req, resp) => {
    let Req = await RequestsModel.find({});
    resp.json(Req);
  });

  //get all requests for specific patient 
  app.post("/patientreq", async (req, resp) => {
    try {
      const { p_id } = req.body;
      let SelectedPatient = await PatientsModel.findOne({ _id: p_id });
      let requests = SelectedPatient.requests;
      resp.status(200).json({ requests });
    } catch (err) {
      resp.status(400).json(" error getting requests for this Patient ");
    }
  });

  //knowing patient who did this request {unused api } 
  app.post("/reqpatientinfo", async (req, resp) => {
    try {
      const { r_id } = req.body;
      let SelectedRequest = await RequestsModel.findOne({ _id: r_id });
      if (SelectedRequest) {
        let p_id = SelectedRequest.req_p_id;
        let SelectedPatient = await PatientsModel.findOne({ _id: p_id });
        resp.status(200).json(SelectedPatient);
      }
    } catch (err) {
      resp.status(400).json(" error getting patient of this ");
    }
  });


  //delete request  from requests model and patient's requests list 
  app.post("/delrequest", async (req, resp) => {
    try {
      const { req_id, p_id } = req.body;

      await RequestsModel.remove({ _id: req_id });

      let SelectedRequest = await PatientsModel.findOne({ _id: p_id });
      let arr = [];
      let index = 0;

      for (i = 0; i < SelectedRequest.requests.length; i++) {
        if (SelectedRequest.requests[i] != req_id) {
          arr[index] = SelectedRequest.requests[i];
          index++;
        }
      }
      SelectedRequest.requests = arr;
      await SelectedRequest.save();

      resp.status(200).json("success");
    } catch (err) {
      resp.status(400).send("error .. check request ID ");
    }
  });

  //delete all  requests 
  app.get("/delRequests", async (req, resp) => {
    let output = await RequestsModel.remove({});
    resp.json(output);
  });


  //edit request 
  app.put("/editreq", async (req, resp) => {
    try {
      const { req_id } = req.body;
      RequestsModel.findOne({ _id: req_id }, function (err, foundObject) {
        if (err) {
          resp.status(500).json("error 1");
        } else {
          if (req.body.req_status) {
            foundObject.req_status = req.body.req_status;
          }
          if (req.body.req_time) {
            foundObject.req_time = req.body.req_time;
          }
          if (req.body.req_date) {
            foundObject.req_date = req.body.req_date;
          }
          if (req.body.req_notes) {
            foundObject.req_notes = req.body.req_notes;
          }
          if (req.body.req_comment) {
            foundObject.req_comment = req.body.req_comment;
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
