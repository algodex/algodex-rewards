/* 
 * Algodex Rewards 
 * Copyright (C) 2022 Algodex VASP (BVI) Corp.
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published
 * by the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.

 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */

/* eslint-disable max-len */
import { formatJsonRpcRequest } from '@json-rpc-tools/utils'
import algosdk from 'algosdk'
import { getAlgodex } from './helper'

export const signUpForRewards = async (wallet) => {
  const { algodClient } = getAlgodex()
  let params = await algodClient.getTransactionParams().do()
  const receiver = 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'
  const to = wallet.address
  const enc = new TextEncoder()
  const text = 'Algodex Rewards Opt-In'
  const note = enc.encode(text)
  let txn = algosdk.makePaymentTxnWithSuggestedParams(
    to,
    receiver,
    0,
    undefined,
    note,
    params
  )
  if (wallet.type == 'wallet-connect') {
    return await SignWalletConnectAndSendTxns(
      wallet.connector,
      algodClient,
      txn,
      text
    )
  } else {
    return await SignMyAlgoAndSendTxns(algodClient, txn)
  }
}

const SignWalletConnectAndSendTxns = async (
  connector,
  algodClient,
  txn,
  text
) => {
  try {
    const encodedTxn = Buffer.from(
      algosdk.encodeUnsignedTransaction(txn)
    ).toString('base64')

    const txnsToSign = [
      {
        txn: encodedTxn,
        message: text,
      },
    ]

    const requestParams = [txnsToSign]
    const request = formatJsonRpcRequest('algo_signTxn', requestParams)
    const result = await connector.sendCustomRequest(request)
    const decodedResult = result.map((element) => {
      return element ? new Uint8Array(Buffer.from(element, 'base64')) : null
    })

    return SubmitTransaction(algodClient, decodedResult[0], txn)
  } catch (error) {
    return error
  }
}

const SignMyAlgoAndSendTxns = async (algodClient, txn) => {
  try {
    // '@randlabs/myalgo-connect' is imported dynamically because it uses the window object
    const MyAlgoConnect = (await import('@randlabs/myalgo-connect')).default
    const myAlgoWallet = new MyAlgoConnect()
    const signed = await myAlgoWallet.signTransaction(txn.toByte())
    const signedTxn = signed.blob
    console.debug({ signedTxn })
    return SubmitTransaction(algodClient, signedTxn, txn)
  } catch (error) {
    return error
  }
}

const SubmitTransaction = async (algodClient, signedTxn, txn) => {
  let txId = txn.txID().toString()
  try {
    await algodClient.sendRawTransaction(signedTxn).do()

    //Confirm and  Wait for confirmation
    let confirmedTxn = await WaitForConfirmation(algodClient, txId, 4)
    console.debug(
      'Transaction ' +
        txId +
        ' confirmed in round ' +
        confirmedTxn['confirmed-round']
    )
    //     let mytxinfo = JSON.stringify(confirmedTxn.txn.txn, undefined, 2)
    //     console.debug('Transaction information: %o', mytxinfo)
    // var string = new TextDecoder().decode(confirmedTxn.txn.txn.note)
    // console.debug('Note field: ', string)
    return {
      error: false,
      confirmedTxn,
    }
  } catch (error) {
    return error
  }
}

const WaitForConfirmation = async (algodClient, txId, timeout) => {
  if (algodClient == null || txId == null || timeout < 0) {
    throw new Error('Bad arguments')
  }

  const status = await algodClient.status().do()
  if (status === undefined) {
    throw new Error('Unable to get node status')
  }

  const startround = status['last-round'] + 1
  let currentround = startround

  while (currentround < startround + timeout) {
    const pendingInfo = await algodClient
      .pendingTransactionInformation(txId)
      .do()
    if (pendingInfo !== undefined) {
      if (
        pendingInfo['confirmed-round'] !== null &&
        pendingInfo['confirmed-round'] > 0
      ) {
        //Got the completed Transaction
        return pendingInfo
      } else {
        if (
          pendingInfo['pool-error'] != null &&
          pendingInfo['pool-error'].length > 0
        ) {
          // If there was a pool error, then the transaction has been rejected!
          throw new Error(
            'Transaction ' +
              txId +
              ' rejected - pool error: ' +
              pendingInfo['pool-error']
          )
        }
      }
    }
    await algodClient.statusAfterBlock(currentround).do()
    currentround++
  }

  throw new Error(
    'Transaction ' + txId + ' not confirmed after ' + timeout + ' rounds!'
  )
}
