/*
  Copyright 2018 Set Labs Inc.

  Licensed under the Apache License, Version 2.0 (the "License");
  you may not use this file except in compliance with the License.
  You may obtain a copy of the License at

  http://www.apache.org/licenses/LICENSE-2.0

  Unless required by applicable law or agreed to in writing, software
  distributed under the License is distributed on an "AS IS" BASIS,
  WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
  See the License for the specific language governing permissions and
  limitations under the License.
*/

'use strict';

import * as _ from 'lodash';
import * as Web3 from 'web3';
import { Address, SetProtocolUtils } from 'set-protocol-utils';
import { Provider } from 'ethereum-types';
import { Vault, VaultContract } from 'set-protocol-contracts';

import { DEFAULT_ACCOUNT } from '@src/constants/accounts';
import { VaultWrapper } from '@src/wrappers';
import { DEFAULT_GAS_PRICE, DEFAULT_GAS_LIMIT, TX_DEFAULTS } from '@src/constants';
import { BigNumber } from '@src/util';

const contract = require('truffle-contract');


export const getVaultBalances = async (
  vault: VaultContract,
  tokenAddresses: Address[],
  owner: Address
): Promise<BigNumber[]> => {
  const balancePromises = _.map(tokenAddresses, address => {
    return vault.getOwnerBalance.callAsync(address, owner);
  });

  let vaultBalances: BigNumber[] = new Array(tokenAddresses.length).fill(SetProtocolUtils.CONSTANTS.ZERO);
  await Promise.all(balancePromises).then(fetchedTokenBalances => {
    vaultBalances = fetchedTokenBalances;
  });

  return vaultBalances;
};
