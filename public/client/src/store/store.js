import create from 'zustand';
import { connectToWallet, getWallet } from '../services/web3';

export const userStore = create((set, get) => ({
    walletAddress: "",
    minifiedWalletAddress: "",
    errors: {
        wallet: null,
    },
    connectToWallet: async () => {
        const data = await connectToWallet();
        if (!(data instanceof Error)) {
            set({ walletAddress: data, minifiedWalletAddress: transformMinifiedAddress(data) });
        } else {
            set({ walletAddress: "", minifiedWalletAddress: "", errors: { wallet: data.message } });
        }
    },
    getWalletAddress: async () => {
        const data = await getWallet();
        if (!(data instanceof Error)) {
            set({ walletAddress: data, minifiedWalletAddress: transformMinifiedAddress(data) });
        } else {
            set({ walletAddress: "", minifiedWalletAddress: "", errors: { wallet: data.message } });
        }
    }
}))


const transformMinifiedAddress = (address) => {
    if (address) {
        const start = address.slice(0, 3);
        const end = address.slice(address.length - 3, address.length);
        return `${start}...${end}`;
    }
}
