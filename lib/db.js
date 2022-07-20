import PouchDB from 'pouchdb'

export default class DB {
  constructor(props) {
    this.db = new PouchDB(props)
  }

  getAddresses = async () => {
    const res = await this.db.allDocs({ include_docs: true })
    return res.rows
  };

  getActiveWallet = async () => {
    const res = await this.db.allDocs({ include_docs: true })
    return res.rows[0]
  };

  updateAddresses = async (wallet) => {
    console.log({ wallet })
    const res = await this.db.post({wallet})
    console.log({ res })
    //     return res
  };

  updateActiveWallet = async (activeWallet) => {
    const res = await this.db.post(activeWallet)
    console.log({ res })
    return res
  };
  
  removeAddresses = async (addresses) => {
    const res = await this.db.remove(addresses)
    console.log({ res })
    return res
  };


  removeActiveWallet = async (activeWallet) => {
    const res = await this.db.remove(activeWallet)
    console.log({ res })
    return res
  };
}

