"use strict";

const helper = require("../common/contractHelper");

async function main(buyerCRN, drugName, transporterCRN, nameOfOrg) {
  try {
    const pharmanetContract = await helper.getContractInstance(nameOfOrg);

    // Update an exisiting shipping
    console.log(".....Update an exisiting shipping");
    const shipimentBuffer = await pharmanetContract.submitTransaction(
      "updateShipment",
      buyerCRN,
      drugName,
      transporterCRN
    );

    let shipimentObj = JSON.parse(shipimentBuffer.toString());

    // process response
    console.log(".....Processing Update Shipping Transaction Response \n\n");
    console.log(shipimentObj);
    console.log("\n\n.....Update Shipping Transaction Complete!");
    return shipimentObj;
  } catch (error) {
    console.log(`\n\n ${error} \n\n`);
    throw new Error(error);
  } finally {
    helper.disconnect();
  }
}

module.exports.execute = main;
