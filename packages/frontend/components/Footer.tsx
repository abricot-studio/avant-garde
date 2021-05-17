import {
  faDiscord,
  faGithub,
  faTwitter,
} from '@fortawesome/free-brands-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React  from 'react'
import { EtherscanIcon, MobileMenuIcon } from '../assets/icons'
import { useContract } from '../hooks/contracts'
import { URLs } from '../lib/constants'
import {
  Button,
  Flex,
  Link as CLink,
  Text,
  useBreakpointValue,
  Spacer,
  IconButton, Slide
} from './ui'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { getPageStuff, NavButtonIcon, pagePaths } from './header/Navigation'
import { useDisclosure } from '@chakra-ui/hooks'
import { useMountedState, useWindowScroll } from 'react-use'

function LinkItem({ href, icon, label, ...props }) {
  return (
    <Flex
      {...props}
      px={4}
    >
      <CLink href={href} isExternal lineHeight="100%">
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
    </Flex>
  )
}

export function Footer() {
  const { etherscanURL: contractEtherscanURL } = useContract()
  const mobile = useBreakpointValue({ base: true, lg: false })
  const router = useRouter()
  const { isOpen, onToggle } = useDisclosure()
  const isMounted = useMountedState()
  const { y } = useWindowScroll()

  return (
    <>
      {
        mobile && isMounted && y > 0 && (
          <Flex minHeight="4rem" />
        )
      }
      {
        mobile && (<MobileMenuIcon w={0} h={0}/>)
      }
      <Flex
        as="footer"
        justifyContent="center"
        alignItems="flex-end"
        marginTop="auto"
        grow={1}
        w="100%"
        position={mobile ? 'fixed' : 'relative'}
        bottom={0}
        zIndex={2}
      >
        {
          mobile && (
            <Slide
              direction="bottom"
              in={isOpen}
              style={{
                bottom: '3.31rem',
                display: isOpen ? 'block' : 'none'
              }}
            >
              <Flex
                color="white"
                direction="column"
                bg="white"
                pb={4}
              >
                <Flex
                  position="relative"
                  top={-5}
                  alignSelf="center"
                >
                  <Button
                    as={IconButton}
                    aria-label="Options"
                    borderRadius="full"
                    size="lg"
                    p={0}
                    icon={<MobileMenuIcon w={12} h={12}/>}
                    bgColor="transparent"
                    _hover={{}}
                    _active={{}}
                    _focus={{}}
                    onClick={onToggle}
                    style={{
                      display: isOpen ? 'inline' : 'none'
                    }}
                  />
                </Flex>
                {pagePaths.map(
                  (pagePath) =>
                    pagePath !== router.pathname && (
                      <Link passHref href={pagePath} key={pagePath}>
                        <Flex
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          pb={6}
                        >
                          <NavButtonIcon color={getPageStuff(pagePath)[1]} />
                          <Text
                            ml={2}
                            color="black"
                            fontWeight={400}
                          >
                            {getPageStuff(pagePath)[0]}
                          </Text>
                        </Flex>
                      </Link>
                    )
                )}
              </Flex>
            </Slide>
          )
        }
        <Flex
          grow={1}
          borderTop="1px solid #E5E5E5"
          bg={ mobile ? 'white' : 'transparent'}
          py={4}
          alignItems="center"
          zIndex={10}
        >
          <LinkItem
            href={URLs.twitter}
            icon={<FontAwesomeIcon icon={faTwitter} size="2x" color="#1FA1F1" />}
            label={mobile ? '' : 'Twitter'}
          />
          <LinkItem
            href={URLs.discord}
            icon={<FontAwesomeIcon icon={faDiscord} size="2x" color="#7388da" />}
            label={mobile ? '' : 'Discord'}
          />
          <Spacer />
          <Flex
            justifyContent="center"
          >
            <Text
              textStyle="h5"
              align="center"
            >
              AbricotStudio - 2021
            </Text>
          </Flex>
          <Spacer />

          <LinkItem
            href={URLs.github}
            icon={
              <FontAwesomeIcon
                icon={faGithub} size="2x"
                color="black"
              />
            }
            label={mobile ? '' : 'Github'}
          />
          <LinkItem
            href={contractEtherscanURL}
            icon={<EtherscanIcon w={7}  h={7} />}
            label={mobile ? '' : 'Etherscan'}
          />
        </Flex>
        {
          mobile && !isOpen && (
            <Flex
              position='absolute'
              align="center"
              top="-1.5rem"
            >
              <Button
                as={IconButton}
                aria-label="Options"
                borderRadius="full"
                size="lg"
                icon={<MobileMenuIcon w={12} h={12}/>}
                bgColor="transparent"
                _hover={{}}
                _active={{}}
                _focus={{}}
                onClick={onToggle}
                p={0}
                style={{
                  zIndex: 11,
                }}
              />
            </Flex>
          )
        }
      </Flex>
    </>
  )
}
