import { ethers } from "ethers";
import "./Stakes.css";
import { useEffect, useState } from "react";
import {LockShade} from "./Utils";

const OutlineButton = ({text, onClick, children}) => {
  return <div className="button-wrapper" onClick={onClick} style={{cursor: 'pointer'}}>
    <div className="button">
      <span className="button-text">{text}</span>
      {children}
    </div>
  </div>
}
const UnstakeButton = ({o, idx, doUnstake}) => {
  const [pressed, setPressed] = useState(false)
  return Number(o.closedAt) === 0 ? <OutlineButton text={"Unstake"} onClick={() => {
    if (new Date(Number(o.endAt) * 1000)<new Date()) {
      setPressed(true)
      doUnstake(idx);
    } else if (window.confirm("Are you sure you want to unstake, you will take a 60% penalty with unstaking?")) {
      setPressed(true)
      doUnstake(idx)
    } else {
    } 
  }}>{pressed && <div class="spinner" style={{marginLeft: 4}}/>}</OutlineButton> : <div style={{color: 'green'}}>Closed</div>
  // {/* <a className="unstake_cta" href="#" onClick={() => doUnstake(idx)}>Unstake</a> */}

}
const StakesList = ({ items, doUnstake, mode }) => {
  console.log('mode:', mode)
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
      {Object.entries(items).filter(([idx,o]) => mode=== 'ONGOING' ? Number(o.closedAt) === 0 : true).map(([idx, o]) => {
        if (o === null) {
          return <div key={idx}>You have no stakes</div>;
        }
        // console.log(o)
        return (
          <tr key={idx}>
            <td >
              #{idx}
            </td>
            <td >
              {ethers.formatEther(o.amount)}
            </td>
            <td >
              {new Date(Number(o.createdAt) * 1000).toLocaleDateString()}
            </td>
            <td >
              {new Date(Number(o.endAt) * 1000).toLocaleDateString()}
            </td>
            <td >
              {Number(o.baseAPY)}%
            </td>
            <td >
              {Number(o.maximumAPY)}%
            </td>
            <td >
              <UnstakeButton o={o} idx={idx} doUnstake={doUnstake}/>
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
export const Stakes = ({ items, doUnstake, enabled }) => {
  const [mode, setMode] = useState('ONGOING');

  console.log('Stakes enabled:', enabled)

  return (
    <div className="staking_bg">
      <SelectableStakes mode={mode} setMode={setMode} />
      {/* <div>Stake Bank Crash Tracker</div> */}
      <StakesList items={items} doUnstake={doUnstake} mode={mode}/>
      {!enabled && <LockShade />}
    </div>
  );
};
