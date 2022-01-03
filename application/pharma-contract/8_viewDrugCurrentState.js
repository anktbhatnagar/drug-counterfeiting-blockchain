"use strict";

const helper = require("../common/contractHelper");

async function main(drugName, serialNo, nameOfOrg) {
  try {
    const pharmanetContract = await helper.getContractInstance(nameOfOrg);

    // View Current state of a Drug
    console.log(".....View Current state of a Drug");
    const drugStateBuffer = await pharmanetContract.submitTransaction(
      "viewDrugCurrentState",
      drugName,
      serialNo
    );

    let drugStateObj = JSON.parse(drugStateBuffer.toString());

    // process response
    console.log(
      ".....Processing View Drug Current State Transaction Response \n\n"
    );
    console.log(drugStateObj);
    console.log("\n\n.....View Drug Current State Transaction Complete!");
    return drugStateObj;
  } catch (error) {
    console.log(`\n\n ${error} \n\n`);
    throw new Error(error);
  } finally {
    helper.disconnect();
  }
}

module.exports.execute = main;
