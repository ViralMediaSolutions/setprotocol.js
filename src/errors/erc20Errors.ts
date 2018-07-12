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

"use strict";

export const erc20AssertionErrors = {
  MISSING_ERC20_METHOD: (address: string) =>
    `Contract at ${address} does not implement ERC20 interface.`,
  INSUFFICIENT_BALANCE: () => "User does not have enough balance.",
  INSUFFICIENT_ALLOWANCE: () => "User not approved for enough allowance.",
};