// HTML for the decentralized identity management system (assumed to be in your HTML file)
/*
<div id="identity-system">
  <h3>Register Identity</h3>
  <input type="text" id="identity-name" placeholder="Name" required />
  <input type="email" id="identity-email" placeholder="Email" required />
  <button id="register-identity">Register</button>
  <div id="identity-status"></div>
  <div id="identity-list"></div>
</div>
*/

const Web3 = require('web3');
const ethUtil = require('ethereumjs-util');
const contractABI = []; // Replace with actual contract ABI
const contractAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with deployed contract address

class DecentralizedIdentity {
  constructor() {
    this.web3 = new Web3(Web3.givenProvider || 'http://localhost:8545');
    this.contract = new this.web3.eth.Contract(contractABI, contractAddress);
    this.currentAccount = null;

    this.setupEventListeners();
    this.loadIdentities();
  }

  setupEventListeners() {
    document.getElementById('register-identity').addEventListener('click', () => this.registerIdentity());
  }

  async registerIdentity() {
    const name = document.getElementById('identity-name').value;
    const email = document.getElementById('identity-email').value;

    if (!this.currentAccount) {
      await this.connectToBlockchain();
    }

    const userHash = this.createIdentityHash(name, email);
    try {
      const response = await this.contract.methods.registerIdentity(name, email, userHash).send({ from: this.currentAccount });
      
      document.getElementById('identity-status').textContent = `Identity registered successfully: Tx ${response.transactionHash}`;
      this.loadIdentities();
    } catch (error) {
      document.getElementById('identity-status').textContent = `Error: ${error.message}`;
    }
  }

  async connectToBlockchain() {
    const accounts = await this.web3.eth.requestAccounts();
    this.currentAccount = accounts[0];
  }

  createIdentityHash(name, email) {
    const identityString = `${name}:${email}`;
    const hash = ethUtil.keccak256(identityString).toString('hex');
    return hash;
  }

  async loadIdentities() {
    const identitiesCount = await this.contract.methods.getIdentitiesCount().call();
    
    const identityList = document.getElementById('identity-list');
    identityList.innerHTML = '<h3>Registered Identities</h3>';
    
    for (let i = 0; i < identitiesCount; i++) {
      const [name, email, userHash] = await this.contract.methods.getIdentityByIndex(i).call();
      
      const identityElement = document.createElement('div');
      identityElement.innerHTML = `
        <p>${name} (${email}) - Hash: ${userHash}</p>
      `;
      
      identityList.appendChild(identityElement);
    }
  }
}

const decentralizedIdentity = new DecentralizedIdentity();