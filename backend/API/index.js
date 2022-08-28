function RunAPIS(app) {
    require('./general APIS/patient.api')(app)
    require('./general APIS/medicines.api')(app)
    require('./Doctoroid APIS/Register.api')(app)
    require('./Doctoroid APIS/Authentication.api')(app)
    require('./general APIS/hospital.api')(app)
    require('./general APIS/Categories.api')(app)
    require('./Dashboard APIS/AdminAuth.api')(app)
    require('./general APIS/Requests.api')(app)
    require('./general APIS/results.api')(app)
    require('./fileUpload.api')(app)
}
module.exports = RunAPIS