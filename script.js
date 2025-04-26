import { createPrivyClient } from '@privy-io/browser';

const client = createPrivyClient({
    appId: 'cm9yfuiqj02f6jm0m30u7h1r2', // Replace with your Privy app id
});

let userWallet = null;

async function connectWallet() {
    const { wallet } = await client.login();
    userWallet = wallet;
    document.getElementById('connect-section').classList.add('hidden');
    document.getElementById('wallet-section').classList.remove('hidden');
    showWalletInfo();
}

async function showWalletInfo() {
    const address = userWallet.address;
    document.getElementById('address').textContent = address;
    document.getElementById('yourAddress').value = address;
    document.getElementById('etherscanLink').href = `https://etherscan.io/address/${address}`;

    const balanceWei = await userWallet.getBalance();
    const balanceEth = parseFloat(balanceWei) / (10 ** 18);
    document.getElementById('balance').textContent = balanceEth.toFixed(4) + ' ETH';

    const priceUsd = await getEthPrice();
    const usdValue = balanceEth * priceUsd;
    document.getElementById('usdBalance').textContent = '$' + usdValue.toFixed(2);
}

async function getEthPrice() {
    const res = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=ethereum&vs_currencies=usd');
    const data = await res.json();
    return data.ethereum.usd;
}

async function sendEth() {
    const to = document.getElementById('toAddress').value.trim();
    const amount = parseFloat(document.getElementById('amount').value.trim());

    if (!to || !amount) {
        alert('Please fill both fields.');
        return;
    }

    const tx = await userWallet.sendTransaction({
        to,
        value: (BigInt(amount * 1e18)).toString(), 
    });

    alert('Transaction sent! Hash: ' + tx.hash);
}

document.getElementById('connectButton').addEventListener('click', connectWallet);
document.getElementById('sendButton').addEventListener('click', sendEth);
