import { ethers } from "ethers";
import "./Stakes.css";
import { useState } from "react";

const OutlineButton = ({text}) => {
  return <div className="button-wrapper">
    <div className="button">
      <span className="button-text">{text}</span>
    </div>
  </div>
}
const StakesList = ({ items, getStakes, doUnstake }) => {
  return items ? (
    <table style={{width: '100%'}}>
      <thead>
      <tr>
        <th scope="col">#</th>
        <th scope="col">Stake amount (BASH)</th>
        <th scope="col">Creation</th>
        <th scope="col">Expiration</th>
        <th scope="col">BaseAPY</th>
        {/* <th scope="col">Bonus APY</th> */}
        <th scope="col">Maximum APY</th>
        <th scope="col">Actions</th>
      </tr>
      </thead>
      <tbody>
      {items.map((o, idx) => {
        if (o === null) {
          return <div key={idx}>You have no stakes</div>;
        }
        console.log(o.baseAPY)
        return (
          <tr key={idx}>
            <td key={idx} onClick={() => doUnstake(idx)}>
              #{idx}
            </td>
            <td key={idx} onClick={() => doUnstake(idx)}>
              {ethers.formatEther(o.amount)}
            </td>
            <td key={idx} onClick={() => doUnstake(idx)}>
              {new Date(Number(o.createdAt) * 1000).toLocaleDateString()}
            </td>
            <td key={idx} onClick={() => doUnstake(idx)}>
              {new Date(Number(o.endAt) * 1000).toLocaleDateString()}
            </td>
            <td key={idx} onClick={() => doUnstake(idx)}>
              {Number(o.baseAPY)}%
            </td>
            <td key={idx} onClick={() => doUnstake(idx)}>
              {Number(o.maximumAPY)}%
            </td>
            <td key={idx} onClick={() => doUnstake(idx)}>
              <OutlineButton text={"Unstake"}/>
              {/* <a className="unstake_cta" href="#" onClick={() => doUnstake(idx)}>Unstake</a> */}
            </td>
          </tr>
        );
      })}
      </tbody>
    </table>
  ) : null;
};
const selectedStyle = {color:'#F59D2E', fontWeight: 700, textDecoration: 'none'}
const notSelectedStyle = {color:'white', fontWeight: 700, textDecoration: 'none'}
const MyButton = ({name, label, mode, setMode}) => <a href="#" style={mode === name ? selectedStyle : notSelectedStyle} onClick={() => setMode(name)}>
  {label}
<div className="underline" style={mode === name ? {background: '#F59D2E'}: {background: 'transparent'}}/></a>
const SelectableStakes = ({mode, setMode}) => {

  return <div className="tabs">
  <MyButton name='ONGOING' label={'Ongoing Stakes'} mode={mode} setMode={setMode} />
  |
  <MyButton name='ALL_HISTORY' label={'Stake History'} mode={mode} setMode={setMode} />
</div>
}
export const Stakes = ({ items, getStakes, doUnstake }) => {
  const [mode, setMode] = useState('ONGOING');

  return (
    <div className="staking_bg">
      <button onClick={getStakes} className="btn">
        Get stakes
      </button>
      <SelectableStakes mode={mode} setMode={setMode} />
      {/* <div>Stake Bank Crash Tracker</div> */}
      <StakesList items={items} getStakes={getStakes} doUnstake={doUnstake} />
    </div>
  );
};
