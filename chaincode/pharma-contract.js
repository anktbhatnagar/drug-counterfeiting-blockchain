"use strict";

const constants = require("./constants");
const keys = require("./keys");
const { BaseContract } = require("./base-contract");
const Company = require("./models/company");
const Drug = require("./models/drug");
const PurchaseOrder = require("./models/purchase-order");
const Shipment = require("./models/shipment");

class PharmaContract extends BaseContract {
  constructor() {
    super(constants.namespaces.pharma);
  }

  async registerCompany(
    ctx,
    companyCRN,
    companyName,
    location,
    organisationRole
  ) {
    if (
      !this._authorize(
        ctx,
        constants.organisationMSPs.manufacturerMSP |
          constants.organisationMSPs.retailerMSP |
          constants.organisationMSPs.distributorMSP |
          constants.organisationMSPs.transporterMSP
      )
    ) {
      throw new Error(
        "No one can register a company other than manufacturer,retailer,distributor and transporter."
      );
      return;
    }

    if (await this._checkIfCompanyExists(ctx, companyCRN, companyName)) {
      throw new Error("Company Already exist.");
      return;
    }

    if (!this._checkIfValidOrganisationRole(organisationRole)) {
      throw new Error("Invalid Organisation role.");
      return;
    }

    const companyKey = ctx.stub.createCompositeKey(
      constants.namespaces.company,
      [companyCRN, companyName]
    );

    let hierarchyKey = this._getHierarchyKey(organisationRole);

    let companyObj = Company.from({
      companyID: companyKey,
      name: companyName,
      location,
      organisationRole,
      hierarchyKey,
    });

    let dataBuffer = companyObj.toBuffer();

    await ctx.stub.putState(companyKey, dataBuffer);
    //await this._addCompany(ctx, companyCRN, companyKey);

    return companyObj;
  }

  async addDrug(ctx, drugName, serialNo, mfgDate, expDate, companyCRN) {
    if (!this._authorize(ctx, constants.organisationMSPs.manufacturerMSP)) {
      throw new Error("Only mnufacturer can add a drug.");
      return;
    }

    if (await this._checkIfDrugExists(ctx, drugName, serialNo)) {
      throw new Error("Drug Already exist.");
      return;
    }

    const companyObj = await this._getCompany(ctx, companyCRN);

    if (!companyObj) {
      throw new Error("Company doesn't exist.");
      return;
    }

    const drugKey = ctx.stub.createCompositeKey(constants.namespaces.drug, [
      drugName,
      serialNo,
    ]);

    let drugObj = Drug.from({
      productID: drugKey,
      name: drugName,
      manufacturer: companyObj.companyID,
      manufacturingDate: mfgDate,
      expiryDate: expDate,
      owner: companyObj.companyID,
      shipment: null,
    });

    let dataBuffer = drugObj.toBuffer();

    await ctx.stub.putState(drugKey, dataBuffer);

    return drugObj;
  }

  async createPO(ctx, buyerCRN, sellerCRN, drugName, quantity) {
    console.log("PO 0");
    if (
      !this._authorize(
        ctx,
        constants.organisationMSPs.retailerMSP |
          constants.organisationMSPs.distributorMSP
      )
    ) {
      throw new Error(
        "Only retailer or distributor can create a purchase order."
      );
      return;
    }

    const buyerObj = await this._getCompany(ctx, buyerCRN);

    if (!buyerObj) {
      throw new Error("Buyer doesn't exist.");
      return;
    }

    if (
      buyerObj.organisationRole.toLowerCase() !=
        constants.organisations.distributor &&
      buyerObj.organisationRole.toLowerCase() !=
        constants.organisations.retailer
    ) {
      throw new Error("Buyer CRN isn't a retailer or distributor.");
      return;
    }

    const sellerObj = await this._getCompany(ctx, sellerCRN);

    if (!sellerObj) {
      throw new Error("Seller doesn't exist.");
      return;
    }

    if (buyerObj.hierarchyKey != sellerObj.hierarchyKey + 1) {
      throw new Error(
        "Purchase order can not be created for a" +
          buyerObj.organisationRole +
          " to directly buy from " +
          sellerObj.organisationRole
      );
      return;
    }

    const buyerKey = buyerObj.companyID;

    const sellerKey = sellerObj.companyID;

    const poKey = ctx.stub.createCompositeKey(
      constants.namespaces.purchaseOrder,
      [buyerCRN, drugName]
    );

    let poObj = PurchaseOrder.from({
      poID: poKey,
      drugName: drugName,
      quantity: quantity,
      buyer: buyerKey,
      seller: sellerKey,
    });

    let dataBuffer = poObj.toBuffer();

    await ctx.stub.putState(poKey, dataBuffer);
    console.log("PO 9");
    return poObj;
  }

  async createShipment(ctx, buyerCRN, drugName, listOfAssets, transporterCRN) {
    if (
      !this._authorize(
        ctx,
        constants.organisationMSPs.manufacturerMSP |
          constants.organisationMSPs.distributorMSP
      )
    ) {
      throw new Error(
        "only manufacturer or distributor can create a shipment."
      );
      return;
    }

    if (!listOfAssets) {
      throw new Error("Shipment asset can't be empty or null.");
      return;
    }

    listOfAssets = listOfAssets.split(",");

    const buyerObj = await this._getCompany(ctx, buyerCRN);

    if (!buyerObj) {
      throw new Error("Buyer doesn't exist.");
      return;
    }
    const buyerKey = buyerObj.companyID;

    const transporterObj = await this._getCompany(ctx, transporterCRN);

    if (!transporterObj) {
      throw new Error("Transporter doesn't exist.");
      return;
    }

    const transporterKey = transporterObj.companyID;

    const poKey = ctx.stub.createCompositeKey(
      constants.namespaces.purchaseOrder,
      [buyerCRN, drugName]
    );

    const poBuffer = await ctx.stub.getState(poKey);

    let poObj = PurchaseOrder.from(poBuffer);
    if (!poObj) {
      throw new Error("Purchase order doesn't exist.");
      return;
    }

    if (poObj.quantity != listOfAssets.length) {
      throw new Error(
        "Purchase order drug quantity doesn't match with shipment asset quantity."
      );
      return;
    }

    const shipmentKey = ctx.stub.createCompositeKey(
      constants.namespaces.shipment,
      [buyerCRN, drugName]
    );

    for (let i = 0; i <= listOfAssets.length - 1; i++) {
      let drugSerialNo = listOfAssets[i];

      let drugKey = ctx.stub.createCompositeKey(constants.namespaces.drug, [
        drugName,
        drugSerialNo,
      ]);

      let drugBuffer = await ctx.stub.getState(drugKey);

      let drugObj = Drug.from(drugBuffer);
      if (!drugObj) {
        throw new Error("Drug doesn't exist.");
        return;
      }

      drugObj.owner = transporterKey;
      if (!drugObj.shipment) {
        drugObj.shipment = [];
      }
      drugObj.shipment.push(shipmentKey);
      await ctx.stub.putState(drugKey, drugObj.toBuffer());
    }

    let shipmentObj = Shipment.from({
      shipmentID: shipmentKey,
      creator: buyerCRN,
      assets: listOfAssets,
      transporter: transporterKey,
      status: constants.shipmentStatus.InTransit,
    });

    let dataBuffer = shipmentObj.toBuffer();

    await ctx.stub.putState(shipmentKey, dataBuffer);

    await ctx.stub.putState(poKey, Buffer.from(JSON.stringify("")));

    return shipmentObj;
  }

  async updateShipment(ctx, buyerCRN, drugName, transporterCRN) {
    if (!this._authorize(ctx, constants.organisationMSPs.transporterMSP)) {
      throw new Error("only transporter can update a shipment.");
      return;
    }

    const buyerObj = await this._getCompany(ctx, buyerCRN);

    if (!buyerObj) {
      throw new Error("Buyer doesn't exist.");
      return;
    }
    const buyerKey = buyerObj.companyID;

    const transporterObj = await this._getCompany(ctx, transporterCRN);

    if (!transporterObj) {
      throw new Error("Transporter doesn't exist.");
      return;
    }

    const transporterKey = transporterObj.companyID;

    const shipmentKey = ctx.stub.createCompositeKey(
      constants.namespaces.shipment,
      [buyerCRN, drugName]
    );

    let shipmentBuffer = await ctx.stub
      .getState(shipmentKey)
      .catch((err) => console.log(err));

    let shipmentObj = Shipment.from(shipmentBuffer);

    if (!shipmentObj) {
      throw new Error("Shipment doesn't exist.");
      return;
    }

    let allAssets = [];

    for (let i = 0; i <= shipmentObj.assets.length - 1; i++) {
      let drugSerialNo = shipmentObj.assets[i];

      let drugKey = ctx.stub.createCompositeKey(constants.namespaces.drug, [
        drugName,
        drugSerialNo,
      ]);

      let drugBuffer = await ctx.stub.getState(drugKey);

      let drugObj = Drug.from(drugBuffer);
      if (!drugObj) {
        throw new Error("Drug doesn't exist.");
        return;
      }

      drugObj.owner = buyerKey;
      await ctx.stub.putState(drugKey, drugObj.toBuffer());
      allAssets.push(drugObj);
    }

    shipmentObj.status = constants.shipmentStatus.Delivered;
    await ctx.stub.putState(shipmentKey, shipmentObj.toBuffer());

    return { shipment: shipmentObj, assets: allAssets };
  }

  async retailDrug(ctx, drugName, serialNo, retailerCRN, customerAadhar) {
    if (!this._authorize(ctx, constants.organisationMSPs.retailerMSP)) {
      throw new Error("only retailer can sell a drug.");
      return;
    }

    let retailerObj = await this._getCompany(ctx, retailerCRN);

    if (!retailerObj) {
      throw new Error("retailer doesn't exist.");
      return;
    }

    const drugKey = ctx.stub.createCompositeKey(constants.namespaces.drug, [
      drugName,
      serialNo,
    ]);

    let drugBuffer = await ctx.stub
      .getState(drugKey)
      .catch((err) => console.log(err));

    let drugObj = Drug.from(drugBuffer);

    if (drugObj.owner != retailerObj.companyID) {
      throw new Error("retailer isn't the owner this drug.");
      return;
    }

    drugObj.owner = customerAadhar;
    await ctx.stub.putState(drugKey, drugObj.toBuffer());

    return drugObj;
  }

  async viewHistory(ctx, drugName, serialNo) {
    const drugKey = ctx.stub.createCompositeKey(constants.namespaces.drug, [
      drugName,
      serialNo,
    ]);
    let drugBuffer = await ctx.stub.getState(drugKey);

    let drugObj = Drug.from(drugBuffer);
    if (!drugObj) {
      throw new Error("Drug doesn't exist.");
      return;
    }

    let iterator = await ctx.stub.getHistoryForKey(drugKey);

    let historyDataObj = [];
    let res = await iterator.next();

    while (!res.done) {
      if (res.value) {
        const data = JSON.parse(res.value.value.toString("utf8"));
        historyDataObj.push(data);
      }
      res = await iterator.next();
    }
    await iterator.close();

    return historyDataObj;
  }

  async viewDrugCurrentState(ctx, drugName, serialNo) {
    const drugKey = ctx.stub.createCompositeKey(constants.namespaces.drug, [
      drugName,
      serialNo,
    ]);
    let drugBuffer = await ctx.stub.getState(drugKey);

    let drugObj = Drug.from(drugBuffer);
    if (!drugObj) {
      throw new Error("Drug doesn't exist.");
      return;
    }

    return drugObj;
  }

  async instantiate(ctx) {
    console.log("Pharma Smart Contract Instantiated");
  }
}

module.exports = PharmaContract;
