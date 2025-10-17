// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

/**
 * @title Greeter
 * @dev A simple greeting contract for the Base Sepolia Testnet
 */
contract Greeter {
    string private greeting;
    address public owner;

    event GreetingChanged(string oldGreeting, string newGreeting, address changedBy);

    constructor(string memory _greeting) {
        greeting = _greeting;
        owner = msg.sender;
    }

    /**
     * @dev Get the current greeting
     */
    function greet() public view returns (string memory) {
        return greeting;
    }

    /**
     * @dev Set a new greeting
     * @param _greeting The new greeting message
     */
    function setGreeting(string memory _greeting) public {
        string memory oldGreeting = greeting;
        greeting = _greeting;
        emit GreetingChanged(oldGreeting, _greeting, msg.sender);
    }

    /**
     * @dev Get a personalized greeting
     * @param _name The name to include in the greeting
     */
    function greetWithName(string memory _name) public view returns (string memory) {
        return string(abi.encodePacked(greeting, ", ", _name, "!"));
    }
}
