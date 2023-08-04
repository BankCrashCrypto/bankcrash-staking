


export const LockShade = ({connected, getAddresses}) => <>
  <div style={{backgroundColor: 'black',opacity: 0.5, position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, borderRadius: 12, }}/>
  <div style={{position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'white'}}>
    {connected !== 'CONNECTED' && <ConnectMetamask connected={connected} getAddresses={getAddresses}/>}
    {/* Connect wallet first */}
  </div>

</>


const ConnectMetamask = ({connected, getAddresses}) => {
  return <div>
    {connected === null || connected === 'UNLOCKED' ? 
      <button className="filled_btn" style={{ color: "white", cursor: 'pointer', fontSize: "1.125rem" }} href={"#"} onClick={getAddresses}>Connect Metamask</button> : 
    connected === 'LOCKED' ? 
      <button className="filled_btn" style={{ color: "white", cursor: 'pointer' }} href={"#"} onClick={getAddresses}>Metamask is Locked. Please unlock!</button>: 
    connected === 'METAMASK_NON_INSTALLED' ?    
      <div style={{marginLeft: 12, marginRight: 12, marginBottom: 12}}><a style={{width: '100%', textAlign: 'center', color: '#EF6918', fontWeight: 'bold', }} href={"https://metamask.io/download/"} target="_blank">Metamask not installed. Please install</a></div>: null
      }
  <div style={{fontSize: 14, textAlign: 'center', marginTop: 12}}>Start staking!</div>

  </div>
}