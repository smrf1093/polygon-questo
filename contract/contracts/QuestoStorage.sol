// SPDX-License-Identifier: None

// Specifies the version of Solidity, using semantic versioning.
// Learn more: https://solidity.readthedocs.io/en/v0.5.10/layout-of-source-files.html#pragma
pragma solidity >=0.8.9;

contract QuestoStorage {
    address private owner;
    // define a struct to hold players' information
    struct player {
        string name;
        uint32 score;
        uint8 flag;
    }
    mapping(uint8 => address) private players_index;
    mapping(address => player) private players;
    uint8 private players_count = 0;

    event NewPlayerAdded(string message);

    modifier isOwner() {
        require(owner == msg.sender);
        _;
    }

    modifier playerExist() {
        require(players[msg.sender].flag == 1);
        _;
    }

    modifier playNotExist() {
        require(players[msg.sender].flag != 1);
        _;
    }

    function start_the_game(string memory name) public returns (bool) {
        players[msg.sender] = player(name, 0, 1);
        players_index[players_count] = msg.sender;
        emit NewPlayerAdded("A new player has been added");
        players_count = players_count + 1;
        return true;
    }

    function get_start_message() public pure returns (string memory) {
        return "Welcome to the game!";
    }

    function give_the_bounty_to_winner() public payable isOwner {
        address winner_address = players_index[players_count - 1];
        for (uint8 i = 0; i < players_count; i++) {
            if (
                players[players_index[i]].score > players[winner_address].score
            ) {
                winner_address = players_index[i];
            }
        }
        payable(winner_address).transfer(address(this).balance);
        reset_players_score();
    }

    function change_score(uint32 score) public payable playerExist {
        // check the value is greater than 0.002 polygon
        require(msg.value >= 2e12);
        payable(address(this)).transfer(msg.value);
        players[msg.sender].score = score;
    }

    function count_players() public view returns (uint256) {
        return players_count;
    }

    function get_player_name(address player_address)
        public
        view
        returns (string memory)
    {
        return players[player_address].name;
    }

    function get_player_score(address player_address)
        public
        view
        returns (uint32)
    {
        return players[player_address].score;
    }

    function get_player_flag(address player_address)
        public
        view
        returns (uint8)
    {
        return players[player_address].flag;
    }

    function get_player_info(address player_address)
        public
        view
        returns (
            string memory,
            uint32,
            uint8
        )
    {
        return (
            players[player_address].name,
            players[player_address].score,
            players[player_address].flag
        );
    }

    function get_all_players() public view returns (address[] memory) {
        address[] memory result = new address[](players_count);
        for (uint8 i = 0; i < players_count; i++) {
            result[i] = players_index[i];
        }
        return result;
    }

    function get_all_players_info()
        public
        view
        returns (
            string[] memory,
            uint32[] memory,
            uint8[] memory
        )
    {
        string[] memory result = new string[](players_count);
        uint32[] memory result_score = new uint32[](players_count);
        uint8[] memory result_flag = new uint8[](players_count);
        for (uint8 i = 0; i < players_count; i++) {
            result[i] = players[players_index[i]].name;
            result_score[i] = players[players_index[i]].score;
            result_flag[i] = players[players_index[i]].flag;
        }
        return (result, result_score, result_flag);
    }

    function reset_players_score() public isOwner {
        for (uint8 i = 0; i < players_count; i++) {
            players[players_index[i]].score = 0;
        }
    }
}
