var ResultModel = require("../../Models/MedicalModels/results.model")
var patientModel = require("../../Models/MedicalModels/patient.model")

var lodash = require('lodash')
module.exports = function (app) {

    //add result file for an accepted medical test 
    app.post("/addfile", async (req, resp) => {
        try {
            const { res_id, file_id, file_name } = req.body;
            let SelectedResults = await ResultModel.findOne({ _id: res_id });
            SelectedResults.result_file_id = file_id;
            SelectedResults.result_file_name = file_name;

            await SelectedResults.save();
            resp.status(200).json(SelectedResults);
        } catch (err) {
            resp.status(400).json(" error  ");
        }
    });

    //get all  results 
    app.get("/getreqs", async (req, resp) => {
        let request = await ResultModel.find({});
        resp.status(200).json(request);
    });

    //remove all results 
    app.get("/removeresults", async (req, resp) => {
        await ResultModel.remove({});
        resp.status(200).json("success");

    })

    // get result by specific accepted request 
    app.post("/resbyaccid", async (req, resp) => {
        try {
            const { acc_id } = req.body
            let selectedResult = await ResultModel.find({});
            let selectedRequest = lodash.filter(selectedResult, x => x.acc_id === acc_id)
            if (selectedRequest) {
                resp.status(200).json(selectedRequest);
            }
        } catch (err) {
            resp.status(400).json(" error finding accepted requestsssss ");
        }
    })

    // add result to patient's results list 
    app.post("/addresulttopatient", async (req, resp) => {
        try {
            const { p_id, res_id } = req.body;
            let medicine = await ResultModel.findOne({ _id: res_id });
            if (medicine) {
                let SelectedPatient = await patientModel.findOne({ _id: p_id });
                if (SelectedPatient) {
                    SelectedPatient.results.push(res_id);
                }
                await SelectedPatient.save();
                resp.status(200).json(SelectedPatient);
            }


        } catch (err) {
            resp.status(400).send("error in Updating Medicines");
        }
    });

    //{duplicated }
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
};
