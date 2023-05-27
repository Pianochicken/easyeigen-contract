// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/utils/Create2.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/security/Pausable.sol";

contract Create2Factory is Ownable, Pausable {
    event DeployByCreate2(address addr);
    function deploy(uint256 value, string memory _salt, bytes memory code) public whenNotPaused {
        bytes32 salt = keccak256(abi.encodePacked(_salt));
        address addr = Create2.deploy(value, salt, code);
        emit DeployByCreate2(addr);

    }

    function computeAddress(string memory _salt, bytes memory _code) public view returns (address) {
        bytes32 salt = keccak256(abi.encodePacked(_salt));
        bytes32 code = keccak256(_code);
        return Create2.computeAddress(salt, code);
    }

    function pause() public onlyOwner {
        _pause();
    }

    function unpause() public onlyOwner {
        _unpause();
    }
}