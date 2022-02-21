import React, { Fragment, useEffect, useState } from 'react';
import { useMetaMask } from 'metamask-react';

import './Counter.styles.css';

import { ethers } from 'ethers';
import counterContractJSON from '../../contracts/Counter.json';

// const contractAddress = '0x5fbdb2315678afecb367f032d93f642f64180aa3';
const contractAddress = '0x352717709e718f2F482d51F8A5095036a983F253'
const counterContractABI = counterContractJSON.abi;

function Counter() {
  const [count, setCount] = useState(0);
  const [contract, setContract] = useState(null);
  const { status, connect, account, chainId, ethereum } = useMetaMask();

  useEffect(() => {
    if (status === 'connected') {
      counterContract();
    }
  }, [status]);

  let statusEl;

  if (status === "initializing") statusEl = <p>Synchronisation with MetaMask ongoing...</p>

  if (status === "unavailable") statusEl = <p>MetaMask not available :(</p>

  if (status === "notConnected") statusEl = <button onClick={connect}>Connect to MetaMask</button>

  if (status === "connecting") statusEl = <p>Connecting...</p>

  if (status === "connected") statusEl = <p>Connected account {account} on chain ID ${chainId}</p>

  const counterContract = async function () {
    const ethersContract = new ethers.Contract(
      contractAddress,
      counterContractABI,
      new ethers.providers.Web3Provider(ethereum).getSigner()
    );

    await ethersContract.deployed();

    setContract(ethersContract);
    setCount(await ethersContract.getCounter());

    ethersContract.on(ethersContract.filters.CounterInc(), function (count) {
      console.log(count);
      setCount(count);
    });
  }

  const incrementCount = async function () {
    console.log(contract);
    await contract.count();
    // const tx = await contract.incrementCount();
    // await tx.wait();
    // setCount(await contract.getCount());
  }

  async function getCount() {
    console.log(contract)
    const count = await contract.getCounter();
    setCount(count);
  }

  return (
    <Fragment>
      { status === 'connected' && <div>
        <h1>Counter contract</h1>
        <p>{count}</p>
        <button onClick={async ()=> await incrementCount()}>Increment count</button>
        <button onClick={async ()=> await getCount()}>Get latest count</button>
      </div>}
      <div>
        {statusEl}
      </div>
    </Fragment>
  )
}

export default Counter;