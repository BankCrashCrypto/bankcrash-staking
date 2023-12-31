import { useEffect, useState } from "react";
import { ethers } from "ethers";
import { Stakes } from "./Stakes";
import { DoStake } from "./DoStake";
import { initContract } from "./ContractUtils";
import {BanksHeatmap} from "./TreemapComp";



async function unstakeTokens(stakeIdx, contract, cb) {
  const unstakeTx = await contract.unstake(stakeIdx);

  console.log(`Transaction hash: ${unstakeTx.hash}`);
  cb && cb("TX_HASH")

  const receipt = await unstakeTx.wait();
  console.log(`Transaction was mined in block ${receipt.blockNumber}`);
  cb && cb("MINED")
}

function handleConnectionsInfo(connectInfo) {
  // Handle new accounts, or lack thereof.
  console.log('handleConnectionsInfo:', connectInfo)
}
const handleAccountsChanged = (setAddresss) => (accounts) => {
  // Handle new accounts, or lack thereof.
  console.log('handleAccountsChanged:', accounts)
  setAddresss(accounts)
}

function App() {
  const [connected, setConnected] = useState(null)
  const [walletAddress, setWalletAddress] = useState([]);
  const [stakes, setStakes] = useState([]);
  const [balance, setBalance] = useState(null);

  const getAddresses = async (force) => {
    if (window.ethereum) {
      // Check if metamask installed
      if (walletAddress.length === 0 || force) {
        try {
          const accounts = await window.ethereum.request({method: "eth_requestAccounts"});
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
  useEffect(() => {
    if (window.ethereum){ 
    const handleAccountChange = handleAccountsChanged(setWalletAddress)
    window.ethereum.on('connect', handleConnectionsInfo);
    window.ethereum.on('accountsChanged', handleAccountChange);
    return () => {
      window.ethereum.removeListener('connect', handleConnectionsInfo);
      window.ethereum.removeListener('accountsChanged', handleAccountChange);
    };
  }
  }, []);
  useEffect(() => {
    const test = async () => {
      if (window.ethereum){ 
      const unlocked = await window.ethereum._metamask.isUnlocked();
      console.log('window.ethereum._metamask.isUnlocked():', await window.ethereum._metamask.isUnlocked());
      console.log('window.ethereum.isConnected():', window.ethereum.isConnected());
      setConnected(unlocked ? (window.ethereum.isConnected() && walletAddress.length>0 ? 'CONNECTED' : 'UNLOCKED') : 'LOCKED');
      } else {
        setConnected('METAMASK_NON_INSTALLED');
      }
    }
    test();
  }, [walletAddress])
  const refreshBalance = async (accounts, contract) => {
    accounts = accounts ? accounts : await getAddresses();
    contract = contract ? contract : await initContract();
    const bal = await contract.balanceOf(accounts[0]);
    // console.log('balance:', bal,"BASH");
    setBalance(ethers.formatUnits(bal));
  };

  const updateBankcrashEvents = async () => {
    if (window.ethereum) {
      const accounts = await getAddresses();
      const contract = await initContract();
      // console.log("contract:", contract);
      // const txs = await contract.getStakes(accounts[0])
      const txs = await contract.updateBankCrashEvents(true, false, true);
      console.log('txs:', txs);
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
  const refresh = async () => {
    const accounts = await getAddresses();
    // console.log('accounts:', accounts)
    const contract = await initContract(accounts[0]);
    await refreshBalance(accounts, contract).catch(window.alert)
    await getStakes(accounts, contract).catch(window.alert);
  };
  const doUnstake = async (index) => {
    console.log("index:", index);
    if (window.ethereum) {
      const accounts = await getAddresses().catch(window.alert);
      const contract = await initContract().catch(window.alert);
      await unstakeTokens(index, contract, refresh).catch(window.alert);
    } else {
      console.log("MetaMask not detected.");
    }
  };
  // const { createdAt, endAt, baseAPY, amount, maximumAPY } = tx;

  return (<div className="App"
              style={{
                position: 'relative',
                minHeight: '100vh',
                display: "flex",
                width: '100%',
                color: "white",
                flexDirection: "column",
                justifyContent: 'center',
                alignItems: 'center',
                gap: 16,
              }}>
        <div style={{marginTop: 'auto', display: 'flex', gap: 16, justifyContent: 'center', width: '90%', flex: 1, paddingTop: 120}}>
          <DoStake walletAddress={walletAddress} getAddresses={getAddresses} balance={balance} refresh={refresh} connected={connected}/>
          <div style={{display: 'flex', flex: 1}}>
          <BanksHeatmap />
          </div>
        </div>
        <Stakes items={stakes} getStakes={refresh} doUnstake={doUnstake}  enabled={connected === 'CONNECTED'}/>
        <div style={{color:'white', marginTop: 'auto',marginBottom: 8, fontSize: "1.125rem", textAlign: 'center', }}>This site is shared on <a style={{color: 'teal'}} href={"https://github.com/BankCrashCrypto/bankcrash-staking"}>github</a> to be 100% transparent.</div>
    </div>
  );
}
// {/* <button onClick={updateBankcrashEvents} className="btn">
//           Update bankcrash event
//         </button> */}
        

export default App;
