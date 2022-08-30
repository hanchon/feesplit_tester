import { evmosToEth } from "@tharsis/address-converter";
import { Wallet } from "@ethersproject/wallet";
import {
  createTxMsgCancelFeeSplit,
  createTxMsgRegisterFeeSplit,
  createTxMsgUpdateFeeSplit,
} from "@tharsis/transactions";
import {
  broadcast,
  getSender,
  LOCALNET_CHAIN,
  LOCALNET_FEE,
  signTransaction,
  singTransactionUsingEIP712,
} from "@hanchon/evmos-ts-wallet";

const seed =
  "pluck view carry maid bamboo river major where dutch wood certain oval order wise awkward clerk adult summer because number raven coil crunch hat";
const contract = "0x241C7fEcBF9a602667CA04EeebC33bCae5b685c6";

async function createRegister(wallet: Wallet) {
  const fee = LOCALNET_FEE;
  fee.gas = "3000000";
  fee.amount = "300000";

  const sender = await getSender(wallet, "http://localhost:1317");
  const txSimple = createTxMsgRegisterFeeSplit(
    LOCALNET_CHAIN,
    sender,
    fee,
    "",
    {
      contractAddress: contract,
      deployerAddress: sender.accountAddress,
      withdrawerAddress: sender.accountAddress,
      nonces: [0],
    }
  );
  return { sender, txSimple };
}

async function createUpdate(wallet: Wallet) {
  const fee = LOCALNET_FEE;
  fee.gas = "3000000";
  fee.amount = "300000";

  const sender = await getSender(wallet, "http://localhost:1317");
  const txSimple = createTxMsgUpdateFeeSplit(LOCALNET_CHAIN, sender, fee, "", {
    contractAddress: contract,
    deployerAddress: sender.accountAddress,
    withdrawerAddress: "evmos1urc5gn9x4kvl3sxu4qd9vckfdmtet7shdskm55",
    nonces: [0],
  });
  return { sender, txSimple };
}

async function createCancel(wallet: Wallet) {
  const fee = LOCALNET_FEE;
  fee.gas = "3000000";
  fee.amount = "300000";

  const sender = await getSender(wallet, "http://localhost:1317");
  const txSimple = createTxMsgCancelFeeSplit(LOCALNET_CHAIN, sender, fee, "", {
    contractAddress: contract,
    deployerAddress: sender.accountAddress,
  });
  return { sender, txSimple };
}

(async () => {
  const wallet = Wallet.fromMnemonic(seed);

  // Use the message that you want to test
  const msg = await createRegister(wallet);
  // const msg = await createUpdate(wallet);
  // const msg = await createCancel(wallet);

  // Sign using EIP712
  const res = await singTransactionUsingEIP712(
    wallet,
    msg.sender.accountAddress,
    msg.txSimple
  );

  // Sign using protobuf
  // const res = await signTransaction(wallet, msg.txSimple);

  // Broadcast the transaction
  const broadcastRes = await broadcast(res, "http://localhost:1317");

  if (broadcastRes.tx_response.code === 0) {
    console.log("Transaction success");
  } else {
    console.log(`Error payload signature: ${JSON.stringify(broadcastRes)}`);
  }
})();
