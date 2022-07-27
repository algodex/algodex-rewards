import PouchDB from 'pouchdb'

export default class DB {
  constructor(props) {
    this.db = new PouchDB(props)
  }

  getAddresses = async () => {
    const res = await this.db.allDocs({ include_docs: true })
    return res.rows
  };

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
    console.log({ mergedAddresses })
    mergedAddresses.forEach((wallet) => {
      this.db.put(wallet).catch((err) => {
        console.error(err)
      })
    })
  };

  updateActiveWallet = async (activeWallet) => {
    const current = await this.getAddresses()
    if (current.length > 0) {
      await this.db.remove(current[0].doc)
    }
    await this.db
      .put({
        _id: activeWallet.address,
        wallet: JSON.stringify(activeWallet),
      })
      .catch((err) => {
        console.error(err)
      })
  };

  removeAddress = async (wallet) => {
    this.db
      .get(wallet)
      .then((doc) => {
        return this.db.remove(doc)
      })
      .catch((err) => {
        console.error(err)
      })
  };
}
