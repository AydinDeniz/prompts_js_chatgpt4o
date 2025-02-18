// HTML for the blockchain-based voting system (assumed to be in your HTML file)
/*
<div id="voting-system">
  <h2>Vote Now</h2>
  <div id="candidate-list"></div>
  <button id="submit-vote">Submit Vote</button>
  <div id="vote-status"></div>
</div>
*/

const web3 = new Web3(Web3.givenProvider || "http://localhost:8545");
let votingContract;
const votingAbi = []; // Replace with your Solidity contract ABI
const votingAddress = 'YOUR_CONTRACT_ADDRESS'; // Replace with your contract address

class BlockchainVotingSystem {
  constructor() {
    this.initContract();
    this.setupEventListeners();
    this.loadCandidates();
  }

  initContract() {
    votingContract = new web3.eth.Contract(votingAbi, votingAddress);
  }

  async setupAccounts() {
    const accounts = await web3.eth.requestAccounts();
    this.account = accounts[0];
  }

  async loadCandidates() {
    const candidateCount = await votingContract.methods.getCandidateCount().call();
    const candidateList = document.getElementById('candidate-list');
    candidateList.innerHTML = '';

    for (let i = 0; i < candidateCount; i++) {
      const candidate = await votingContract.methods.candidates(i).call();
      const candidateElement = document.createElement('div');
      candidateElement.innerHTML = `
        <input type="radio" name="candidate" value="${candidate.id}" />
        ${candidate.name} (${candidate.voteCount} votes)
      `;
      candidateList.appendChild(candidateElement);
    }
  }

  setupEventListeners() {
    document.getElementById('submit-vote').addEventListener('click', async () => {
      const selectedCandidate = document.querySelector('input[name="candidate"]:checked');
      if (!selectedCandidate) {
        alert('Please select a candidate to vote.');
        return;
      }

      await this.submitVote(selectedCandidate.value);
    });
  }

  async submitVote(candidateId) {
    await this.setupAccounts();

    try {
      const receipt = await votingContract.methods.vote(candidateId).send({ from: this.account });
      document.getElementById('vote-status').innerHTML = 'Vote submitted successfully. Transaction: ' + receipt.transactionHash;
      this.loadCandidates();
    } catch (error) {
      document.getElementById('vote-status').innerHTML = 'Error submitting vote: ' + error.message;
    }
  }
}

const blockchainVotingSystem = new BlockchainVotingSystem();