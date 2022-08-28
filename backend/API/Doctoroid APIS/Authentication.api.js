var PatientsModel = require("../../Models/MedicalModels/patient.model");
const jwt = require("jsonwebtoken");


require("dotenv").config();
module.exports = function (app) {
  //token generation function
  function generateAccessToken() {
    const token = jwt.sign(
      {
        _id: this._id,
        email: this.email
      },
      process.env.jwtPrivateKey
    );
    return token;
  }

  //signin existed patient
  app.post("/signin", async (req, resp) => {
    let user = await PatientsModel.findOne({
      email: req.body.email,
      password: req.body.password
    });
    if (!user) resp.status(401).send("Invalid email or password.");

    if (user) {
      //         //create and assign token

      const token = generateAccessToken();
      let confirm = user.confirm;
      let userId = user._id
      resp.header("x-auth-token", token).send({ "token": token, "confirm": confirm, "p_id": userId });
    } else {
      resp.status(400).send(error.message);
    }
  });

  /// signout
  app.get("/signout", async (req, resp) => {
    resp.status(200).send("success");
  });
};
