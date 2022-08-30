# FeeSplit tester

## Requirements

- Evmosd node
- Wallet seed
- Contract deployed with that Wallet
- Change the seed and contract constants in the `t.ts` file

```sh
yarn install
evmosd start --json-rpc.api eth,txpool,personal,net,debug,web3 --api.enable true --api.enabled-unsafe-cors true
```

## Usage

Change the commented code in the `t.ts` file to just leave uncommented the function that you want to test.
EIP712 and Protobuf signatures are supported, just leave uncommented the one that you want to use.

```sh
tsc t.js && node t.js
```
