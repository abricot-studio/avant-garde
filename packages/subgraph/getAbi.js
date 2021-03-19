const fs = require("fs");

const abi = require('@arbart/contracts/dist/ArbArt.abi.json');


if (!fs.existsSync('./abi')) {
  fs.mkdirSync('./abi');
}
fs.writeFileSync('./abi/ArbArt.json', JSON.stringify(abi));
