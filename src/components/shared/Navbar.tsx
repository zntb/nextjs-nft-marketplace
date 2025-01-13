'use client';

import { client } from '@/consts/client';
import NextLink from 'next/link';
import { Button } from '../ui/button';
import { MenuRoot, MenuItem, MenuContent, MenuTrigger } from '../ui/menu';
import { Box, Flex, Heading, Image } from '@chakra-ui/react';
import { blo } from 'blo';
import { FiUser } from 'react-icons/fi';
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from 'thirdweb/react';
import type { Wallet } from 'thirdweb/wallets';

export function Navbar() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();
  return (
    <Box py='30px' px={{ base: '20px', lg: '50px' }}>
      <Flex direction='row' justifyContent='space-between'>
        <Box my='auto'>
          <NextLink href='/' style={{ textDecoration: 'none' }}>
            <Heading>
              {/* Replace this with your own branding */}
              THIRDMART
            </Heading>
          </NextLink>
        </Box>
        <Box>
          {account && wallet ? (
            <ProfileButton address={account.address} wallet={wallet} />
          ) : (
            <ConnectButton client={client} />
          )}
        </Box>
      </Flex>
    </Box>
  );
}

function ProfileButton({
  address,
  wallet,
}: {
  address: string;
  wallet: Wallet;
}) {
  const { disconnect } = useDisconnect();
  return (
    <MenuRoot>
      <MenuTrigger as={Button} height='56px'>
        <Flex direction='row' gap='5'>
          <Box my='auto'>
            <FiUser size={30} />
          </Box>
          <Image
            src={blo(address as `0x${string}`)}
            alt='avatar'
            height='40px'
            rounded='8px'
          />
        </Flex>
      </MenuTrigger>

      <MenuContent
        bg='gray.800'
        borderColor='gray.700'
        boxShadow='lg'
        borderRadius='md'
        minW='200px'
      >
        <MenuItem
          value='profile'
          _hover={{ bg: 'gray.700' }}
          color='white'
          p={3}
        >
          <NextLink
            href='/profile'
            style={{ textDecoration: 'none', width: '100%' }}
          >
            Profile
          </NextLink>
        </MenuItem>
        <MenuItem
          value='logout'
          onClick={() => {
            if (wallet) disconnect(wallet);
          }}
          _hover={{ bg: 'gray.700' }}
          color='white'
          p={3}
        >
          Logout
        </MenuItem>
      </MenuContent>
    </MenuRoot>
  );
}
