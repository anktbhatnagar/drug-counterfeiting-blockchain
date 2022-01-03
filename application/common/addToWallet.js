"use strict";

/**
 * This is a Node.JS module to load a user's Identity to his wallet.
 * This Identity will be used to sign transactions initiated by this user.
 * Defaults:
 *  User Name: MHRD_ADMIN
 *  User Organization: MHRD
 *  User Role: Admin
 *
 */

const fs = require("fs"); // FileSystem Library
const { FileSystemWallet, X509WalletMixin } = require("fabric-network"); // Wallet Library provided by Fabric
const path = require("path"); // Support library to build filesystem paths in NodeJs
console.log(__dirname);
const crypto_materials = path.resolve(__dirname, "../network/crypto-config"); // Directory where all Network artifacts are stored

// A wallet is a filesystem path that stores a collection of Identities

async function main(certificatePath, privateKeyPath, orgName) {
  // Main try/catch block
  try {
    orgName = orgName.toLowerCase();
    let wallet = new FileSystemWallet("./identity/" + orgName);
    // Fetch the credentials from our previously generated Crypto Materials required to create the identity
    const certificate = fs.readFileSync(certificatePath).toString();
    // IMPORTANT: Change the private key name to the key generated on your computer
    const privatekey = fs.readFileSync(privateKeyPath).toString();

    // Load credentials into wallet
    const identityLabel = orgName.toUpperCase() + "_ADMIN";
    const identity = X509WalletMixin.createIdentity(
      orgName + "MSP",
      certificate,
      privatekey
    );

    await wallet.import(identityLabel, identity);
  } catch (error) {
    console.log(`Error adding to wallet. ${error}`);
    console.log(error.stack);
    throw new Error(error);
  }
}

main(
  "../network/crypto-config/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp/signcerts/Admin@manufacturer.pharma-network.com-cert.pem",
  "../network/crypto-config/peerOrganizations/manufacturer.pharma-network.com/users/Admin@manufacturer.pharma-network.com/msp/keystore/9d695a8b5f5324568456c341f29aa245a59cd656607e2b93d2a4ea4e8f58f991_sk",
  "manufacturer"
).then(() => {
  console.log("Manufacturer identity added to wallet.");
});

main(
  "../network/crypto-config/peerOrganizations/distributor.pharma-network.com/users/Admin@distributor.pharma-network.com/msp/signcerts/Admin@distributor.pharma-network.com-cert.pem",
  "../network/crypto-config/peerOrganizations/distributor.pharma-network.com/users/Admin@distributor.pharma-network.com/msp/keystore/28b87133a08d6462424e66cde4c7b0247e48101ebbd8edd300cea75998be7896_sk",
  "distributor"
).then(() => {
  console.log("Distributor identity added to wallet.");
});

main(
  "../network/crypto-config/peerOrganizations/retailer.pharma-network.com/users/Admin@retailer.pharma-network.com/msp/signcerts/Admin@retailer.pharma-network.com-cert.pem",
  "../network/crypto-config/peerOrganizations/retailer.pharma-network.com/users/Admin@retailer.pharma-network.com/msp/keystore/36af803d469482e7789cb2c49ca9048d8edd3f9cb9c8c48bc3ed89484bc0b6a0_sk",
  "retailer"
).then(() => {
  console.log("Retailer identity added to wallet.");
});

main(
  "../network/crypto-config/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp/signcerts/Admin@consumer.pharma-network.com-cert.pem",
  "../network/crypto-config/peerOrganizations/consumer.pharma-network.com/users/Admin@consumer.pharma-network.com/msp/keystore/54a077cee0b42e748d39c88ea0edacb07ac9671a494ec4c48301683b163b0a7b_sk",
  "consumer"
).then(() => {
  console.log("Consumer identity added to wallet.");
});

main(
  "../network/crypto-config/peerOrganizations/transporter.pharma-network.com/users/Admin@transporter.pharma-network.com/msp/signcerts/Admin@transporter.pharma-network.com-cert.pem",
  "../network/crypto-config/peerOrganizations/transporter.pharma-network.com/users/Admin@transporter.pharma-network.com/msp/keystore/71832aebe4136df851e28d2b5ec3b6e16466dff4c4d208dc4ba018744dd6e783_sk",
  "transporter"
).then(() => {
  console.log("Transporter identity added to wallet.");
});

module.exports.execute = main;
