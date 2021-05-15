import { getLegacy3BoxProfileAsBasicProfile } from '@ceramicstudio/idx'
import { BasicProfile } from '@ceramicstudio/idx-constants'
import { useEthers } from '@usedapp/core'
import { useEffect, useState } from 'react'

interface BoxProfile extends BasicProfile {
  imageUrl?: string
}

const transformImageUrl = (src) =>
  src && src.replace('ipfs://', 'https://cloudflare-ipfs.com/ipfs/')

export const useBoxProfile = (): BoxProfile | null => {
  const { account } = useEthers()
  const [boxProfile, setBoxProfile] = useState<BoxProfile | null>(null)

  useEffect(() => {
    setBoxProfile(null)
    if (account) {
      getLegacy3BoxProfileAsBasicProfile(account).then((res) => {
        if (!res) return

        setBoxProfile({
          ...res,
          imageUrl: transformImageUrl(res.image?.original?.src),
        })
      })
    }
  }, [account])

  return boxProfile
}
