"use strict";

const helper = require("../common/contractHelper");

async function main(
  buyerCRN,
  drugName,
  listOfAssets,
  transporterCRN,
  nameOfOrg
) {
  try {
    const pharmanetContract = await helper.getContractInstance(nameOfOrg);

    // Create a new Shipment
    console.log(".....Create a new Shipment");
    const shipmentBuffer = await pharmanetContract.submitTransaction(
      "createShipment",
      buyerCRN,
      drugName,
      listOfAssets,
      transporterCRN
    );

    let shipmentObj = JSON.parse(shipmentBuffer.toString());

    // process response
    console.log(".....Processing Create Shipment Transaction Response \n\n");
    console.log(shipmentObj);
    console.log("\n\n.....Create Shipment Transaction Complete!");
    return shipmentObj;
  } catch (error) {
    console.log(`\n\n ${error} \n\n`);
    throw new Error(error);
  } finally {
    helper.disconnect();
  }
}

module.exports.execute = main;
