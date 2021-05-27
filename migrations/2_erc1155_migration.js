const TokenERC1155 = artifacts.require("TokenERC1155");

module.exports = function(deployer) {
    deployer.deploy(TokenERC1155,
        "https://TokenERC1155/api/item/{id}.json");
};