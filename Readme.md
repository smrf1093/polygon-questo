
# Questo 
questo is a project boilerplate and a simple game on blockchain using polygon and phaser.
# Images

![Alt text](./images/questo1.png?raw=true "Questo Intro (Wallet not connected)")
![Alt text](./images/questo2.png?raw=true "Questo Intro (Wallet connected)")
![Alt text](./images/questo3.png?raw=true "Questo Intro (Game started)")

# The structure 
The project is divided in 2 folders one for smart contract that let you write and compile your contract using alchemy and hardhat. 
The other folder is game, in this folder you can develop your 2D game using phaser.io game engine. 

# The Questo Game Idea 
The questo itself despite the structure is a simple doodle game where you have a rabbit that jump over some plates. There are some Matic and Ethereum on each plate and the rabbit should only gather the Matic symbols. Consider some other challenges such as time could be added to this game. After finishing the game user can participate in the bet, the player with the more score will win the prize of the bet. This section and idea however need more investigation the reset player score and other functionality are all implemented in the current smart contract. 

# Execution 
## The contract 
To run the smart contract first you need to get your key and url on alchemy website, put them in the .env file the sample .env can guide you through that. use the following command to compile and deploy the contract:

```shell
npx hardhat run scripts/deploy.js --network polygon_mumbai
```

Consider the following instruction if you want to change the contract: 
After running the hardhat command a ContractName.json file will be created under the artifacts/contracts/ContractName.sol folder copy this file and place it under the game/src/components/utils/contractabi.

## The game 
Cd into game folder write use, npm i to install dependencies and then execute npm start to start the game. 

