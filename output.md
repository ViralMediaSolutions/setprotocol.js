##  SetProtocol
###  awaitTransactionMinedAsync

Polls the Ethereum blockchain until the specified transaction has been mined or
the timeout limit is reached, whichever occurs first

[Source](SetProtocol.ts#L287)

```javascript
setProtocol.awaitTransactionMinedAsync(
  txHash: string,
  pollingIntervalMs?: number,
  timeoutMs?: number,
): Promise<TransactionReceipt>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| txHash | string | Transaction hash to poll |
| pollingIntervalMs | number | Interval at which the blockchain should be polled |
| timeoutMs | number | Number of milliseconds until this process times out. If
                               no value is provided, a default value is used |
######  Returns
`Promise<TransactionReceipt>` - Transaction receipt resulting from the mining process



---

###  createSetAsync

Create a new Set by passing in parameters denoting component token addresses, quantities, natural
unit, and ERC20 properties

Note: the return value is the transaction hash of the createSetAsync call, not the deployed SetToken
contract address. Use `getSetAddressFromCreateTxHashAsync` to retrieve the SetToken address


[Source](SetProtocol.ts#L109)

```javascript
setProtocol.createSetAsync(
  components: Address[],
  units: BigNumber[],
  naturalUnit: BigNumber,
  name: string,
  symbol: string,
  txOpts?: TxData,
): Promise<string>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| components | Address[] | Component ERC20 token addresses |
| units | BigNumber[] | Units of each component in Set paired in index order |
| naturalUnit | BigNumber | Lowest common denominator for the Set |
| name | string | Name for Set, i.e. "DEX Set" |
| symbol | string | Symbol for Set, i.e. "DEX" |
| txOpts | TxData | Transaction options object conforming to TxData with signer, gas, and gasPrice data |
######  Returns
`Promise<string>` - Transaction hash



---

###  depositAsync

Deposits tokens into the vault under the signer's address that can be used to issue a Set

[Source](SetProtocol.ts#L164)

```javascript
setProtocol.depositAsync(
  tokenAddresses: Address[],
  quantities: BigNumber[],
  txOpts: TxDataWithFrom,
): Promise<string>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| tokenAddresses | Address[] | Addresses of ERC20 tokens to deposit into the vault |
| quantities | BigNumber[] | Amount of each token to deposit into the vault in index order with `tokenAddresses` |
| txOpts | TxDataWithFrom | Transaction options object conforming to TxData with signer, gas, and gasPrice data |
######  Returns
`Promise<string>` - Transaction hash



---

###  getBalanceInVaultAsync

Fetch the balance of the provided token contract address inside the Vault

[Source](SetProtocol.ts#L233)

```javascript
setProtocol.getBalanceInVaultAsync(
  tokenAddress: Address,
  ownerAddress: Address,
): Promise<BigNumber>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| tokenAddress | Address | Address of the token contract (typically SetToken or ERC20) |
| ownerAddress | Address | Address of the token owner |
######  Returns
`Promise<BigNumber>` - Balance of the contract in the vault



---

###  getSetAddressFromCreateTxHashAsync

Fetch a Set Token address from a createSetAsync transaction hash

[Source](SetProtocol.ts#L243)

```javascript
setProtocol.getSetAddressFromCreateTxHashAsync(
  txHash: string,
): Promise<Address>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| txHash | string | Transaction hash of the createSetAsync transaction |
######  Returns
`Promise<Address>` - Address of the newly created Set



---

###  getSetAddressesAsync

Fetch the addresses of all SetTokens and RebalancingSetTokens

[Source](SetProtocol.ts#L252)

```javascript
setProtocol.getSetAddressesAsync(): Promise<Address[]>
```

######  Returns
`Promise<Address[]>` - Array of SetToken and RebalancingSetToken addresses



---

###  isValidFactoryAsync

Verifies that the provided factory address is enabled for creating new Sets

[Source](SetProtocol.ts#L262)

```javascript
setProtocol.isValidFactoryAsync(
  factoryAddress: Address,
): Promise<boolean>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| factoryAddress | Address | Address of the factory contract |
######  Returns
`Promise<boolean>` - Whether the factory contract is enabled



---

###  isValidSetAsync

Verifies that the provided SetToken or RebalancingSetToken address is enabled
for issuance and redemption

[Source](SetProtocol.ts#L273)

```javascript
setProtocol.isValidSetAsync(
  setAddress: Address,
): Promise<boolean>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| setAddress | Address | Address of the SetToken or RebalancingSetToken contract |
######  Returns
`Promise<boolean>` - Whether the contract is enabled for transacting



---

###  issueAsync

Issues a Set to the transaction signer. Must have component tokens in the correct quantites in either
the vault or in the signer's wallet. Component tokens must be approved to the Transfer
Proxy contract via setTransferProxyAllowanceAsync

[Source](SetProtocol.ts#L130)

```javascript
setProtocol.issueAsync(
  setAddress: Address,
  quantity: BigNumber,
  txOpts: TxDataWithFrom,
): Promise<string>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| setAddress | Address | Address Set to issue |
| quantity | BigNumber | Amount of Set to issue. Must be multiple of the natural unit of the Set |
| txOpts | TxDataWithFrom | Transaction options object conforming to TxData with signer, gas, and gasPrice data |
######  Returns
`Promise<string>` - Transaction hash



---

###  redeemAsync

Redeems a Set to the transaction signer, returning the component tokens to the signer's wallet. Use `false` for
`withdraw` to leave redeemed components in vault under the user's address to save gas if rebundling into another
Set with similar components

[Source](SetProtocol.ts#L146)

```javascript
setProtocol.redeemAsync(
  setAddress: Address,
  quantity: BigNumber,
  withdraw: boolean,
  tokensToExclude: Address[],
  txOpts: TxDataWithFrom,
): Promise<string>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| setAddress | Address | Address of Set to issue |
| quantity | BigNumber | Amount of Set to redeem. Must be multiple of the natural unit of the Set |
| withdraw | boolean | Boolean to withdraw back to signer's wallet or leave in vault. Defaults to true |
| tokensToExclude | Address[] | Token addresses to exclude from withdrawal |
| txOpts | TxDataWithFrom | Transaction options object conforming to TxData with signer, gas, and gasPrice data |
######  Returns
`Promise<string>` - Transaction hash



---

###  setTransferProxyAllowanceAsync

Sets the TransferProxy contract's allowance to a specified quantity on behalf of the signer. Allowance is
required for issuing, redeeming, and filling issuance orders

[Source](SetProtocol.ts#L197)

```javascript
setProtocol.setTransferProxyAllowanceAsync(
  tokenAddress: string,
  quantity: BigNumber,
  txOpts?: TxData,
): Promise<string>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| tokenAddress | string | Address of token contract to approve (typically SetToken or ERC20) |
| quantity | BigNumber | Allowance quantity |
| txOpts | TxData | Transaction options object conforming to TxData with signer, gas, and gasPrice data |
######  Returns
`Promise<string>` - Transaction hash



---

###  setUnlimitedTransferProxyAllowanceAsync

Sets the TransferProxy contract's allowance to the maximum amount on behalf of the signer. Allowance is
required for issuing, redeeming, and filling issuance orders

[Source](SetProtocol.ts#L218)

```javascript
setProtocol.setUnlimitedTransferProxyAllowanceAsync(
  tokenAddress: string,
  txOpts?: TxData,
): Promise<string>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| tokenAddress | string | Address of contract to approve (typically SetToken or ERC20) |
| txOpts | TxData | Transaction options object conforming to TxData with signer, gas, and gasPrice data |
######  Returns
`Promise<string>` - Transaction hash



---

###  withdrawAsync

Withdraws tokens from the vault belonging to the signer

[Source](SetProtocol.ts#L180)

```javascript
setProtocol.withdrawAsync(
  tokenAddresses: Address[],
  quantities: BigNumber[],
  txOpts: TxDataWithFrom,
): Promise<string>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| tokenAddresses | Address[] | Addresses of ERC20 tokens to withdraw from the vault |
| quantities | BigNumber[] | Amount of each token token to withdraw from vault in index order with `tokenAddresses` |
| txOpts | TxDataWithFrom | Transaction options object conforming to TxData with signer, gas, and gasPrice data |
######  Returns
`Promise<string>` - Transaction hash



---

##  ERC20API
###  approveAsync

Approves the specified amount of allowance to the spender on behalf of the signer

[Source](api/ERC20API.ts#L187)

```javascript
setProtocol.erc20.approveAsync(
  tokenAddress: Address,
  spenderAddress: Address,
  value: BigNumber,
  txOpts?: TxData,
): Promise<string>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| tokenAddress | Address | Address of the token being used |
| spenderAddress | Address | Address to approve allowance to |
| value | BigNumber | Amount of allowance to grant |
| txOpts | TxData | Transaction options object conforming to TxData with signer, gas, and gasPrice data |
######  Returns
`Promise<string>` - The hash of the resulting transaction



---

###  getAllowanceAsync

Fetches the allowance of the spender for the token by the owner

[Source](api/ERC20API.ts#L124)

```javascript
setProtocol.erc20.getAllowanceAsync(
  tokenAddress: Address,
  ownerAddress: Address,
  spenderAddress: Address,
): Promise<BigNumber>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| tokenAddress | Address | Address of the token |
| ownerAddress | Address | Address of the owner |
| spenderAddress | Address | Address of the spender |
######  Returns
`Promise<BigNumber>` - Allowance of the spender



---

###  getBalanceOfAsync

Fetches the balance of the ERC20 token the user

[Source](api/ERC20API.ts#L62)

```javascript
setProtocol.erc20.getBalanceOfAsync(
  tokenAddress: Address,
  userAddress: Address,
): Promise<BigNumber>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| tokenAddress | Address | Address of the ERC20 token |
| userAddress | Address | Wallet address of the user |
######  Returns
`Promise<BigNumber>` - Balance of the ERC20 token



---

###  getDecimalsAsync

Fetches the decimals of the ERC20 token

[Source](api/ERC20API.ts#L110)

```javascript
setProtocol.erc20.getDecimalsAsync(
  tokenAddress: Address,
): Promise<BigNumber>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| tokenAddress | Address | Address of the ERC20 token |
######  Returns
`Promise<BigNumber>` - Decimals of the ERC20 token



---

###  getNameAsync

Fetches the name of the ERC20 token

[Source](api/ERC20API.ts#L74)

```javascript
setProtocol.erc20.getNameAsync(
  tokenAddress: Address,
): Promise<string>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| tokenAddress | Address | Address of the ERC20 token |
######  Returns
`Promise<string>` - Name of the ERC20 token



---

###  getSymbolAsync

Fetches the symbol of the ERC20 token

[Source](api/ERC20API.ts#L86)

```javascript
setProtocol.erc20.getSymbolAsync(
  tokenAddress: Address,
): Promise<string>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| tokenAddress | Address | Address of the ERC20 token |
######  Returns
`Promise<string>` - Symbol of the ERC20 token



---

###  getTotalSupplyAsync

Fetches the total supply of the ERC20 token

[Source](api/ERC20API.ts#L98)

```javascript
setProtocol.erc20.getTotalSupplyAsync(
  tokenAddress: Address,
): Promise<BigNumber>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| tokenAddress | Address | Address of the ERC20 token |
######  Returns
`Promise<BigNumber>` - Total supply of the ERC20 token



---

###  transferAsync

Transfer balance denominated in the specified ERC20 token to another address

[Source](api/ERC20API.ts#L143)

```javascript
setProtocol.erc20.transferAsync(
  tokenAddress: Address,
  to: Address,
  value: BigNumber,
  txOpts?: TxData,
): Promise<string>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| tokenAddress | Address | Address of the token to transfer |
| to | Address | Address of the receiver |
| value | BigNumber | Amount being transferred |
| txOpts | TxData | Transaction options object conforming to TxData with signer, gas, and gasPrice data |
######  Returns
`Promise<string>` - Transaction hash



---

###  transferFromAsync

Transfer balance denominated in the specified ERC20 token on behalf of the owner. Caller
must have sufficient allowance from owner in order to complete transfer. Use `approveAsync`
to grant allowance

[Source](api/ERC20API.ts#L166)

```javascript
setProtocol.erc20.transferFromAsync(
  tokenAddress: Address,
  from: Address,
  to: Address,
  value: BigNumber,
  txOpts?: TxData,
): Promise<string>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| tokenAddress | Address | Address of the token to transfer |
| from | Address | Token owner |
| to | Address | Address of the receiver |
| value | BigNumber | Amount to be transferred |
| txOpts | TxData | Transaction options object conforming to TxData with signer, gas, and gasPrice data |
######  Returns
`Promise<string>` - Transaction hash



---

##  OrderAPI
###  cancelOrderAsync

Cancels an issuance order on behalf of the maker. After successfully mining this transaction, a taker can only
fill up to an issuance order's quantity minus the quantity

[Source](api/OrderAPI.ts#L232)

```javascript
setProtocol.orders.cancelOrderAsync(
  issuanceOrder: IssuanceOrder,
  quantity: BigNumber,
  txOpts?: TxData,
): Promise<string>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| issuanceOrder | IssuanceOrder | Object confomring to IssuanceOrder to cancel |
| quantity | BigNumber | Amount of the issuance order's quantity to cancel |
| txOpts | TxData | Transaction options object conforming to TxData with signer, gas, and gasPrice data |
######  Returns
`Promise<string>` - Transaction hash



---

###  createSignedOrderAsync

Creates a new issuance order with a valid signature denoting the user's intent to exchange some maker token for
a Set token. Suggest using a popular trading pair as the maker token such as WETH or Dai in order to take
advantage of external liquidity sources

[Source](api/OrderAPI.ts#L156)

```javascript
setProtocol.orders.createSignedOrderAsync(
  setAddress: Address,
  quantity: BigNumber,
  requiredComponents: Address[],
  requiredComponentAmounts: BigNumber[],
  makerAddress: Address,
  makerToken: Address,
  makerTokenAmount: BigNumber,
  expiration: BigNumber,
  relayerAddress: Address,
  relayerToken: Address,
  makerRelayerFee: BigNumber,
  takerRelayerFee: BigNumber,
  salt: BigNumber,
): Promise<SignedIssuanceOrder>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| setAddress | Address | Address of the Set token for issuance order |
| quantity | BigNumber | Amount of the Set token to create as part of issuance order |
| requiredComponents | Address[] | Addresses of required component tokens of the Set |
| requiredComponentAmounts | BigNumber[] | Amounts of each required component needed |
| makerAddress | Address | Address of user making the issuance order |
| makerToken | Address | Address of token the issuance order maker is offering for the transaction |
| makerTokenAmount | BigNumber | Amount of tokens maker offers for aggergate order size |
| expiration | BigNumber | Unix timestamp of expiration in seconds |
| relayerAddress | Address | Address of relayer of order |
| relayerToken | Address | Address of token paid to relayer as a fee |
| makerRelayerFee | BigNumber | Amount of relayer token paid to relayer by maker |
| takerRelayerFee | BigNumber | Amount of relayer token paid to relayer by taker |
| salt | BigNumber | Optional salt to include in signing |
######  Returns
`Promise<SignedIssuanceOrder>` - Object conforming to SignedIssuanceOrder with valid signature



---

###  fillOrderAsync

Fills an issuance order on behalf of the taker. The taker should specifiy the fill amount and the liquidity
sources, either other exchange orders that can be exchanged using the specified maker token in the issuance order,
or from the taker's own wallet

[Source](api/OrderAPI.ts#L206)

```javascript
setProtocol.orders.fillOrderAsync(
  signedIssuanceOrder: SignedIssuanceOrder,
  quantity: BigNumber,
  orders: (ZeroExSignedFillOrder | TakerWalletOrder)[],
  txOpts: TxDataWithFrom,
): Promise<string>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| signedIssuanceOrder | SignedIssuanceOrder | Object confomring to SignedIssuanceOrder to fill |
| quantity | BigNumber | Amount of Set to fill in this call |
| orders | (ZeroExSignedFillOrder | TakerWalletOrder)[] | Array of order objects conforming to either TakerWalletOrder or
                                 ZeroExSignedFillOrder to fill issuance order |
| txOpts | TxDataWithFrom | Transaction options object conforming to TxData with signer, gas, and gasPrice data |
######  Returns
`Promise<string>` - Transaction hash



---

###  generateExpirationTimestamp

Generates a timestamp represented as seconds since unix epoch. The timestamp is intended to be
used to generate the expiration of an issuance order

[Source](api/OrderAPI.ts#L88)

```javascript
setProtocol.orders.generateExpirationTimestamp(
  seconds: number,
): BigNumber
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| seconds | number | Seconds from the present time |
######  Returns
`BigNumber` - Unix timestamp (in seconds since unix epoch)



---

###  generateSalt

Generates a 256-bit salt that can be included in an order, to ensure that the order generates
a unique orderHash and will not collide with other outstanding orders that are identical

[Source](api/OrderAPI.ts#L77)

```javascript
setProtocol.orders.generateSalt(): BigNumber
```

######  Returns
`BigNumber` - 256-bit number that can be used as a salt



---

###  getOrderCancelledAsync

Given an Issuance Order, gets the quantity of the Issuance Order cancelled

[Source](api/OrderAPI.ts#L260)

```javascript
setProtocol.orders.getOrderCancelledAsync(
  issuanceOrder: IssuanceOrder,
): Promise<BigNumber>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| issuanceOrder | IssuanceOrder | Issuance Order |
######  Returns
`Promise<BigNumber>` - Quantity of Issuance Order cancelled



---

###  getOrderFillsAsync

Given an Issuance Order, gets the quantity of the Issuance Order filled

[Source](api/OrderAPI.ts#L248)

```javascript
setProtocol.orders.getOrderFillsAsync(
  issuanceOrder: IssuanceOrder,
): Promise<BigNumber>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| issuanceOrder | IssuanceOrder | Issuance Order |
######  Returns
`Promise<BigNumber>` - Quantity of Issuance Order filled



---

###  isValidSignatureOrThrowAsync

Checks whether a signature produced for an issuance order is valid. A signature is valid only
if the issuance order is signed by the maker. The function throws upon receiving an invalid signature

[Source](api/OrderAPI.ts#L100)

```javascript
setProtocol.orders.isValidSignatureOrThrowAsync(
  issuanceOrder: IssuanceOrder,
  signature: ECSig,
): Promise<boolean>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| issuanceOrder | IssuanceOrder | Object conforming to the IssuanceOrder interface |
| signature | ECSig | Object conforming to ECSignature containing elliptic curve signature components |
######  Returns
`Promise<boolean>` - Whether the recovered signature matches the data hash



---

###  signOrderAsync

Generates a ECSig from an IssuanceOrder objects. It signs the user using the signer in the transaction options.
If none is provided, it will assume, it will grab the first account from the provider

[Source](api/OrderAPI.ts#L118)

```javascript
setProtocol.orders.signOrderAsync(
  issuanceOrder: IssuanceOrder,
  txOpts: TxDataWithFrom,
): Promise<ECSig>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| issuanceOrder | IssuanceOrder | Issuance Order |
| txOpts | TxDataWithFrom |  |
######  Returns
`Promise<ECSig>` - Object conforming to ECSignature containing elliptic curve signature components



---

###  validateOrderFillableOrThrowAsync

Validates an IssuanceOrder object's signature, expiration, and fill amount. Developers should call this method
frequently to prune order books and ensure the order has not already been filled or cancelled

[Source](api/OrderAPI.ts#L132)

```javascript
setProtocol.orders.validateOrderFillableOrThrowAsync(
  signedIssuanceOrder: SignedIssuanceOrder,
  fillQuantity: BigNumber,
): Promise<void>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| signedIssuanceOrder | SignedIssuanceOrder |  |
| fillQuantity | BigNumber | Fill quantity to check if fillable
 |
######  Returns
`Promise<void>` - 


---

##  SetTokenAPI
###  getComponentsAsync

Fetches the addresses of the component tokens that make up the Set

[Source](api/SetTokenAPI.ts#L74)

```javascript
setProtocol.setToken.getComponentsAsync(
  setAddress: Address,
): Promise<Address[]>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| setAddress | Address | Address of the Set |
######  Returns
`Promise<Address[]>` - An array of token addresses



---

###  getFactoryAsync

Fetches the address of the factory that created the Set

[Source](api/SetTokenAPI.ts#L62)

```javascript
setProtocol.setToken.getFactoryAsync(
  setAddress: Address,
): Promise<Address>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| setAddress | Address | Address of the Set |
######  Returns
`Promise<Address>` - Address of the factory that ceated the Set



---

###  getNaturalUnitAsync

Fetches the natural unit of the Set

[Source](api/SetTokenAPI.ts#L86)

```javascript
setProtocol.setToken.getNaturalUnitAsync(
  setAddress: Address,
): Promise<BigNumber>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| setAddress | Address | Address of the Set |
######  Returns
`Promise<BigNumber>` - Natural unit of the Set



---

###  getUnitsAsync

Fetches units of each component token that make up the Set

[Source](api/SetTokenAPI.ts#L99)

```javascript
setProtocol.setToken.getUnitsAsync(
  setAddress: Address,
): Promise<BigNumber[]>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| setAddress | Address | Address of the Set |
######  Returns
`Promise<BigNumber[]>` - An array of units that make up the Set composition which correspond
                        to the component tokens in the Set



---

###  isMultipleOfNaturalUnitAsync

Valiates whether the quantity passed in is a multiple of a Set's natural unit

[Source](api/SetTokenAPI.ts#L113)

```javascript
setProtocol.setToken.isMultipleOfNaturalUnitAsync(
  setAddress: Address,
  quantity: BigNumber,
): Promise<boolean>
```

######  Parameters
| Name | Type | Description |
| ------ | ------ | ------ |
| setAddress | Address | Address of the Set |
| quantity | BigNumber | Quantity to be checked |
######  Returns
`Promise<boolean>` - boolean       Boolean representing whether the Set is a multiple of the natural unit




---

##  Interfaces
####  SetProtocolConfig
```javascript
{
  coreAddress: Address;
  setTokenFactoryAddress: Address;
  transferProxyAddress: Address;
  vaultAddress: Address;
}
```

####  DecodedLog
```javascript
{
  address: string;
  events: DecodedMethodParam[];
  name: string;
}
```

####  DecodedMethod
```javascript
{
  name: string;
  params: DecodedMethodParam[];
}
```

####  DecodedMethodParam
```javascript
{
  name: string;
  type: string;
  value: string | boolean;
}
```

####  Assertion
```javascript
{
  above: NumberComparer;
  and: Assertion;
  at: Assertion;
  be: Assertion;
  been: Assertion;
  below: NumberComparer;
  bignumber: Assertion;
  greaterThan: NumberComparer;
  gt: NumberComparer;
  gte: NumberComparer;
  has: Assertion;
  have: Assertion;
  instanceOf: InstanceOf;
  instanceof: InstanceOf;
  is: Assertion;
  least: NumberComparer;
  lessThan: NumberComparer;
  lt: NumberComparer;
  lte: NumberComparer;
  most: NumberComparer;
  of: Assertion;
  same: Assertion;
  that: Assertion;
  to: Assertion;
  which: Assertion;
  with: Assertion;
  within: undefined;
}
```

####  Component
```javascript
{
  address: Address;
  unit: BigNumber;
}
```

####  CreateLogArgs
```javascript
{
  _components: Address[];
  _factoryAddress: Address;
  _name: string;
  _naturalUnit: BigNumber;
  _setTokenAddress: Address;
  _symbol: string;
  _units: BigNumber[];
}
```

####  JSONRPCRequestPayload
```javascript
{
  id: number;
  jsonrpc: string;
  method: string;
  params: any[];
}
```

####  JSONRPCResponsePayload
```javascript
{
  id: number;
  jsonrpc: string;
  result: any;
}
```

####  Provider
```javascript
{
  sendAsync: undefined;
}
```

####  SetComponent
```javascript
{
  address: Address;
  name: string;
  quantity: string;
  symbol: string;
}
```

####  Token
```javascript
{
  address: Address;
  balance: BigNumber;
  decimals: BigNumber;
  name: string;
  symbol: string;
}
```

####  TxData
```javascript
{
  from: Address;
  gas: UInt;
  gasPrice: UInt;
  nonce: number;
}
```

####  TxDataPayable
```javascript
{
  from: Address;
  gas: UInt;
  gasPrice: UInt;
  nonce: number;
  value: BigNumber;
}
```

####  TxDataWithFrom
```javascript
{
  from: Address;
  gas: UInt;
  gasPrice: UInt;
  nonce: number;
}
```

