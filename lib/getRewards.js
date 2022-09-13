import axios from 'axios'
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

const getSecondsInEpoch = () => {
  return 604800
}

export const getEpochStart = (epoch) => {
  const start = parseInt(process.env.NEXT_PUBLIC_EPOCH_LAUNCH_UNIX_TIME)
  return start + getSecondsInEpoch() * (epoch - 1)
}

export const getEpochEnd = (epoch) => {
  return getEpochStart(epoch) + getSecondsInEpoch()
}

export const CheckOptinStatus = async (wallet) => {
  const baseUrl = '/optin'
  const res = await axios({
    method: 'get',
    url: `${baseUrl}/${wallet}`,
    timeout: 3000,
  })
  return res
}

export const getAccruingStatus = async (wallet) => {
  const baseUrl = '/is_accruing'
  const res = await axios({
    method: 'get',
    url: `${baseUrl}/${wallet}`,
    timeout: 3000,
  })
  return res
}
