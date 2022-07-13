// // const PouchDb = require('pouchdb')
// import PouchDb from 'pouchdb'

// export default class DB {
//   constructor(props) {
//     this.db = new PouchDb(props)
//   }

//   getAddresses = async () => {
//     const res = await this.db.allDocs({ include_docs: true })
//     //     let addresses = {}
//     //     res.rows.forEach((row) => (addresses[row.key] = row.value))
//     //     return addresses
//     return res.rows
//   };

//   getActiveWallet = async () => {
//     const res = await this.db.allDocs({ include_docs: true })
//     return res.rows[0]
//   };

//   updateAddresses = async (addresses) => {
//     const res = await this.db.post({ ...addresses })
//     console.log({ res })
//     return res
//   };

//   removeAddresses = async (addresses) => {
//     const res = await this.db.remove(addresses)
//     console.log({ res })
//     return res
//   };
// }
