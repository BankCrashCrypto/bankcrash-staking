import { ethers } from "ethers";
import "./DoStake.css";
import { useEffect, useState } from "react";
import { Contract_abi, contractAddress, initContract } from "./utils";
import {LockShade} from "./Utils";

const emptyFn = () => 0;
async function stakeTokens(amount, months, cb=emptyFn) {
  const contract = await initContract();
  console.log("contract:", contract);
  console.log("amount:", amount, months);
  const amountToApprove = ethers.parseUnits(amount, "ether"); // Adjust as needed, this is just an example
  console.log("amountToApprove:", amountToApprove);
  const tx = await contract.approve(contractAddress, amountToApprove);
  console.log("tx:", tx);
  await tx.wait();
  cb("AMOUNT_APPROVED")
  console.log("tx:", tx);
  const stakeTx = await contract.stake(amountToApprove, months);
  cb("STAKE_HASHED")
  console.log("stakeTx:", stakeTx);

  console.log(`Transaction hash: ${stakeTx.hash}`);

  const receipt = await stakeTx.wait();
  cb("STAKE_MINED")
  console.log(`Transaction was mined in block ${receipt.blockNumber}`);
}

function Input({ value, label, onChange, index }) {
  return (
    <div className="form__group field">
      <input
        type={"text"}
        className="form__field"
        id={label}
        value={value || ""}
        onChange={(e) => onChange(e, index)}
        placeholder="something."
      />
      <label className="form__label">{label}</label>
    </div>
  );
}
function logposition(value) {
  var minp = 3;
  var maxp = 120;
  var scale = (Math.log(maxp)-Math.log(minp)) / (maxp-minp);
  return (Math.log(value)-Math.log(minp)) / scale + minp;
}
function logslider(position) {
  // position will be between 0 and 100
  var minp = 3;
  var maxp = 120;
  var scale = (Math.log(maxp)-Math.log(minp)) / (maxp-minp);

  return Math.exp(Math.log(minp) + scale*(position-minp));
}

const RangeSlider = () => {
  const [value, setValue] = useState(200);

  const handleSliderChange = (e) => {
    setValue(+e.target.value);
  };

  return (
    <div 
      className="range-slider"
      style={{
        '--min': 0,
        '--max': 10000,
        '--step': 100,
        '--value': value,
        '--textValue': `"${value}"`,
        '--prefix': '"$"',
      }}
    >
      <input 
        className="slider"
        type="range"
        min="0"
        max="120"
        step="1"
        value={value}
        onChange={handleSliderChange}
      />
      <div className="range-slider__progress"></div>
    </div>
  );
};

export default RangeSlider;
export const DoStake = ({ walletAddress, getAddresses, balance, refresh, enabled }) => {
  const [amount, setAmount] = useState("100");
  const [months, setMonths] = useState("9");

  const handleSubmit = async (e) => {
    e.preventDefault();
    await stakeTokens(amount, Number(months), refresh).catch(window.alert);
  };
  console.log('enabled:', enabled)
  useEffect(() => {
    if (enabled){
      refresh() // await
    }
  }, [enabled])
  const setLogSliderValue = (e) => setMonths(logslider(e.target.value).toFixed(0))
  const balanceText = Math.floor(Number(balance)*10000)/10000
  const baseAPY = 10+months/3
  const maxAPY = 33 + months*3
  return (
    <div className="shadow_bg" >
      <div className="stake_title" style={{textAlign: 'center'}}>Staking</div>
      {/* <div>{Contract_abi.contractName}</div> */}
      <div>
      <div style={{fontSize: '0.8125rem', lineHeight: '140%', marginBottom: '0.38rem'}}>
        Stake Amount
      </div>
      <div className="stake__field_container" style={{marginLeft:-4}}>
        <div style={{justifyContent: 'space-between', display: 'flex', width: '100%',flexDirection: 'row', gap: 20}}>
          <input
            type={"text"}
            style={{minWidth: 220}}
            className="stake__field"
            id={"stake_amount"}
            value={amount || ""}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="amount"
          />
          <div style={{ fontSize: '1.125rem'}}>
            BASH
          </div>
        </div>
        <div style={{justifyContent: 'space-between', display: 'flex', flex:1,fontSize: '0.8125rem', width: '100%'}}>
          <div >
            <span style={{color: '#AAAAAA'}}>Available balance:</span> {balanceText.toFixed(5)}
          </div>
          <div style={{color: "#ED6A14", cursor: 'pointer', fontWeight: 'bold'}} onClick={() => setAmount(balanceText.toFixed(5))}>
            MAX
          </div>
        </div>
      </div>
      </div>
      <div style={{fontSize: '0.8125rem', marginBottom:'-0.3rem'}}>Duration</div>
      <div style={{display: 'flex', flexDirection: 'row', marginTop: 0, gap: '0.6rem', alignItems: 'center'}}>
        <div className="stake__field_container" style={{marginLeft:-4, display: 'flex', flexDirection: 'row'}}>
          <input
            type={"text"}
            style={{width: 30}}
            className="stake__field"
            id={"months_amount"}
            value={months || ""}
            onChange={e => setMonths(e.target.value)}
          />
          <div >months</div>
        </div>
        <div style={{position: 'relative', fontSize: '0.625rem',
  width: '100%' }}>
          <div style={{position: 'absolute', top: -14}}>min 3</div>
          <div style={{position: 'absolute', top: -14, right: 0}}>max 120</div>
          <input className="range" type="range" name="" value={logposition(months)} min="3" max="120" onChange={setLogSliderValue} onMouseMove={setLogSliderValue} style={{}}></input>
        </div>
      </div>
      <div style={{fontSize: '1.125rem', fontWeight: '400', lineHeight: '140%'}}>
        <div style={{display: 'flex', justifyContent: 'space-between', flex: 1}}><span>Base APY</span><span>{baseAPY.toFixed(2)}%</span></div>
        {/* <div style={{display: 'flex', justifyContent: 'space-between', flex: 1}}><span>Bonus APY from bank crashes</span><span>6.90%</span></div> */}

        <div style={{display: 'flex', justifyContent: 'space-between', flex: 1}}><span>+ Small bank</span><span>1.00%/Bank</span></div>

        <div style={{display: 'flex', justifyContent: 'space-between', flex: 1}}><span>+ Medium bank</span><span>15.00%/Bank</span></div>

        <div style={{display: 'flex', justifyContent: 'space-between', flex: 1}}><span>+ Large bank</span><span>42.00%/Bank</span></div>

        <div style={{display: 'flex', justifyContent: 'space-between', flex: 1}}><span>Maximum APY</span><span>{maxAPY.toFixed(2)}%</span></div>

        <div style={{display: 'flex', justifyContent: 'space-between', flex: 1}}><span>No crashes reward</span><span>{(Number(amount)*Math.pow((1+baseAPY/100), months/12)).toFixed(0)} BASH</span></div>
        <div style={{display: 'flex', justifyContent: 'space-between', flex: 1}}><span>Max crashes reward</span><span>{(Number(amount)*Math.pow((1+maxAPY/100), months/12)).toFixed(0)} BASH</span></div>
      </div>
      <button type="submit" className="filled_btn" style={{ color: "white", cursor: 'pointer' }} onClick={handleSubmit}>
        Stake tokens
      </button>
      {/* <Input
        label={""}
        value={amount}
        index={0}
      /> */}
      {/* <form onSubmit={handleSubmit}>
        <Input
          label={"Month:"}
          value={months}
          onChange={(e) => setMonths(e.target.value)}
          index={0}
        />
      </form> */}
      {!enabled && <LockShade />}
    </div>
  );
};
const Addresses = ({ walletAddress, getAddresses }) => {
  return (
    <div>
      Addresses:
      {walletAddress.map((address) => {
        return <div>{address}</div>;
      })}
      <br></br>
      <button onClick={getAddresses} className="btn">
        Get addresses
      </button>
    </div>
  );
};
