'use client';

import { client } from '@/consts/client';
import Image from 'next/image';
import Link from 'next/link';
import { Button } from '../ui/button';
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarTrigger,
} from '@/components/ui/menubar';
import { blo } from 'blo';
import { FiUser } from 'react-icons/fi';
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from 'thirdweb/react';
import type { Wallet } from 'thirdweb/wallets';
import { ThemeToggleButton } from './ThemeToggleButton';
export function Navbar() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();

  return (
    <Menubar>
      <MenubarMenu>
        <MenubarTrigger>
          <Link href='/' style={{ textDecoration: 'none' }}>
            ZNTBMART
          </Link>
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          <ThemeToggleButton />
        </MenubarTrigger>
      </MenubarMenu>
      <MenubarMenu>
        <MenubarTrigger>
          {account && wallet ? (
            <ProfileButton address={account.address} wallet={wallet} />
          ) : (
            <ConnectButton client={client} />
          )}
        </MenubarTrigger>
      </MenubarMenu>
    </Menubar>
  );
}

function ProfileButton({
  address,
  wallet,
}: {
  address: string;
  wallet: Wallet;
}) {
  // const { disconnect } = useDisconnect();
  return (
    <div>
      <p>{address}</p>
    </div>
  );
}
