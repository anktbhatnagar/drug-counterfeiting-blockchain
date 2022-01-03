"use strict";

const { BaseModel } = require("./base-model");

class Company extends BaseModel {
  constructor() {
    super();
    this.companyID = "";
    this.name = "";
    this.location = "";
    this.organisationRole = "";
    this.hierarchyKey = null;
  }

  static from(bufferOrJson) {
    let json = this.getJSONFromBuffer(bufferOrJson);
    if (!json) {
      return null;
    }
    return Object.assign(new Company(), json);
  }
}

module.exports = Company;
