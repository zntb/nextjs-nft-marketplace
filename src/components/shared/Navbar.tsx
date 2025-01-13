'use client';

import { client } from '@/consts/client';
import Link from 'next/link';
import { Button } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarImage } from '@/components/ui/avatar';
import { blo } from 'blo';
import { FiUser } from 'react-icons/fi';
import {
  ConnectButton,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from 'thirdweb/react';
import type { Wallet } from 'thirdweb/wallets';
import ThemeToggleButton from './ThemeToggleButton';
export function Navbar() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();

  return (
    <header className='w-full border-b'>
      <div className='flex justify-between gap-3'>
        <nav className='hidden md:flex items-center justify-center w-full max-w-xs gap-1'>
          <Link href='/'>ZNTBMART</Link>
        </nav>
        <div className='flex gap-1'>
          <div className='flex items-center gap-2'>
            <ThemeToggleButton />
          </div>
          <DropdownMenu>
            {account && wallet ? (
              <ProfileButton address={account.address} wallet={wallet} />
            ) : (
              <ConnectButton client={client} />
            )}
          </DropdownMenu>
        </div>
      </div>
    </header>
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
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='w-28 mr-16'>
        <Button
          variant='ghost'
          className='w-full h-full focus-visible:ring-0 focus-visible:ring-offset-0'
        >
          <FiUser size={30} />
          <Avatar>
            <AvatarImage
              src={blo(address as `0x${string}`)}
              height={30}
              width={30}
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='p-3'>
        <DropdownMenuItem>
          <ConnectButton client={client} />
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Link href={`/profile/${address}`}>Profile</Link>
        </DropdownMenuItem>
        <DropdownMenuItem>
          <span
            onClick={() => {
              if (wallet) disconnect(wallet);
            }}
          >
            Logout
          </span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
