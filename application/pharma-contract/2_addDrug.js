"use strict";

const helper = require("../common/contractHelper");

async function main(
  drugName,
  serialNo,
  mfgDate,
  expDate,
  companyCRN,
  nameOfOrg
) {
  try {
    const pharmanetContract = await helper.getContractInstance(nameOfOrg);

    // Create a new drug
    console.log(".....Create a new Drug");
    const drugBuffer = await pharmanetContract.submitTransaction(
      "addDrug",
      drugName,
      serialNo,
      mfgDate,
      expDate,
      companyCRN
    );

    let drugObj = JSON.parse(drugBuffer.toString());

    // process response
    console.log(".....Processing Create Drug Transaction Response \n\n");
    console.log(drugObj);
    console.log("\n\n.....Create Drug Transaction Complete!");
    return drugObj;
  } catch (error) {
    console.log(`\n\n ${error} \n\n`);
    throw new Error(error);
  } finally {
    // Disconnect from the fabric gateway
    helper.disconnect();
  }
}

module.exports.execute = main;
