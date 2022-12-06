// SPDX-License-Identifier: MIT
pragma solidity ^0.8.17;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Context.sol";

contract WhitelistContract is Context, Ownable {
    mapping (address => bool) public WhitelistedAddresses;

    uint256 public maxAddressToWhitelist;

    uint256 public addressWhitelisted;

    uint256 public whitelistDeadline;

    function startWhitelist (uint256 _maxAddressToWhitelist) public onlyOwner returns (bool) {
        unchecked {
            maxAddressToWhitelist = _maxAddressToWhitelist;
            whitelistDeadline = block.timestamp + 7 days;
        }
       return true;
    } 

    modifier deadline {
        require(block.timestamp <= whitelistDeadline, "whitelist deadline reached");
        _;
    }
    modifier maxAddressCheck {
        require(addressWhitelisted < maxAddressToWhitelist, "max address for whitelist reached");
        _;
    }

    function whitelist () public maxAddressCheck deadline returns (bool) {
        require(_msgSender() != address(0), "address zero!");
        require(!WhitelistedAddresses[_msgSender()], "you have already been whitelisted");
        WhitelistedAddresses[_msgSender()] = true;
        addressWhitelisted++;
        return true;
    }
}