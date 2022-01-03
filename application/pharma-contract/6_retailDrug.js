"use strict";

const helper = require("../common/contractHelper");

async function main(
  drugName,
  serialNo,
  retailerCRN,
  customerAadhar,
  nameOfOrg
) {
  try {
    const pharmanetContract = await helper.getContractInstance(nameOfOrg);

    // Create a new drug retail purchase
    console.log(".....Create a new drug retail purchase");
    const retailBuffer = await pharmanetContract.submitTransaction(
      "retailDrug",
      drugName,
      serialNo,
      retailerCRN,
      customerAadhar
    );

    let retailObj = JSON.parse(retailBuffer.toString());

    // process response
    console.log(".....Processing Drug Retail Transaction Response \n\n");
    console.log(retailObj);
    console.log("\n\n.....Drug Retail Transaction Complete!");
    return retailObj;
  } catch (error) {
    console.log(`\n\n ${error} \n\n`);
    throw new Error(error);
  } finally {
    helper.disconnect();
  }
}

module.exports.execute = main;
