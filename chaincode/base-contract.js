"use strict";

const { Contract } = require("fabric-contract-api");
const constants = require("./constants");
const keys = require("./keys");
const Company = require("./models/company");
const Drug = require("./models/drug");

class BaseContract extends Contract {
  constructor(namespace) {
    super(namespace);
  }

  async _getCompanyKey(ctx, crn) {
    let crnResultsIterator = await ctx.stub.getStateByPartialCompositeKey(
      constants.namespaces.company,
      [crn]
    );

    let responseRange = await crnResultsIterator.next();

    if (!responseRange || !responseRange.value || !responseRange.value.key) {
      return null;
    }

    return responseRange.value.key;
  }

  async _getCompany(ctx, crn) {
    const companyKey = await this._getCompanyKey(ctx, crn);

    console.log(companyKey);
    if (companyKey) {
      const companyBuffer = await ctx.stub.getState(companyKey);
      return Company.from(companyBuffer);
    }
    return null;
  }

  async _getCompanyObject(ctx, companyCRN, companyName) {
    const companyKey = ctx.stub.createCompositeKey(
      constants.namespaces.company,
      [companyCRN, companyName]
    );

    let companyBuffer = await ctx.stub
      .getState(companyKey)
      .catch((err) => console.log(err));

    return Company.from(companyBuffer);
  }

  async _getDrug(ctx, drugName, serialNo) {
    const drugKey = ctx.stub.createCompositeKey(constants.namespaces.drug, [
      drugName,
      serialNo,
    ]);

    let drugBuffer = await ctx.stub
      .getState(drugKey)
      .catch((err) => console.log(err));

    return Drug.from(drugBuffer);
  }

  _checkIfValidOrganisationRole(organisationRole) {
    return (
      constants.organisationRoles.indexOf(organisationRole.toLowerCase()) >= 0
    );
  }

  _getHierarchyKey(organisationRole) {
    if (organisationRole.toLowerCase() == "manufacturer") return 1;
    if (organisationRole.toLowerCase() == "distributor") return 2;
    if (organisationRole.toLowerCase() == "retailer") return 3;
    return null;
  }

  _authorize(ctx, mspConfig) {
    const mspId = ctx.clientIdentity.getMSPID();
    return mspConfig & constants.organisationMSPs[mspId];
  }

  async _checkIfCompanyExists(ctx, companyCRN, companyName) {
    let company = await this._getCompanyObject(ctx, companyCRN, companyName);

    return company != undefined && company != null;
  }

  async _checkIfDrugExists(ctx, drugName, serialNo) {
    let drug = await this._getDrug(ctx, drugName, serialNo);

    return drug != undefined && drug != null;
  }
}

module.exports = { BaseContract };
