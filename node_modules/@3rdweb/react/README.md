# Thirdweb React

<br>

## Introduction

Welcome to the Thirdweb Component Library. This package provides you with extensible components to handle the web3 side of your app.

We simplify the process of integrating web3 into your apps while making sure that you still have all the control you would using other lower level web3 frontend libraries.

Our main features are:

- Support for most commonly used web3 providers including: [MetaMask](https://metamask.io/), [WalletConnect](https://walletconnect.com/), [Coinbase Wallet](https://wallet.coinbase.com/), and [Magic Link](https://magic.link/).
- An app wide context containing an [ethers.js](https://github.com/ethers-io/ethers.js/) or [web3.js](https://web3js.readthedocs.io/en/v1.5.2/) instance with everything you need to integrate with the blockchain.
- Easy-to-use plug-and-play components that let you implement complex and fully-featured web3 app setups with only a few lines of code.

<br>

## Getting Started

To get started with the Thirdweb Component Library, you just need to setup the `ThirdwebProvider` that provides all the context consumed by your app and lets you use our custom components.

Setting up this context is as easy as wrapping your app with the following setup:

```javascript
import { ThirdwebProvider } from "@3rdweb/react";

const App = ({ children }) => {
  // Put the ethereum chain ids of the chains you want to support
  const supportedChainIds = [1, 4, 137];

  /**
   * Include the connectors you want to support
   * injected - MetaMask
   * magic - Magic Link
   * walletconnect - Wallet Connect
   * walletlink - Coinbase Wallet
   */
  const connectors = {
    injected: {},
    magic: {
      apiKey: "pk_...", // Your magic api key
      chainId: 1, // The chain ID you want to allow on magic
    },
    walletconnect: {},
    walletlink: {
      appName: "thirdweb - demo",
      url: "https://thirdweb.com",
      darkMode: false,
    },
  };

  /**
   * Make sure that your app is wrapped with these contexts.
   * If you're using Next JS, you'll have to replace children with the Component setup
   */
  return (
    <ThirdwebProvider 
      supportedChainIds={supportedChainIds}
      connectors={connectors}
    >
      {children}
    </ThirdwebProvider>
  );
};
```

<br>

## Connect Wallet & Web3 Setup

Currently, we provide you with components to easily integrate web3 into your app and setup an app wide context without having to deal with the complexity of lower level web3 configuration.

You can use our fully configured `ConnectWallet` component to handle all web3 connection and integration, including wallet connection and network switching. This is the easiest way to use the Thirdweb Component Library.

### **Use Connect Wallet**

Using our `ConnectWallet` component is the easiest way to integrate web3 into your app, complete with network switching, wallet connection, and everything else you need. Adding our connect wallet button is as easy as the following:

```javascript
import React from "react";
import { ConnectWallet } from "@3rdweb/react";

const Connect = () => {
  return <ConnectWallet />;
};
```

You can place this button anywhere in your app and it will display a wallet connection that displays connected chain, wallet address, and balance information as well as a fully-featured connection manager modal.

For a fully functional setup using our `ConnectWallet` button, you can checkout our [NextJS example connect page](https://github.com/nftlabs/ui/blob/main/examples/next/pages/connect.tsx).

<br>

### **Access Web3 Setup**

After you setup wallet connection with the above method, accessing your connected web3 provider and its related info is as easy as the following:

```javascript
import React from "react";
import { useWeb3 } from "@3rdweb/react";

const Component = () => {
  // You can do whatever you want with this data
  const { address, chainId, provider } = useWeb3();

  return (
    <div>
      Address: {address}
      <br />
      Chain ID: {chainId}
    </div>
  );
};
```