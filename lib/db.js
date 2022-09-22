import PouchDB from 'pouchdb'

export default class DB {
  constructor(props) {
    this.db = new PouchDB(props)
  }

  getAddresses = async () => {
    const res = await this.db.allDocs({ include_docs: true, descending: true })
    return res.rows
  }

  updateAddresses = async (wallets) => {
    const current = (await this.getAddresses()).map(({ doc }) => doc)
    const mergedAddresses = wallets.reduce((arr, wallet, index) => {
      const found = arr.find(({ _id }) => _id == wallet.address)
      if (found) {
        arr[index] = {
          _id: wallet.address,
          _rev: found._rev,
          wallet: JSON.stringify(wallet),
        }
      } else {
        arr.push({ _id: wallet.address, wallet: JSON.stringify(wallet) })
      }
      return arr
    }, current)
    console.debug({ mergedAddresses })
    mergedAddresses.forEach((wallet) => {
      this.db.put(wallet).catch((err) => {
        console.error(err)
      })
    })
  }

  updateActiveWallet = async (activeWallet) => {
    const currentDB = (await this.getAddresses()).map(({ doc }) => doc)
    if (!currentDB[0]?._id || currentDB[0]?._id !== activeWallet.address) {
      await this.db
        .put({
          _id: activeWallet.address,
          wallet: JSON.stringify(activeWallet),
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }

  removeAddress = async (wallet) => {
    const currentDB = await (
      await this.db.allDocs({ include_docs: true, descending: true })
    ).rows
    const current = currentDB.map(({ doc }) => doc)
    const found = current.find(({ _id }) => _id === wallet)
    if (found) {
      this.db
        .get(wallet)
        .then((doc) => {
          this.db.remove(doc)
        })
        .catch((err) => {
          console.error(err)
        })
    }
  }
}
