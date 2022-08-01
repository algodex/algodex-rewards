import PouchDB from 'pouchdb'
import PouchMapReduce from 'pouchdb-mapreduce'
PouchDB.plugin(PouchMapReduce)

const getDatabase = (name) => {
  const hostname = window.location.hostname
  const protocol = window.location.protocol
  const port = window.location.port
  const baseUrl = protocol + '//' + hostname + ':' + port + '/pouch'
  const options = {
    auth: {
      username: 'dbreader',
      password: 'plaintext_password',
    },
  }
  const db = new PouchDB(`${baseUrl}/${name}`, options)
  return db
}

export const getRewardsData = async (wallet) => {
  if (wallet) {
    const rewardsDB = getDatabase('rewards')
    const rewardsData = await rewardsDB.query('rewards/rewards', {
      reduce: false,
      keys: [wallet],
    })
    return rewardsData
  } else {
    throw new TypeError('You cannot get rewards with an invalid address')
  }
}

export const getVestedRewardsData = async (wallet) => {
  if (wallet) {
    const rewardsDB = getDatabase('vested_rewards')
    const rewardsData = await rewardsDB.query('vested_rewards/vested_rewards', {
      reduce: false,
      keys: [wallet],
    })
    return rewardsData
  } else {
    throw new TypeError(
      'You cannot get vested rewards with an invalid address'
    )
  }
}
