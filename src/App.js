import "./App.css";
import { useState } from "react";
import { ethers } from "ethers";

// importing abi from artifacts folder
import Greeter from "./artifacts/contracts/Greeter.sol/Greeter.json";

// contract address
const greeterAddress = "0xD5Be5731E468Ad53884ae0e6c439cd4A908eAe89";

function App() {
  // store greeting in local state
  const [greeting, setGreetingValue] = useState("");
  const [newGreeting, setNewGreeting] = useState("");

  // request access to the user's MetaMask account
  async function requestAccount() {
    await window.ethereum.request({ method: "eth_requestAccounts" });
  }

  // call the smart contract, read the current greeting value
  async function fetchGreeting() {
    if (typeof window.ethereum !== "undefined") {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const contract = new ethers.Contract(
        greeterAddress,
        Greeter.abi,
        provider
      );
      try {
        const data = await contract.greet();
        setGreetingValue(data)
        console.log("data: ", data);
      } catch (err) {
        console.log("Error: ", err);
      }
    }
  }

  // call the smart contract, send an update
  async function setGreeting() {
    if (!greeting) return;
    if (typeof window.ethereum !== "undefined") {
      await requestAccount();
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const contract = new ethers.Contract(greeterAddress, Greeter.abi, signer);
      const transaction = await contract.setGreeting(newGreeting);
      setNewGreeting("");
      await transaction.wait();
      fetchGreeting();
    }
  }

  return (
    <div className="App">
      <h1>🔗</h1>
      <h1 className="header">First React Dapp</h1>
      <h1>🔗</h1>

      <div className="form">
        <div className="fetch-btn">
          <button onClick={fetchGreeting}>Fetch Greeting</button>
        </div>

        <div className="message">
          <h2>The message is:- </h2>
          <h2 className="double-underline">{greeting}</h2>
        </div>

        <div>
          <input
            onChange={(e) => setNewGreeting(e.target.value)}
            placeholder="type a new message"
            value={newGreeting}
          />
        </div>
        <div className="set-btn">
          <button onClick={setGreeting}>Set Greeting</button>
        </div>
      </div>
    </div>
  );
}

export default App;
