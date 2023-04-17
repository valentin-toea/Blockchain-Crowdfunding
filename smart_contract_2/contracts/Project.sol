// We will be using Solidity version 0.5.4
pragma solidity 0.5.4;
// Importing OpenZeppelin's SafeMath Implementation
import "../node_modules/@openzeppelin/contracts/utils/math/SafeMath.sol";

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
        minimumContribution = minimum;
    }

    /** @dev Function to fund a certain project.
     */
    function contribute() external payable inState(State.Fundraising) {
        require(msg.sender != creator);

        contributions[msg.sender] = contributions[msg.sender].add(msg.value);

        contributorCount++;

        currentBalance = currentBalance.add(msg.value);
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
        uint256 totalRaised = currentBalance;
        currentBalance = 0;

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
        require(contributions[msg.sender] > 0);

        uint256 amountToRefund = contributions[msg.sender];
        contributions[msg.sender] = 0;

        if (!msg.sender.send(amountToRefund)) {
            contributions[msg.sender] = amountToRefund;
            return false;
        } else {
            currentBalance = currentBalance.sub(amountToRefund);
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
            uint256 minimumToBeContributor
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
        require(msg.sender == creator);

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

    function approveRequest(uint256 index, bool agree) public {
        Request storage request = requests[index];

        require(contributions[msg.sender] > minimumContribution);
        require(!request.approvals[msg.sender]);

        request.approvals[msg.sender] = true;
        if (agree) {
            request.approvalCount++;
        } else {
            request.disapprovalCount++;
        }
    }

    function finalizeRequest(uint256 index) public inState(State.Fundraising) {
        Request storage request = requests[index];

        require(!request.complete);
        require(
            request.approvalCount > request.disapprovalCount &&
                request.approvalCount + request.disapprovalCount >=
                contributorCount
        );

        payable(request.recipient).transfer(request.value);

        request.complete = true;
    }
}
