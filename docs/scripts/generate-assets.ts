import { join } from 'path'
import { writeJSONSync } from 'fs-extra'
import * as dotenv from 'dotenv'
import axios from 'axios'

dotenv.config({ path: join(__dirname, '../.env') })

const BASE_URL = 'https://api.github.com'
const RELEASES_URL = '/repos/massCodeIO/massCode/releases'
const DIST = join(__dirname, '../.vitepress/_data')

const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    Authorization: `token ${process.env.VITE_GIT_TOKEN}`
  }
})

const fetch = async () => {
  const { data } = await api.get(RELEASES_URL)

  const releases = data.filter(i => !i.prerelease)
  const tagName = releases[0].tag_name
  const version = tagName.substring(1)
  const macAsset = `massCode-${version}.dmg`
  const macM1Asset = `massCode-${version}-arm64.dmg`
  const winAsset = `massCode.Setup.${version}.exe`
  const linuxAsset = `massCode_${version}_amd64.snap`
  const downloadUrl = `https://github.com/massCodeIO/massCode/releases/download/${tagName}`

  const assets = {
    version,
    mac: `${downloadUrl}/${macAsset}`,
    macM1: `${downloadUrl}/${macM1Asset}`,
    win: `${downloadUrl}/${winAsset}`,
    linux: `${downloadUrl}/${linuxAsset}`
  }

  writeJSONSync(join(DIST, 'assets.json'), assets)
}

fetch()
