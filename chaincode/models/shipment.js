"use strict";

const { BaseModel } = require("./base-model");

class Shipment extends BaseModel {
  constructor() {
    super();
    this.shipmentID = "";
    this.creator = "";
    this.assets = [];
    this.transporter = "";
    this.status = "";
  }

  static from(bufferOrJson) {
    let json = this.getJSONFromBuffer(bufferOrJson);
    if (!json) {
      return null;
    }
    return Object.assign(new Shipment(), json);
  }
}

module.exports = Shipment;
