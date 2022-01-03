const express = require("express");
const app = express();
const cors = require("cors");
const port = 3000;

const addToWallet = require("./common/addToWallet");

const registerCompany = require("./pharma-contract/1_registerCompany");
const addDrug = require("./pharma-contract/2_addDrug");
const createPO = require("./pharma-contract/3_createPO");
const createShipment = require("./pharma-contract/4_createShipment");
const updateShipment = require("./pharma-contract/5_updateShipment");
const retailDrug = require("./pharma-contract/6_retailDrug");
const viewHistory = require("./pharma-contract/7_viewHistory");
const viewDrugCurrentState = require("./pharma-contract/8_viewDrugCurrentState");

// Define Express app settings
app.use(cors());
app.use(express.json()); // for parsing application/json
app.use(express.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.set("title", "Pharma App");

app.get("/", (req, res) => res.send("Welcome to Pharma App"));

app.post("/registerCompany", (req, res) => {
  registerCompany
    .execute(
      req.body.companyCRN,
      req.body.name,
      req.body.location,
      req.body.orgRole,
      req.body.nameOfOrg
    )
    .then((company) => {
      console.log("New company account created");
      const result = {
        status: "success",
        message: "New company account created",
        company: company,
      };
      res.json(result);
    })
    .catch((e) => {
      const result = {
        status: "error",
        message: "Failed",
        error: e,
      };
      res.status(500).send(result);
    });
});

app.post("/addDrug", (req, res) => {
  addDrug
    .execute(
      req.body.drugName,
      req.body.serialNo,
      req.body.mfgDate,
      req.body.expDate,
      req.body.companyCRN,
      req.body.nameOfOrg
    )
    .then((drug) => {
      console.log("Drug added");
      const result = {
        status: "success",
        message: "Drug added",
        drug: drug,
      };
      res.json(result);
    })
    .catch((e) => {
      const result = {
        status: "error",
        message: "Failed",
        error: e,
      };
      res.status(500).send(result);
    });
});

app.post("/createPO", (req, res) => {
  createPO
    .execute(
      req.body.buyerCRN,
      req.body.sellerCRN,
      req.body.drugName,
      req.body.quantity,
      req.body.nameOfOrg
    )
    .then((po) => {
      console.log("New purchase order created");
      const result = {
        status: "success",
        message: "New purchase order created",
        purchaseOrder: po,
      };
      res.json(result);
    })
    .catch((e) => {
      const result = {
        status: "error",
        message: "Failed",
        error: e,
      };
      res.status(500).send(result);
    });
});

app.post("/createShipment", (req, res) => {
  createShipment
    .execute(
      req.body.buyerCRN,
      req.body.drugName,
      req.body.listOfAssets,
      req.body.transporterCRN,
      req.body.nameOfOrg
    )
    .then((shipment) => {
      console.log("New shipment created");
      const result = {
        status: "success",
        message: "New shipment created",
        shipment: shipment,
      };
      res.json(result);
    })
    .catch((e) => {
      const result = {
        status: "error",
        message: "Failed",
        error: e,
      };
      res.status(500).send(result);
    });
});

app.post("/updateShipment", (req, res) => {
  updateShipment
    .execute(
      req.body.buyerCRN,
      req.body.drugName,
      req.body.transporterCRN,
      req.body.nameOfOrg
    )
    .then((shipment) => {
      console.log("Shipment status updated");
      const result = {
        status: "success",
        message: "Shipment status updated",
        shipment: shipment,
      };
      res.json(result);
    })
    .catch((e) => {
      const result = {
        status: "error",
        message: "Failed",
        error: e,
      };
      res.status(500).send(result);
    });
});

app.post("/retailDrug", (req, res) => {
  retailDrug
    .execute(
      req.body.drugName,
      req.body.serialNo,
      req.body.retailerCRN,
      req.body.customerAadhar,
      req.body.nameOfOrg
    )
    .then((purchase) => {
      console.log("Drug purchased by consumer");
      const result = {
        status: "success",
        message: "Drug purchased by consumer",
        purchase: purchase,
      };
      res.json(result);
    })
    .catch((e) => {
      const result = {
        status: "error",
        message: "Failed",
        error: e,
      };
      res.status(500).send(result);
    });
});

app.post("/viewHistory", (req, res) => {
  viewHistory
    .execute(req.body.drugName, req.body.serialNo, req.body.nameOfOrg)
    .then((history) => {
      console.log("Drug history data recieved");
      const result = {
        status: "success",
        history: history,
      };
      res.json(result);
    })
    .catch((e) => {
      const result = {
        status: "error",
        message: "Failed",
        error: e,
      };
      res.status(500).send(result);
    });
});

app.post("/viewDrugCurrentState", (req, res) => {
  viewDrugCurrentState
    .execute(req.body.drugName, req.body.serialNo, req.body.nameOfOrg)
    .then((drudState) => {
      console.log("Drug current state data recieved");
      const result = {
        status: "success",
        drudState: drudState,
      };
      res.json(result);
    })
    .catch((e) => {
      const result = {
        status: "error",
        message: "Failed",
        error: e,
      };
      res.status(500).send(result);
    });
});

app.listen(port, () =>
  console.log(`Distributed Pharma App listening on port ${port}!`)
);
