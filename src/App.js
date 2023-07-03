import { useState } from "react";
import { ethers } from "ethers";
import { Stakes } from "./Stakes";
import { DoStake } from "./DoStake";
import { initContract } from "./utils";



async function unstakeTokens(stakeIdx, contract) {
  const unstakeTx = await contract.unstake(stakeIdx);

  console.log(`Transaction hash: ${unstakeTx.hash}`);

  const receipt = await unstakeTx.wait();
  console.log(`Transaction was mined in block ${receipt.blockNumber}`);
}

function App() {
  const [walletAddress, setWalletAddress] = useState([]);
  const [stakes, setStakes] = useState([]);
  console.log("stakes2:", stakes);
  const [balance, setBalance] = useState(null);
  const getAddresses = async (force) => {
    if (window.ethereum) {
      // Check if metamask installed
      if (walletAddress.length === 0 || force) {
        try {
          const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
          });
          console.log("accounts:", accounts);
          setWalletAddress(accounts);
          return accounts;
        } catch (err) {
          console.log("err:", err);
        }
      } else {
        return walletAddress;
      }
    } else {
      console.log("MetaMask not detected.");
    }
    return [];
  };
  const refreshBalance = async (accounts, contract) => {
    accounts = accounts ? accounts : await getAddresses();
    contract = contract ? contract : await initContract()
    const bal = await contract.balanceOf(accounts[0]);
    console.log('balance:', bal,"BASH")
    setBalance(ethers.formatUnits(bal));
  }

  const updateBankcrashEvents = async () => {
    if (window.ethereum) {
      const accounts = await getAddresses();
      const contract = await initContract();
      console.log("contract:", contract);
      // const txs = await contract.getStakes(accounts[0])
      const txs = await contract.updateBankCrashEvents(true, false, true);
      console.log('txs:', txs)
      // const txs = await contract.getUnstakedStakes(accounts[0]);
      // console.log("txs:", txs);
      // setStakes(txs);
    }
  };
  const getStakes = async (accounts, contract) => {
    if (window.ethereum) {
      accounts = accounts ? accounts : await getAddresses();
      contract = contract ? contract : await initContract();
      console.log("contract:", contract);
      const txs = await contract.getStakes();
      // const txs = await contract.getActiveStakes(accounts[0])
      console.log("txs:", txs);
      setStakes(txs);
      return;
      for (let i = 0; i < 3; i++) {
        const tx = await contract.stakes(accounts[0], i);
        console.log("tx:", tx);
        if (ethers.formatEther(tx.amount) === "0.0") {
          console.log("We brake");
          if (i === 0) {
            setStakes((s) => [null]);
          }
          break;
        }
        console.log(`Transaction:`, tx);
        // closedAt
        setStakes((s) => (i === 0 ? [tx] : [...s, tx]));
      }
    } else {
      console.log("MetaMask not detected.");
    }
  };
  const doUnstake = (index) => {
    console.log("index:", index);
    if (window.ethereum) {
      setTimeout(async () => {
        const accounts = await getAddresses();
        const contract = await initContract();
        unstakeTokens(index, contract);
      }, 0);
    } else {
      console.log("MetaMask not detected.");
    }
  };
  const refresh = async () => {
    const accounts = await getAddresses();
    console.log('accounts:', accounts)
    const contract = await initContract(accounts[0]);
    await refreshBalance(accounts, contract)
    await getStakes(accounts, contract);
  }

  // const { createdAt, endAt, baseAPY, amount, maximumAPY } = tx;
  return (
    <div
      className="App"
      style={{
        display: "flex",
        padding:100,
        width: '90%',
        color: "white",
        flexDirection: "column",
      }}
    >
      
      {/* <Input
        label={"Index:"}
        value={index}
        onChange={(e) => setIndex(e.target.value)}
        index={0}
      /> */}
      <DoStake walletAddress={walletAddress} getAddresses={getAddresses} balance={balance} refreshBalance={refreshBalance}/>
      <button onClick={doUnstake} className="btn">
        Unstake
      </button>
      <button onClick={updateBankcrashEvents} className="btn">
        Update bankcrash event
      </button>
      <Stakes items={stakes} getStakes={refresh} doUnstake={doUnstake} />
    </div>
  );
}

export default App;
