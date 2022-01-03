"use strict";

const helper = require("../common/contractHelper");

async function main(buyerCRN, sellerCRN, drugName, quantity, nameOfOrg) {
  try {
    console.log("1");

    const pharmanetContract = await helper.getContractInstance(nameOfOrg);
    console.log("2");
    console.log(nameOfOrg);
    console.log(pharmanetContract);
    // Create a new Purchase Order
    console.log(".....Create a new Purchase Order");
    const poBuffer = await pharmanetContract.submitTransaction(
      "createPO",
      buyerCRN,
      sellerCRN,
      drugName,
      quantity
    );

    console.log("3");

    let poObj = JSON.parse(poBuffer.toString());

    // process response
    console.log(
      ".....Processing Create Purchase Order Transaction Response \n\n"
    );
    console.log(poObj);
    console.log("\n\n.....Create Purchase Order Transaction Complete!");
    return poObj;
  } catch (error) {
    console.log(`\n\n ${error} \n\n`);
    throw new Error(error);
  } finally {
    helper.disconnect();
  }
}

module.exports.execute = main;
