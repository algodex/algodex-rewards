import { useCallback, useContext, useEffect, useRef } from "react";

import QRCodeModal from "algorand-walletconnect-qrcode-modal";
import { WalletsContext } from "./useWallets";
const ERROR = {
  FAILED_TO_INIT: "WalletConnect Wallet failed to initialize.",
  FAILED_TO_CONNECT: "WalletConnect Wallet failed to connect.",
};

/**
 * Use Wallet Connect query
 * @param {Function} onConnect On Connect Callback
 * @param {Function} onDisconnect On Disconnect Callback
 * @return {object}
 */
export default function useWalletConnect(onConnect, onDisconnect) {
  /**
   * Instance referenc
   */
  // const walletConnect = useRef()
  const { walletConnect } = useContext(WalletsContext);
  const connect = async () => {
    try {
      // Something went wrong!
      if (!walletConnect.current) {
        console.error(ERROR.FAILED_TO_INIT);
        return;
      }
      // Check if connection is already established
      if (!walletConnect.current.connected) {
        console.log("Creating Session");
        // create new session
        walletConnect.current.createSession();
      } else {
        walletConnect.current.killSession();
        setTimeout(() => {
          walletConnect.current.createSession();
        }, 1000);
      }

    } catch (e) {
      console.error(ERROR.FAILED_TO_CONNECT, e);
    }
  };
  const disconnect = () => {
    if (walletConnect.current.connected) {
      onDisconnect(walletConnect.current.accounts[0]);
      walletConnect.current.killSession();
    }
  };

  const handleDisconnect = useCallback(
    (err) => {
      console.log("DISCONNECTED");
      if (err) throw err;
      localStorage.removeItem("walletconnect");
      onDisconnect(walletConnect.current.accounts[0]);
    },
    [onDisconnect]
  );

  const handleConnected = (err, payload) => {
    console.log("CONNECTED");
    if (err) {
      throw err;
    }

    let accounts = [];

    // Get provided accounts
    if (typeof payload !== "undefined" && Array.isArray(payload.params)) {
      accounts = payload.params[0].accounts;
    }

    // Map the connector to the address list
    const _addresses = accounts.map((acct) => ({
      type: "wallet-connect",
      connector: walletConnect.current,
      address: acct,
    }));
    onConnect(_addresses);
    QRCodeModal.close();
  };
  useEffect(() => {
    // let listener;
    if (typeof walletConnect.current !== "undefined") {
      walletConnect.current.on("connect", handleConnected);
      walletConnect.current.on("session_update", handleConnected);
      walletConnect.current.on("disconnect", handleDisconnect);
    }
    return () => {
      if (typeof walletConnect.current !== "undefined") {
        walletConnect.current.off("connect");
        walletConnect.current.off("session_update");
        walletConnect.current.off("disconnect");
      }
    };
  }, [walletConnect.current]);
  return { connect, disconnect, connector: walletConnect.current };
}
