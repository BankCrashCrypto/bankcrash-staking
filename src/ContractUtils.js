import { ethers } from "ethers";
import Contract_abi from "./abi/BankCrashTokenV2.json";
// import Contract_abi from "./abi/upgraded.json";

// const contractAddress = "0x977C2D75A2b8B748e06c5e85Fd9aAa9EbAb5d48A";
const contractAddress = "0x0f65d0bf4B0708259909412ceD4BB8462CCC6dCD";
const initContract = async (address) => {
  const provider = new ethers.BrowserProvider(window.ethereum); // JsonRpcProvider
  const signer = await provider.getSigner();
  const contract = new ethers.Contract(
    contractAddress,
    Contract_abi.abi,
    signer
  );

  address && provider.getBalance(address).then((balance) => {
    // convert a currency unit from wei to ether
    console.log('balance:', balance)
    const balanceInEth = ethers.formatEther(balance)
    console.log(`balance: ${balanceInEth} ETH`)
   })
  return contract;
};
export {Contract_abi, contractAddress, initContract}