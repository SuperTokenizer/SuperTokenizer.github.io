// Frontend code for token generator to bridge to backend

    const tokenForm = document.getElementById("tokenForm");
    const tokenTypeSelect = document.getElementById("tokenType");
    // Define a mapping of token types to block explorer URLs
    const blockExplorerUrls = {
    bep20: "https://testnet.bscscan.com/tx/",
    erc20: "https://sepolia.etherscan.io/tx/",
    };
    const contractAddresses = {
    bep20: "0xBD8D5Acba4f00ffeA7EC84b830028fB4d5a18060", // BEP20 contract address for tests
    erc20: "0xc832b4f7E542A4eCc087a37BB12b4B8c2b109f22", // ERC20 contract address for tests
    };
    const bscMainnet = {
    chainId: "0x61", // Binance Smart Chain testnet (assuming Chain ID 97)
    };

    const sepoliaTestnet = {
    chainId: "0xaa36a7", // Sepolia Ethereum Testnet
    };

    // Define your contract ABI and address here
    const contractABI = [
    {
        inputs: [
        {
            internalType: "string",
            name: "name",
            type: "string",
        },
        {
            internalType: "string",
            name: "symbol",
            type: "string",
        },
        {
            internalType: "uint256",
            name: "maxSupply",
            type: "uint256",
        },
        ],
        name: "newToken",
        outputs: [],
        stateMutability: "nonpayable",
        type: "function",
    },
    {
        inputs: [
        {
            internalType: "address",
            name: "",
            type: "address",
        },
        {
            internalType: "uint256",
            name: "",
            type: "uint256",
        },
        ],
        name: "tokens",
        outputs: [
        {
            internalType: "address",
            name: "",
            type: "address",
        },
        ],
        stateMutability: "view",
        type: "function",
    },
    ];

    document
    .getElementById("metamaskButton")
    .addEventListener("click", async (event) => {
        let button = event.target;

        try {
        const accounts = await window.ethereum.request({
            method: "eth_requestAccounts",
        });
        let accountAddress = accounts[0];
        console.log(accountAddress);
        document.getElementById("connectFirst").classList.add("d-none");
        document.getElementById("tokenForm").classList.remove("d-none");
        document.getElementById("formContainer").classList.remove("d-none");
        } catch (error) {
        console.error("Error requesting accounts:", error);
        }
    });

    async function connectWeb3() {
        if (window.ethereum) {
            window.web3 = new Web3(window.ethereum);
        }
    }

    async function load() {
        await connectWeb3();
        window.contract = await loadContract(contractAddresses.bep20); // Default to BEP20;
        // updateStatus('Ready!');
    }

    async function switchNetworkAndAccount(chainId) {
        try {
            document.getElementById("networkSwitchMessage").textContent =
            "Setting up your metamask...";
            document.getElementById("networkSwitchMessage").classList.add("d-block");
            // Switch to the selected network
            await ethereum.request({
            method: "wallet_switchEthereumChain",
            params: [{ chainId }],
            });

            // Prompt the user to select an account after network switch
            await ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }],
            });

            document.getElementById("networkSwitchMessage").textContent =
            "Account successfully set up!";
        } catch (error) {
            document.getElementById("networkSwitchMessage").textContent = "";
            if (error.code === 4001) {
            document.getElementById("networkSwitchMessage").textContent =
                "Permissions needed to continue.";
            } else {
            document
                .getElementById("networkSwitchMessage")
                .classList.remove("alert-success");
            document
                .getElementById("networkSwitchMessage")
                .classList.add("alert-danger");
            document.getElementById("networkSwitchMessage").textContent =
                "Error switching network or requesting permissions.";

            console.error(
                "Error switching network or requesting permissions:",
                error
            );
            }
        }
    }

    async function loadContract(contractAddress) {
        const web3 = new Web3(ethereum);
        return new web3.eth.Contract(contractABI, contractAddress);
        }

        async function getCurrentAccount() {
        try {
            const accounts = await ethereum.request({ method: "eth_requestAccounts" });
            return accounts[0];
        } catch (error) {
            console.error("Error requesting accounts:", error);
        }
    }

    tokenForm.addEventListener("submit", async function (event) {
        event.preventDefault();
        load();

        const formData = new FormData(tokenForm);
        const tokenName = formData.get("tokenName");
        const tokenSymbol = formData.get("tokenSymbol");
        const maxSupply = formData.get("maxSupply");
        const selectedOption = tokenTypeSelect.value;
        let contractToUse;
        const bnbExplorerUrl = blockExplorerUrls.bep20;
        const ethExplorerUrl = blockExplorerUrls.erc20;
        let baseUrl;

        if (selectedOption === "bep20") {
            contractToUse = contractAddresses.bep20;
            await switchNetworkAndAccount(bscMainnet.chainId);
            baseUrl = bnbExplorerUrl;
           //BSC Mainnet 0x38 Testnet 0X61
        } else if (selectedOption === "erc20") {
            contractToUse = contractAddresses.erc20;
            // Ethereum Mainnet 0x1 Sepolia 0xaa36a7?
            await switchNetworkAndAccount(sepoliaTestnet.chainId);
            baseUrl = ethExplorerUrl;
        } else {
            console.error("Invalid token type selected.");
            return;
        }

        const requestData = {
            name: tokenName,
            symbol: tokenSymbol,
            maxSupply: web3.utils.toWei(maxSupply, "ether"), // Convert to wei,
        };
        const account = await getCurrentAccount();
        const contract = await loadContract(contractToUse);

        try {
            document.getElementById("generationMessage").textContent =
            "Please confirm your transaction in MetaMask.";
            const gasPrice = await web3.eth.getGasPrice();
            const transaction = await contract.methods
            .newToken(requestData.name, requestData.symbol, requestData.maxSupply)
            .send({
                from: account,
                gasPrice: gasPrice,
            })
            .once("transactionHash", (hash) => {
                
                console.log(`Transaction hash: ${hash}`);
                const generationMessage = document.getElementById("generationMessage");
                document.getElementById("tokenForm").classList.add("d-none");
                document.getElementById("successMessage").classList.add("d-none");
                generationMessage.classList.remove("d-none");
                generationMessage.classList.remove("alert-success");
                generationMessage.classList.add("alert-info");
                generationMessage.textContent =
                "Your token is being generated! Please wait.";
                
            })
            .on("receipt", (receipt) => {
                const txHash = receipt.transactionHash;
                const url = `${baseUrl}${txHash}`;
                const generationMessage = document.getElementById("generationMessage");
                const successMessage = document.getElementById("successMessage");
                const blockExplorerLink = document.getElementById("blockExplorerLink");
                const moreTokensLink = document.getElementById("moreTokensLink");

                console.log(`Blockchain URL: ${url}`);
                generationMessage.classList.remove("alert-info");
                generationMessage.classList.add("d-none");
                successMessage.classList.remove("d-none");
                successMessage.classList.add("alert-success");
                successMessage.textContent =
                "Your token has been successfully created!";
                blockExplorerLink.classList.remove("d-none");
                blockExplorerLink.classList.add("d-flex");
                blockExplorerLink.setAttribute("href", url);
                blockExplorerLink.textContent =
                `Click here to check your new amazing token ${String.fromCharCode(9989)}`;
                blockExplorerLink.classList.add("alert-link");
                moreTokensLink.classList.remove("d-none");
            });
            // .on('error', function(error){
            //     alert(`Transaction ${error} failed`);
            //     document.getElementById('tokenForm').classList.add('d-none');
            //     document.getElementById('generationMessage').textContent = 'TOKEN CREATION FAILED!';
            //     document.getElementById('generationMessage').classList.remove('d-none');
            //     document.getElementById('generationMessage').classList.add('alert-danger');
            // });
        } catch (error) {
            console.error("Error submitting transaction:", error);
        }
        //here the transaction was already confirmed by metamask for testing purposes
    });
