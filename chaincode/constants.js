const constants = {
  namespaces: {
    pharma: "org.pharma-network.pharmanet",
    company: "org.pharma-network.pharmanet.company",
    drug: "org.pharma-network.pharmanet.drug",
    purchaseOrder: "org.pharma-network.pharmanet.purchaseorder",
    shipment: "org.pharma-network.pharmanet.shipment",
  },
  organisationRoles: ["manufacturer", "distributor", "retailer", "transporter"],
  shipmentStatus: {
    InTransit: "in-transit",
    Delivered: "delivered",
  },
  organisationMSPs: {
    manufacturerMSP: 1,
    distributorMSP: 2,
    retailerMSP: 4,
    consumerMSP: 8,
    transporterMSP: 16,
  },
  organisations: {
    manufacturer: "manufacturer",
    distributor: "distributor",
    retailer: "retailer",
    consumer: "consumer",
    transporter: "transporter",
  },
};

module.exports = constants;
