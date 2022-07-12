/* eslint-disable max-len */
const helper = require('./helper.js')
const algosdk = require('algosdk')

export const signUpForRewards = async ({ address }) => {
  console.debug(address)
  const { algodClient } = helper.getAlgodex()
  let params = await algodClient.getTransactionParams().do()
  const receiver = 'GD64YIY3TWGDMCNPP553DZPPR6LDUSFQOIJVFDPPXWEG3FVOJCCDBBHU5A'
  const enc = new TextEncoder()
  const note = enc.encode('Algodex Rewards Opt-In')
  let txn = algosdk.makePaymentTxnWithSuggestedParams(
    address,
    receiver,
    0,
    undefined,
    note,
    params
  )
  return await SignMyAlgoAndSendTxns(algodClient, txn)
}

const SignMyAlgoAndSendTxns = async (algodClient, txn) => {
  // '@randlabs/myalgo-connect' is imported dynamically because it uses the window object
  const MyAlgoConnect = (await import('@randlabs/myalgo-connect')).default
  const myAlgoWallet = new MyAlgoConnect()
  const signedTxn = await myAlgoWallet.signTransaction(txn.toByte())

  let txId = txn.txID().toString()
  try {
    //Submit transaction
    await algodClient.sendRawTransaction(signedTxn.blob).do()

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
    var string = new TextDecoder().decode(confirmedTxn.txn.txn.note)
    console.debug('Note field: ', string)
    return {
      error: false,
      confirmedTxn,
    }
  } catch (error) {
    console.error(error)
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
