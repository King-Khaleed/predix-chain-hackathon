// SPDX-License-Identifier: MIT
pragma solidity 0.8.26;

/**
 * @title PredictionPoll
 * @notice Simple binary prediction market. 0 = NO, 1 = YES
 * @dev Made for BlockDAG testnet. No oracle integration yet;
 *      owner resolves manually (upgradeable with Chainlink later).
 */
contract PredictionPoll {
    enum Side {
        NO, // 0
        YES // 1
    }
    enum Status {
        OPEN,
        RESOLVED,
        CANCELLED
    }

    struct Poll {
        address creator;       // The address of the poll creator
        string question;
        uint256 deadline;      // prediction cut-off
        uint256 resolveTime;   // when outcome will be available
        Side outcome;          // final result
        Status status;
        uint256 totalStaked;
        uint256[2] staked;     // 0:NO, 1:YES
        bool exists;
    }

    mapping(uint256 => Poll) public polls;
    uint256 public nextPollId;

    // user → poll → side → amount
    mapping(address => mapping(uint256 => mapping(Side => uint256))) public stakes;
    mapping(address => mapping(uint256 => bool)) public claimed;

    event PollCreated(
        uint256 indexed id,
        address indexed creator,
        string question,
        uint256 deadline,
        uint256 resolveTime
    );
    event Predicted(
        uint256 indexed pollId,
        address indexed user,
        Side side,
        uint256 amount
    );
    event Resolved(uint256 indexed pollId, Side outcome);
    event Claimed(uint256 indexed pollId, address indexed user, uint256 reward);

    error TooLate();
    error NotOpen();
    error TransferFailed();
    error NothingToClaim();
    error WrongOutcome();
    error EarlyResolve();

    /*//////////////////////////////////////////////////////////////
                               CREATE
    //////////////////////////////////////////////////////////////*/
    function createPoll(
        string calldata _question,
        uint256 _deadline,
        uint256 _resolveTime
    ) external returns (uint256 id) {
        require(
            _deadline > block.timestamp && _resolveTime > _deadline,
            "Invalid timing"
        );
        id = nextPollId++;
        polls[id] = Poll({
            creator: msg.sender,
            question: _question,
            deadline: _deadline,
            resolveTime: _resolveTime,
            outcome: Side.NO,
            status: Status.OPEN,
            totalStaked: 0,
            staked: [uint256(0), 0],
            exists: true
        });
        emit PollCreated(id, msg.sender, _question, _deadline, _resolveTime);
    }

    /*//////////////////////////////////////////////////////////////
                              PREDICT
    //////////////////////////////////////////////////////////////*/
    function predict(uint256 _pollId, Side _side) external payable {
        Poll storage p = polls[_pollId];
        if (!p.exists) revert("No poll");
        if (p.status != Status.OPEN) revert NotOpen();
        if (block.timestamp > p.deadline) revert TooLate();
        if (msg.value == 0) revert("Zero stake");

        stakes[msg.sender][_pollId][_side] += msg.value;
        p.staked[uint256(_side)] += msg.value;
        p.totalStaked += msg.value;

        emit Predicted(_pollId, msg.sender, _side, msg.value);
    }

    /*//////////////////////////////////////////////////////////////
                              RESOLVE
    //////////////////////////////////////////////////////////////*/
    function resolvePoll(uint256 _pollId, Side _outcome) external {
        Poll storage p = polls[_pollId];
        if (!p.exists) revert("No poll");
        if (p.status != Status.OPEN) revert NotOpen();
        if (block.timestamp < p.resolveTime) revert EarlyResolve();
        // For simplicity, anyone can resolve. In a real app, you'd add `require(msg.sender == p.creator);`
        
        p.outcome = _outcome;
        p.status = Status.RESOLVED;
        emit Resolved(_pollId, _outcome);
    }

    /*//////////////////////////////////////////////////////////////
                               CLAIM
    //////////////////////////////////////////////////////////////*/
    function claim(uint256 _pollId) external {
        Poll storage p = polls[_pollId];
        if (p.status != Status.RESOLVED) revert("Not resolved");
        if (claimed[msg.sender][_pollId]) revert("Already claimed");

        uint256 userStake = stakes[msg.sender][_pollId][p.outcome];
        if (userStake == 0) revert NothingToClaim();

        uint256 totalWin = p.staked[uint256(p.outcome)];
        uint256 reward = (p.totalStaked * userStake) / totalWin;

        claimed[msg.sender][_pollId] = true;

        (bool ok, ) = msg.sender.call{value: reward}("");
        if (!ok) revert TransferFailed();

        emit Claimed(_pollId, msg.sender, reward);
    }

    /*//////////////////////////////////////////////////////////////
                               VIEWS
    //////////////////////////////////////////////////////////////*/
    function getPoll(
        uint256 _id
    )
        external
        view
        returns (
            address creator,
            string memory question,
            uint256 deadline,
            uint256 resolveTime,
            Side outcome,
            Status status,
            uint256 totalStaked,
            uint256 yesStaked,
            uint256 noStaked
        )
    {
        Poll memory p = polls[_id];
        return (
            p.creator,
            p.question,
            p.deadline,
            p.resolveTime,
            p.outcome,
            p.status,
            p.totalStaked,
            p.staked[1],
            p.staked[0]
        );
    }

    function getUserStake(uint256 _pollId, address _user) external view returns (uint256 yesStake, uint256 noStake) {
        return (stakes[_user][_pollId][Side.YES], stakes[_user][_pollId][Side.NO]);
    }
}
