# NFT Marketplace

Hi! There is an overview of how to build and use the Marketplace. 

## Files

 1. ERC20.sol - simple erc20 token contract. Deployed ERC20 token can be
    used as payment token or for fees payment.
 2. TokenERC1155.sol - simple erc1155 token contract. Actually, it is an
    asset that we will sell on marketplace.
 3. WyvernProxyRegistry.sol - smart contract that  implements proxy delegate pattern. Need this to transfer assets on   behalf of token seller.
 4. WyvernTokenTransferProxy.sol - smart contract    that implements
    proxy delegate pattern. Need this to transfer erc20    tokens on
    behalf of token buyer.
 5. WyvernExchange.sol - main contract. Implements core marketplace
    logic.

## How to build the Marketplace

1. Deploy ERC20(initialSupply) // Don't forget about decimals. Thus, if you want supply 33 tokens then pass 33000000000000000000 value. 
2. Deploy TokenERC1155
3. Deploy WyvernProxyRegistry
4. Deploy WyvernTokenTransferProxy(address proxyRegistry). Pass an address of deployed WyvernProxyRegistry as proxyRegistry.
5. Deploy WyvernExchange(ProxyRegistry registryAddress, TokenTransferProxy tokenTransferProxyAddress, ERC20 tokenAddress, address protocolFeeAddress). Pass the deployed ProxyRegistry, TokenTransferProxy, ERC20 and protocolFeeAddress respectively. protocolFeeAddress may be an arbitrary etherum account.

Contract WyvernProxyRegistry

1. Call grantInitialAuthentication(exchange_address)

## How to use

### From seller

Contract WyvernProxyRegistry

1. Call registerProxy() from protocol owner.
2. Get your personal proxy from proxies(your_address). It returns proxy_address. 
3. Copy proxy_address.

> Steps 1-2 are repeated only one time for one seller.

Contract TokenERC1155

4. Call setApprovalForAll(proxy_address, true).
5. Call mint(recipient, tokenId, amount). Recipient - owner or seller address. 

Contract ERC20

7. Call transfer(recipient, amount). Recipient - an account of buyer. Because the buyer needs some tokens to make an offer. Don’t forget about decimals.

### From buyer

Contract WyvernExchange

8. Call tokenTransferProxy and copy an address.

Contract ERC20

9. Call approve(address, amount). Pass tokenTransferProxy address and amount you want to allow to transfer from your behalf.


**Now it is a time to make orders.** 



Contract WyvernExchange

1. Call hashOrder_ and pass relevant arguments of Sell order. 
2. Call hashOrder_ and pass relevant arguments of Buy order. 
Example:

```javascript
hashOrder_([
"0x97557feF28784f9E7944BD29B6112E3913bac367", // exchange address
"0xd493D783439eFC21eDEa282924b0e9df4B7D7f06", // maker
"0x0000000000000000000000000000000000000000", // taker
"0x1bB1243F77f14Cf0Be4a14D67e563bdC946ABc22", // feeRecipient
"0x37C1107Ae034aA04b9379c3CF5A7d014e198c9e0", // target (721 or 1155 address)
"0x0000000000000000000000000000000000000000", // always 0x
"0x80B7Cd8E83C0023098698BDfe9B0AeB03cECC605" // erc20 token address
],
["0", //fee
"0",  //fee
"0",  //fee
"0",  //fee
"30000000000000000000",  //erc20 or ETH value amount 
"0", // 0
"1621439539", //listing time
"0", // 0
"3442369145004854125346731409435560308517429172360251056995968581355608116400" // salt, unique for each order
],
1, // feeMethod
1, // side (buy - 0/sell - 1)
0, // saleKind
0, // howToCall
0x3434344545...545, // calldata
0x0000000000...000, // replacement pattern (always string of zero, 202 length)
0x,
false)

```

Each order needs calldata - the essential part to transfer assets from seller to buyer. To create calldata with web3js use next as an example:

    const  from  =  '0xd493D783439eFC21eDEa282924b0e9df4B7D7f06'
    const  to  =  '0xa536007321fa2854981626F907b74E3a193FaC09'
    const  tokenId  =  '1'
    
    // "CallData for ERC721"
        
    web3.eth.abi.encodeFunctionCall({
	    name:  'safeTransferFrom',
	    type:  'function',
	    inputs: [{
			    type:  'address',
			    name:  'from'
		    }, {
			    type:  'address',
			    name:  'to'
		    }, {
			    type:  'uint256',
			    name:  'tokenId'
	    }]
    }, [from, to, tokenId]);
    
    // "Calldata for ERC1155"
    
    const  amount  =  '1'
    const  data  =  '0x'
    
    web3.eth.abi.encodeFunctionCall({
	    name:  'safeTransferFrom',
	    type:  'function',
	    inputs: [{
			    type:  'address',
			    name:  'from'
		    }, {
			    type:  'address',
			    name:  'to'
		    }, {
			    type:  'uint256',
			    name:  'id'
		    }, {
			    type:  'uint256',
			    name:  'amount'
		    }, {
			    type:  'bytes',
			    name:  'data'
	    }]
    }, [from, to, tokenId, amount, data]);


**Off-chain**

3. Get hash of each order and sing it with your wallet. web3js example:

	      web3.eth.getAccounts().then((acc) => {
	    	web3.eth.personal.sign(ORDER_HASH_HERE, acc[0]).then(result => {
	    
				const  signature  = result.substring(2);
				const  r  =  "0x"  + signature.substring(0, 64);
				const  s  =  "0x"  + signature.substring(64, 128);
				const  v  =  parseInt(signature.substring(128, 130), 16);

				console.log("v: "  + v)
				console.log("r: "  + r)
				console.log("s: "  + s)
	    	});
	    });

4. Call atomicMatch_ and pass relevant arguments. Atomic match arguments consist of two orders data plus signature data.


Use this instruction in paired with video instruction for deeper understanding.
