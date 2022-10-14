import { ethers } from "ethers";


export const getWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
        if (provider) {
            const [walletAddress] = await provider.provider.request({ method: "eth_accounts" })
            return walletAddress;
        } else {
            throw new Error("No wallet provider");
        }
    } catch (e) {
        return new Error(e.message);
    }
}

export const connectToWallet = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    try {
        if (provider) {
            const [walletAddress] = await provider.provider.request({ method: 'eth_requestAccounts' });
            return walletAddress;
        } else {
            throw new Error("No wallet provider");
        }
    } catch (e) {
        return new Error(e.message);
    }
}

