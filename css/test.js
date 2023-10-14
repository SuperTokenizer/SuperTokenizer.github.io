document.getElementById('metamaskButton').addEventListener('click', async (event) => {
    let button = event.target;

    try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        let accountAddress = accounts[0];
        console.log(accountAddress);
        button.textContent = accountAddress;
    } catch (error) {
        console.error("Error requesting accounts:", error);
    }
});

async function connectWeb3() {
    if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        try {
            await window.ethereum.request({ method: 'eth_requestAccounts' });
        } catch (error) {
            console.error("User denied account access");
        }
    }
}

async function load() {
    await connectWeb3();
    window.contract = await loadContract();
    updateStatus('Ready!');
}

function updateStatus(status) {
    const web3Logged = document.getElementById('metamaskButton');
    web3Logged.innerHTML = status;
    console.log(status);
}

// Define your contract ABI and address here
const contractABI = [
    {
        "inputs": [
            {
            "internalType": "string",
            "name": "name",
            "type": "string"
            },
            {
            "internalType": "string",
            "name": "symbol",
            "type": "string"
            },
            {
            "internalType": "uint256",
            "name": "maxSupply",
            "type": "uint256"
            }
        ],
        "name": "newToken",
        "outputs": [],
        "stateMutability": "nonpayable",
        "type": "function"
        },
        {
        "inputs": [
            {
            "internalType": "address",
            "name": "",
            "type": "address"
            },
            {
            "internalType": "uint256",
            "name": "",
            "type": "uint256"
            }
        ],
        "name": "tokens",
        "outputs": [
            {
            "internalType": "address",
            "name": "",
            "type": "address"
            }
        ],
        "stateMutability": "view",
        "type": "function"
        }
];

const contractAddress = '0xBD8D5Acba4f00ffeA7EC84b830028fB4d5a18060';

async function loadContract() {
    const web3 = new Web3(ethereum);
    return new web3.eth.Contract(contractABI, contractAddress);
}

async function getCurrentAccount() {
    try {
        const accounts = await ethereum.request({ method: 'eth_requestAccounts' });
        return accounts[0];
    } catch (error) {
        console.error("Error requesting accounts:", error);
    }
}

const tokenForm = document.getElementById("tokenForm");
tokenForm.addEventListener("submit", async function (event) {
    event.preventDefault();
    load();
    
    const formData = new FormData(tokenForm);
    // const tokenType = formData.get("tokenType");
    const tokenName = formData.get("tokenName");
    const tokenSymbol = formData.get("tokenSymbol");
    const maxSupply = formData.get("maxSupply");
    
    const requestData = {
        name: tokenName,
        symbol: tokenSymbol,
        maxSupply: web3.utils.toWei(maxSupply, 'ether'), // Convert to wei,
    };
    
    const account = await getCurrentAccount();
    const contract = await loadContract();
    
    try {
        const gasPrice = await web3.eth.getGasPrice();
        const transaction = await contract.methods.newToken(requestData.name, requestData.symbol, requestData.maxSupply).send({
            from: account,
            gasPrice: gasPrice,
        });
        console.log("Transaction Receipt:", transaction);
    } catch (error) {
        console.error("Error sending new token info:", error);
    }
});

