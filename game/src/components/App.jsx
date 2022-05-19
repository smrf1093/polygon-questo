import React, { useEffect } from "react";
import {
  loadStartMessage,
  connectWallet,
  getCurrentWalletConnected,
  startTheGame,
  changePlayerScore,
} from "./utils/interact.js";

export default function App(props) {
  const [message, setMessage] = React.useState("");
  const [walletAddress, setWallet] = React.useState("");
  const [status, setStatus] = React.useState("");
  const [playerName, setPlayerName] = React.useState("");
  const [playerScore, setPlayerScore] = React.useState(0);
  const playerNameInput = React.useRef(null);

  //called only once
  useEffect(() => {
    localStorage.removeItem("isWalletConnected");
    localStorage.setItem("playerScore", 0);
    if (
      localStorage.getItem("playerName") !== null &&
      localStorage.getItem("playerName") !== ""
    ) {
      setPlayerName(localStorage.getItem("playerName"));
    }
    loadStartMessage()
      .then((msg) => {
        console.log(msg);
        setMessage(msg);
      })
      .catch((err) => {
        setMessage(err);
      });
    addWalletListener();
    getCurrentWalletConnected()
      .then((addressArray) => {
        localStorage.setItem("isWalletConnected", "true");
        setWallet(addressArray[0]);
        setStatus("👆🏽 Write a message in the text-field above.");
      })
      .catch((err) => {
        localStorage.setItem("isWalletConnected", "false");
        console.log(err);
        setStatus(err);
      });
    window.addEventListener("storage", () => {
      // When local storage changes, dump the list to
      // the console.
      console.log("changed");
      setPlayerScore(localStorage.getItem("playerScore") || 0);
    });
  }, []);

  function connectWalletPressed() {
    connectWallet()
      .then((addressArray) => {
        localStorage.setItem("isWalletConnected", "true");
        setWallet(addressArray[0]);
        setStatus("👆🏽 Write a message in the text-field above.");
      })
      .catch((err) => {
        localStorage.setItem("isWalletConnected", "false");
        setStatus(err);
      });
  }

  function addWalletListener() {
    if (window.ethereum) {
      window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts.length > 0) {
          localStorage.setItem("isWalletConnected", "true");
          setWallet(accounts[0]);
          setStatus("👆🏽 Write a message in the text-field above.");
        } else {
          localStorage.setItem("isWalletConnected", "false");
          setWallet("");
          setStatus("🦊 Connect to Metamask using the top right button.");
        }
      });
    } else {
      localStorage.setItem("isWalletConnected", "false");
      setStatus(
        "You must install Metamask, a virtual Ethereum wallet, in your browser. https://metamask.io/download.html"
      );
    }
  }
  function changePlayerScoreBtn() {
    if (playerScore > 0) {
      changePlayerScore(walletAddress, playerScore)
        .then(() => {
          alert("Score changed");
        })
        .catch((err) => {
          console.log(err);
          alert("Score not changed");
        });
    } else {
      alert("Your score must be greater than 0");
    }
  }
  function setPlayerNameBtn() {
    if (playerNameInput.current.value.length > 0) {
      startTheGame(playerName, walletAddress)
        .then((response) => {
          setPlayerName(playerNameInput.current.value);
          localStorage.setItem("playerName", playerNameInput.current.value);
        })
        .catch((err) => {
          alert(err);
        });
    } else {
      alert("Select a name");
    }
  }

  return (
    <div style={{ textAlign: "left" }}>
      <h1>Welcome to questo:</h1>
      <p>Rules</p>
      <ul>
        <li>Try to collect only Matic symbols</li>
        <li>You should not collect ETH symbols</li>
        <li>You have to bet at least the start fee to start the game</li>
        <li>
          At the end of each day the winner of the day by the best score will
          own all the bets
        </li>
      </ul>
      <p>Requirements</p>
      <ul>
        <li>You have to install metamask extension</li>
        <li>
          <div id="walletButton">
            {walletAddress.length > 0 ? (
              "Connected: " + String(walletAddress)
            ) : (
              <>
                Then connect your wallet:{" "}
                <button onClick={connectWalletPressed}>Connect Wallet</button>
              </>
            )}
          </div>
        </li>
        <li>
          {playerName.length == 0 ? (
            <>
              Pick a name: <input ref={playerNameInput} type={"text"}></input>{" "}
              <button onClick={setPlayerNameBtn}>Set</button>
            </>
          ) : (
            <p>Welcome {playerName}</p>
          )}
        </li>
        <li>Then hit space to start the game</li>
        <li>
          If you want to participate in bet and save your score with (
          {playerScore}) value then
          <button className={"btn-primary"} onClick={changePlayerScoreBtn}>Save</button>
        </li>
      </ul>
    </div>
  );
}
