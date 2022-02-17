import { useEffect, useState } from 'react';
import './App.css';
import { ethers } from 'ethers';
import contract from './contracts/HelloWorld.json';

const contractAddress = "";
const abi = contract.abi;

function App() {
  const [eth, setEth] = useState(null);
  const [currentAccount, setCurrentAccount] = useState(null);

  const checkWalletStatus = () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert('Please install metamask');
      return null;
    }

    console.log('Wallet is connected');
    return ethereum;
  }

  async function accountStatus(statusFor) {
    const accounts = await eth.request({ method: statusFor });

    return {
      accounts: accounts,
      accountsLength: accounts.length
    };
  }

  const connectWalletHandler = async () => {
    try {
      const { accounts, accountsLength } = await accountStatus('eth_requestAccounts');

      if (!await accountStatus('eth_accounts') && accountsLength) {
        alert("No connected accounts");
      }

      console.log('Found an account! Address: ', accounts[0]);
      setCurrentAccount(accounts[0]);

    } catch (error) {
      alert(error.message);
    }

  }

  const interactContract = async () => {
    const hello = new ethers.Contract(
      contractAddress,
      abi,
      new ethers.providers.Web3Provider(eth)
    );

    await hello.deployed();

    console.log(hello)

    console.log(await hello.hello());
  }

  const connectWalletButton = () => {
    return (
      <button onClick={connectWalletHandler} className='cta-button connect-wallet-button'>
        Connect Wallet
      </button>
    )
  }

  const interact = () => {
    return (
      <button onClick={interactContract} className='cta-button mint-nft-button'>
        contract interaction
      </button>
    )
  }

  useEffect(() => {
    const eth = checkWalletStatus();
    setEth(eth);
  }, [])

  return (
    <div className='main-app'>
      <h1>Playground</h1>
      <div>
        {currentAccount ? interact() : connectWalletButton()}
      </div>
      {currentAccount && <p>Connected account address: {currentAccount}</p>}
    </div>
  );
}

export default App;