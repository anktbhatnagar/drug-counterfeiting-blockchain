"use strict";

const { BaseModel } = require("./base-model");

class Drug extends BaseModel {
  constructor() {
    super();
    this.productID = "";
    this.name = "";
    this.manufacturer = "";
    this.manufacturingDate = "";
    this.expiryDate = "";
    this.owner = "";
    this.shipment = null;
  }

  static from(bufferOrJson) {
    let json = this.getJSONFromBuffer(bufferOrJson);
    if (!json) {
      return null;
    }
    return Object.assign(new Drug(), json);
  }
}

module.exports = Drug;
