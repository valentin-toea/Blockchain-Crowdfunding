// We will be using Solidity version 0.5.4
pragma solidity 0.5.4;
// Importing OpenZeppelin's SafeMath Implementation

import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

import "./Project.sol";

contract Crowdfunding {
    using SafeMath for uint256;

    // List of existing projects
    Project[] public projects;

    // Event that will be emitted whenever a new project is started
    event ProjectStarted(
        address contractAddress,
        address projectStarter,
        string projectTitle,
        string projectDesc,
        uint256 deadline,
        uint256 goalAmount
    );

    /** @dev Function to start a new project.
     * @param title Title of the project to be created
     * @param description Brief description about the project
     * @param durationInDays Project deadline in days
     * @param amountToRaise Project goal in wei
     */
    function startProject(
        string calldata title,
        string calldata description,
        uint256 durationInDays,
        uint256 amountToRaise,
        uint256 minimumContribution
    ) external {
        uint256 raiseUntil = block.timestamp.add(durationInDays.mul(1 days));

        Project newProject = new Project(
            msg.sender,
            title,
            description,
            raiseUntil,
            amountToRaise,
            minimumContribution
        );

        projects.push(newProject);

        emit ProjectStarted(
            address(newProject),
            msg.sender,
            title,
            description,
            raiseUntil,
            amountToRaise
        );
    }

    /** @dev Function to get all projects' contract addresses.
     * @return A list of all projects' contract addreses
     */
    function returnAllProjects() external view returns (Project[] memory) {
        return projects;
    }
}
