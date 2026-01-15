// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title SimpleStorage
 * @dev Contract untuk menyimpan value dan message dengan access control
 * @notice Hanya owner yang bisa mengubah value dan message
 */
contract SimpleStorage {
    // State Variables
    uint256 private storedValue;
    address public owner;
    string public message;

    // Events
    event OwnerSet(address indexed newOwner);
    event ValueUpdated(uint256 indexed newValue);
    event MessageSet(string indexed newMessage);

    // Modifiers
    modifier onlyOwner() {
        require(msg.sender == owner, "Not owner");
        _;
    }

    // Constructor
    constructor() {
        owner = msg.sender;
        emit OwnerSet(msg.sender);
    }

    // Functions - Value Management
    ///Set nilai baru (hanya owner)
    /// _value Nilai yang akan disimpan

    function setValue(uint256 _value) public onlyOwner {
        storedValue = _value;
        emit ValueUpdated(_value);
    }

    ///Ambil nilai yang tersimpan (hanya owner)

    function getValue() public view onlyOwner returns (uint256) {
        return storedValue;
    }

    // Functions - Message Management
    //Set pesan baru (hanya owner)
    //Pesan yang akan disimpan

    function setMessage(string memory _message) public onlyOwner {
        message = _message;
        emit MessageSet(_message);
    }

    ///Ambil pesan yang tersimpan (siapa saja bisa baca)
    function getMessage() public view returns (string memory) {
        return message;
    }

    // Functions - Ownership Management
     //Transfer ownership ke address baru (hanya owner)
    //newOwner Address owner baru
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0), "Invalid address");
        owner = newOwner;
        emit OwnerSet(newOwner);
    }

     //Renounce ownership (hanya owner)
    function renounceOwnership() public onlyOwner {
        owner = address(0);
        emit OwnerSet(address(0));
    }
}