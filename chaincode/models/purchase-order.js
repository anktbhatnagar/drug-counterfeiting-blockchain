"use strict";

const { BaseModel } = require("./base-model");

class PurchaseOrder extends BaseModel {
  constructor() {
    super();
    this.poID = "";
    this.drugName = "";
    this.quantity = "";
    this.buyer = "";
    this.seller = "";
  }

  static from(bufferOrJson) {
    let json = this.getJSONFromBuffer(bufferOrJson);
    if (!json) {
      return null;
    }
    return Object.assign(new PurchaseOrder(), json);
  }
}

module.exports = PurchaseOrder;
