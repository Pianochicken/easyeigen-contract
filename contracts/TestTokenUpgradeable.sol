// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts-upgradeable/token/ERC20/ERC20Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";

contract TestTokenUpgradeable is Initializable, ERC20Upgradeable, OwnableUpgradeable, UUPSUpgradeable {

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() initializer public {
        __ERC20_init("Test Token", "TST");
        _mint(msg.sender, 16000000 * 10 ** 18);
        __Ownable_init();
        __UUPSUpgradeable_init();
    }

    /*
        ADD YOUR FUNCTION TO UPGRADE CONTRACT
        e.g.
        function mint(address to, uint256 amount) public onlyOwner {
            _mint(to, amount);
        }
    */

    function _authorizeUpgrade(address newImplementation)
        internal
        onlyOwner
        override
    {}
}