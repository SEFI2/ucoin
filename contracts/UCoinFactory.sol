import "./UCoin.sol";

pragma solidity ^0.5.0;


contract UCoinFactory {

    mapping(address => address[]) public created;
    mapping(address => bool) public isUCoin; //verify without having to do a bytecode check.
    bytes public UCoinByteCode; // solhint-disable-line var-name-mixedcase

    constructor () public {
        //upon creation of the factory, deploy a EIP20 (parameters are meaningless) and store the bytecode provably.
        address verifiedToken = createUCoin(10000, "Verify Token", 3, "UCoin");
        UCoinByteCode = codeAt(verifiedToken);
    }

    //verifies if a contract that has been deployed is a Human Standard Token.
    //NOTE: This is a very expensive function, and should only be used in an eth_call. ~800k gas
    function verifyUCoin(address _tokenContract) public view returns (bool) {
        bytes memory fetchedTokenByteCode = codeAt(_tokenContract);

        if (fetchedTokenByteCode.length != UCoinByteCode.length) {
            return false; //clear mismatch
        }

      //starting iterating through it if lengths match
        for (uint i = 0; i < fetchedTokenByteCode.length; i++) {
            if (fetchedTokenByteCode[i] != UCoinByteCode[i]) {
                return false;
            }
        }
        return true;
    }

    function createUCoin(uint256 _initialAmount, string memory _name, uint8 _decimals, string memory _symbol)
        public
    returns (address) {

        UCoin newToken = (new UCoin(_initialAmount, _name, _decimals, _symbol));
        created[msg.sender].push(address(newToken));
        isUCoin[address(newToken)] = true;
        //the factory will own the created tokens. You must transfer them.
        newToken.transfer(msg.sender, _initialAmount);
        return address(newToken);
    }

    //for now, keeping this internal. Ideally there should also be a live version of this that
    // any contract can use, lib-style.
    //retrieves the bytecode at a specific address.
    function codeAt(address _addr) internal view returns (bytes memory outputCode) {
        assembly { // solhint-disable-line no-inline-assembly
            // retrieve the size of the code, this needs assembly
            let size := extcodesize(_addr)
            // allocate output byte array - this could also be done without assembly
            // by using outputCode = new bytes(size)
            outputCode := mload(0x40)
            // new "memory end" including padding
            mstore(0x40, add(outputCode, and(add(add(size, 0x20), 0x1f), not(0x1f))))
            // store length in memory
            mstore(outputCode, size)
            // actually retrieve the code, this needs assembly
            extcodecopy(_addr, add(outputCode, 0x20), 0, size)
        }
    }
}
