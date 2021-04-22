import React from 'react'
import { faDiscord, faGithub, faTwitter } from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Text, Flex, Box, Button, Wrap, WrapItem, Link as CLink } from './ui'
import { URLs } from '../lib/constants'
import { useContract } from '../hooks/contracts'
import { EtherscanIcon } from '../assets/icons'

function LinkItem({ href, icon, label }) {
  return (
    <WrapItem my={0}>
      <CLink
        href={href}
        isExternal
      >
        <Button
          leftIcon={icon}
          variant="link"
          size="sm"
          textTransform="initial"
          color="black"
        >
          {label}
        </Button>
      </CLink>
    </WrapItem>
  )
}

export function Footer() {
  const { etherscanURL: contractEtherscanURL } = useContract();

  return (
      <Flex
        as="footer"
        align="center"
        justify="space-between"
        px={8}
        py={4}
        wrap="wrap"
      >
        <Box>
          <Text
            textStyle="h5"
            my={2}
          >
            AbricotStudio - 2021
          </Text>
        </Box>

        <Wrap justify="center" spacing={4}>
          <LinkItem
            href={URLs.twitter}
            icon={<FontAwesomeIcon icon={faTwitter} size="1x" color="#20a1f1" />}
            label="Twitter"
          />
          <LinkItem
            href={URLs.discord}
            icon={<FontAwesomeIcon icon={faDiscord} size="1x" color="#7388da" />}
            label="Discord"
          />
          <LinkItem
            href={URLs.github}
            icon={<FontAwesomeIcon icon={faGithub} size="1x" color="black" />}
            label="Github"
          />
          <LinkItem
            href={contractEtherscanURL}
            icon={<EtherscanIcon />}
            label="Etherscan"
          />
        </Wrap>
      </Flex>
  )
}
