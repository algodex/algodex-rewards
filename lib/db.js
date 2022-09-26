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
    wallets.forEach((wallet) => {
      const found = current.find(({ _id }) => _id == wallet.address)
      const db = this.db
      if (found) {
        db.get(wallet.address)
          .then((doc) => {
            doc.wallet = JSON.stringify(wallet)
            return db.put(doc)
          })
          .catch(() => {
            // console.error(error)
          })
      } else {
        db.put({ _id: wallet.address, wallet: JSON.stringify(wallet) }).catch(
          () => {
            // console.error(error)
          }
        )
      }
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
        .catch(() => {
          // console.error(err)
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
      await this.db
        .get(wallet)
        .then((doc) => {
          this.db.remove(doc).catch(() => {
            // console.error(err)
          })
        })
        .catch(() => {
          // console.error(err)
        })
    }
  }
}
