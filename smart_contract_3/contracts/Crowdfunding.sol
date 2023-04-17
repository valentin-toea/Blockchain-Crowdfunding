// We will be using Solidity version 0.5.4
pragma solidity 0.8.0;
// Importing OpenZeppelin's SafeMath Implementation

import "@openzeppelin/contracts/utils/math/SafeMath.sol";

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
        uint256 raiseUntil = block.timestamp.add(durationInDays.mul(1 minutes));

        Project newProject = new Project(
            payable(msg.sender),
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

contract Project {
    using SafeMath for uint256;

    // Data structures
    enum State {
        Fundraising,
        Expired,
        Successful
    }

    struct Request {
        string description;
        uint256 value;
        address recipient;
        bool complete;
        uint256 approvalCount;
        uint256 disapprovalCount;
        mapping(address => bool) approvals;
    }

    // State variables
    address payable public creator;
    uint256 public amountGoal;
    uint256 public completeAt;
    uint256 public currentBalance;
    uint256 public balanceWithoutRequests;
    uint256 public minimumContribution;
    uint256 public raiseBy;
    string public title;
    string public description;
    State public state = State.Fundraising; // initialize on create
    mapping(address => uint256) public contributions;
    uint256 contributorCount;
    Request[] public requests;

    // Event that will be emitted whenever funding will be received
    event FundingReceived(
        address contributor,
        uint256 amount,
        uint256 currentTotal
    );
    // Event that will be emitted whenever the project starter has received the funds
    event CreatorPaid(address recipient);

    // Modifier to check current state
    modifier inState(State _state) {
        require(state == _state);
        _;
    }

    // Modifier to check if the function caller is the project creator
    modifier isCreator() {
        require(msg.sender == creator);
        _;
    }

    constructor(
        address payable projectStarter,
        string memory projectTitle,
        string memory projectDesc,
        uint256 fundRaisingDeadline,
        uint256 goalAmount,
        uint256 minimum
    ) {
        creator = projectStarter;
        title = projectTitle;
        description = projectDesc;
        amountGoal = goalAmount;
        raiseBy = fundRaisingDeadline;
        currentBalance = 0;
        balanceWithoutRequests = 0;
        minimumContribution = minimum;
    }

    /** @dev Function to fund a certain project.
     */
    function contribute() external payable inState(State.Fundraising) {
        require(
            msg.sender != creator,
            "The creator cannot contribute on own campaign."
        );

        if (contributions[msg.sender] == 0) contributorCount++;

        contributions[msg.sender] = contributions[msg.sender].add(msg.value);

        currentBalance = currentBalance.add(msg.value);
        balanceWithoutRequests = balanceWithoutRequests.add(msg.value);

        emit FundingReceived(msg.sender, msg.value, currentBalance);
        checkIfFundingCompleteOrExpired();
    }

    /** @dev Function to change the project state depending on conditions.
     */
    function checkIfFundingCompleteOrExpired() public {
        if (currentBalance >= amountGoal) {
            state = State.Successful;
            payOut();
        } else if (block.timestamp > raiseBy) {
            state = State.Expired;
        }
        completeAt = block.timestamp;
    }

    /** @dev Function to give the received funds to project starter.
     */
    function payOut() internal inState(State.Successful) returns (bool) {
        uint256 totalRaised = balanceWithoutRequests;
        currentBalance = 0;
        balanceWithoutRequests = 0;

        if (creator.send(totalRaised)) {
            emit CreatorPaid(creator);
            return true;
        } else {
            currentBalance = totalRaised;
            state = State.Successful;
        }

        return false;
    }

    /** @dev Function to retrieve donated amount when a project expires.
     */
    function getRefund() public inState(State.Expired) returns (bool) {
        require(
            contributions[msg.sender] > 0,
            "The contribution is 0, cannot process transaction."
        );

        uint256 amountToRefund = contributions[msg.sender];
        contributions[msg.sender] = 0;

        uint256 lostPart = (100 * balanceWithoutRequests) / currentBalance;

        if (!payable(msg.sender).send((lostPart * amountToRefund) / 100)) {
            contributions[msg.sender] = amountToRefund;
            return false;
        } else {
            currentBalance = currentBalance.sub(amountToRefund);
            balanceWithoutRequests = balanceWithoutRequests.sub(
                (lostPart * amountToRefund) / 100
            );
        }

        return true;
    }

    /**  Function to get specific information about the project.
     *  Returns all the project's details
     */
    function getDetails()
        public
        view
        returns (
            address payable projectStarter,
            string memory projectTitle,
            string memory projectDesc,
            uint256 deadline,
            State currentState,
            uint256 currentAmount,
            uint256 goalAmount,
            uint256 minimumToBeContributor,
            uint256 requestsCount
        )
    {
        projectStarter = creator;
        projectTitle = title;
        projectDesc = description;
        deadline = raiseBy;
        currentState = state;
        currentAmount = currentBalance;
        goalAmount = amountGoal;
        minimumToBeContributor = minimumContribution;
        requestsCount = requests.length;
    }

    /*
     * The manager creates a new request for funds
     *
     */

    function createRequest(string memory reqDescription, uint256 value)
        public
        payable
        inState(State.Fundraising)
    {
        require(
            msg.sender == creator,
            "You must be the creator of the campaign to create a request."
        );

        Request storage newRequest = requests.push();

        newRequest.description = reqDescription;
        newRequest.value = value;
        newRequest.recipient = creator;
        newRequest.complete = false;
        newRequest.approvalCount = 0;
        newRequest.disapprovalCount = 0;
    }

    /*
     * A user who is not the manager can approve or disapprove a request
     *
     */

    event RequestDone(uint256 requestIndex);

    function approveRequest(uint256 index, bool agree) public {
        Request storage request = requests[index];

        require(
            contributions[msg.sender] >= minimumContribution,
            "You have not reached the minimum sum to be a contributor. Only those who have donated the required amount can be voters."
        );
        require(
            !request.approvals[msg.sender],
            "You have already voted for this request."
        );

        request.approvals[msg.sender] = true;
        if (agree) {
            request.approvalCount++;
        } else {
            request.disapprovalCount++;
        }

        if (
            request.approvalCount > request.disapprovalCount &&
            request.approvalCount + request.disapprovalCount >=
            contributorCount / 2
        ) {
            emit RequestDone(index);
        }
    }

    function finalizeRequest(uint256 index) public inState(State.Fundraising) {
        Request storage request = requests[index];

        require(
            !request.complete,
            "Request is already complete, you can no longer finalize it."
        );
        require(
            request.approvalCount > request.disapprovalCount &&
                request.approvalCount + request.disapprovalCount >=
                contributorCount / 2,
            "The voting is not yet done. The request has not reached the number of voters required."
        );

        payable(request.recipient).transfer(request.value);
        balanceWithoutRequests = balanceWithoutRequests.sub(request.value);

        request.complete = true;
    }

    function canUserVote(address userAddress)
        public
        view
        returns (bool canVote, uint256 remainingSumToVote)
    {
        if (contributions[userAddress] >= minimumContribution) {
            canVote = true;
            remainingSumToVote = 0;
        } else {
            canVote = false;
            remainingSumToVote =
                minimumContribution -
                contributions[userAddress];
        }
    }

    function hasUserVoted(uint256 index, address userAddress)
        public
        view
        returns (bool hasVoted)
    {
        Request storage request = requests[index];

        if (request.approvals[userAddress]) hasVoted = true;
        else hasVoted = false;
    }
}
