"use strict";

const helper = require("../common/contractHelper");

async function main(companyCRN, name, location, orgRole, nameOfOrg) {
  try {
    const pharmanetContract = await helper.getContractInstance(nameOfOrg);

    // Create a new student account
    console.log(".....Create a new Company account");
    const companyBuffer = await pharmanetContract.submitTransaction(
      "registerCompany",
      companyCRN,
      name,
      location,
      orgRole
    );

    let companyObj = JSON.parse(companyBuffer.toString());

    // process response
    console.log(".....Processing Create Company Transaction Response \n\n");
    console.log(companyObj);
    console.log("\n\n.....Create Company Transaction Complete!");
    return companyObj;
  } catch (error) {
    console.log(`\n\n ${error} \n\n`);
    throw new Error(error);
  } finally {
    // Disconnect from the fabric gateway
    helper.disconnect();
  }
}

module.exports.execute = main;
