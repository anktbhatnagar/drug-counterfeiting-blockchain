"use strict";

const helper = require("../common/contractHelper");

async function main(drugName, serialNo, nameOfOrg) {
  try {
    const pharmanetContract = await helper.getContractInstance(nameOfOrg);

    // View Drug History
    console.log(".....View Drug History");
    const drugHistoryBuffer = await pharmanetContract.submitTransaction(
      "viewHistory",
      drugName,
      serialNo
    );

    let drugHistoryObj = JSON.parse(drugHistoryBuffer.toString());

    // process response
    console.log(".....Processing View Drug History Transaction Response \n\n");
    console.log(drugHistoryObj);
    console.log("\n\n.....View Drug History Transaction Complete!");
    return drugHistoryObj;
  } catch (error) {
    console.log(`\n\n ${error} \n\n`);
    throw new Error(error);
  } finally {
    helper.disconnect();
  }
}

module.exports.execute = main;
