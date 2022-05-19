
console.log(alchemyKey);
const alchemyKey = process.env.REACT_APP_ALCHEMY_KEY


const { createAlchemyWeb3 } = require("@alch/alchemy-web3");
const web3 = createAlchemyWeb3(alchemyKey);

const contractABI = require("./contractabi/QuestoStorage.json");
const contractAddress = process.env.CONTRACT_ADDRESS;

export const QuestoContract = new web3.eth.Contract(
  contractABI.abi,
  contractAddress
);

export const loadStartMessage = () => {
  return new Promise((resolve, reject) => {
    resolve(QuestoContract.methods.get_start_message().call());
  });
};

export const newPlayerAddedListener = () => {
  return new Promise((resolve, reject) => {
    QuestoContract.events.NewPlayerAdded({}, (error, event) => {
      if (error) {
        reject(error);
      } else {
        resolve(event);
      }
    });
  });
};

export const startTheGame = (name, address) => {
  return new Promise((resolve, reject) => {
    resolve(
      QuestoContract.methods.start_the_game(name).send({ from: address })
    );
  });
};

export const changePlayerScore = (address, score) => {
  return new Promise((resolve, reject) => {
    resolve(QuestoContract.methods.change_score(score).send({ from: address }));
  });
};

export const connectWallet = () => {
  if (!window.ethereum) {
    return new Promise((resolve, reject) => {
      reject(
        "You must install Metamask, a virtual Ethereum wallet, in your browser. https://metamask.io/download.html"
      );
    });
  } else {
    return window.ethereum.request({
      method: "eth_requestAccounts",
    });
  }
};

export const getCurrentWalletConnected = () => {
  if (!window.ethereum) {
    return new Promise((resolve, reject) => {
      reject(
        "You must install Metamask, a virtual Ethereum wallet, in your browser. https://metamask.io/download.html"
      );
    });
  } else {
    return window.ethereum.request({
      method: "eth_accounts",
    });
  }
};
