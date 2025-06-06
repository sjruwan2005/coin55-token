// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

import "@openzeppelin/contracts-upgradeable/token/ERC20/extensions/ERC20PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/UUPSUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract Coin55 is Initializable, ERC20PausableUpgradeable, OwnableUpgradeable, UUPSUpgradeable {
    uint256 public burnTaxRate;

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize() public initializer {
        __ERC20_init("Nexonith", "MRB");
        __ERC20Pausable_init();
        __Ownable_init(msg.sender);
        __UUPSUpgradeable_init();

        _mint(msg.sender, 70_000_000_000 * 10 ** decimals());
        burnTaxRate = 2;
    }

    function pause() external onlyOwner {
        _pause();
    }

    function unpause() external onlyOwner {
        _unpause();
    }

    function burn(uint256 amount) external whenNotPaused {
        require(balanceOf(msg.sender) >= amount, "Not enough balance");

        uint256 tax = (amount * burnTaxRate) / 100;
        uint256 burnAmount = amount - tax;

        _burn(msg.sender, burnAmount);
        _transfer(msg.sender, address(0xdead), tax);

        emit BurnWithTax(msg.sender, burnAmount, tax);
    }

    function setBurnTaxRate(uint256 newRate) external onlyOwner {
        require(newRate <= 10, "Too high");
        burnTaxRate = newRate;
    }

    function _authorizeUpgrade(address newImplementation) internal override onlyOwner {}

    event BurnWithTax(address indexed burner, uint256 burnedAmount, uint256 tax);
}
