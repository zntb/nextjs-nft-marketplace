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
  darkTheme,
  lightTheme,
  useActiveAccount,
  useActiveWallet,
  useDisconnect,
} from 'thirdweb/react';
import type { Wallet } from 'thirdweb/wallets';
import ThemeToggleButton from './ThemeToggleButton';
import { useTheme } from 'next-themes';
export function Navbar() {
  const account = useActiveAccount();
  const wallet = useActiveWallet();

  return (
    <header className='w-full h-20 p-6'>
      <div className='flex justify-between gap-3'>
        <nav className='hidden md:flex items-center justify-center w-full max-w-xs gap-1'>
          <Link
            className='text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500'
            href='/'
          >
            ZNTB-MART
          </Link>
        </nav>
        <div className='flex gap-1'>
          <div className='flex items-center gap-2'>
            <ThemeToggleButton />
          </div>
          <DropdownMenu>
            {account && wallet ? (
              <ProfileButton address={account.address} wallet={wallet} />
            ) : (
              <ConnectButton
                connectButton={{
                  label: 'Sign In',
                  style: {
                    minWidth: '165px',
                    height: '50px',
                    marginRight: '1rem',
                    backgroundColor: '#2c323f',
                    color: '#f9fafb',
                  },
                }}
                client={client}
              />
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
  const { theme, systemTheme } = useTheme();

  const resolvedTheme = theme === 'system' ? systemTheme : theme;
  const isDark = resolvedTheme === 'dark';

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild className='w-28 ml-2 mr-16'>
        <Button
          variant='ghost'
          className='w-full h-full flex items-center justify-center px-5 focus-visible:ring-0 focus-visible:ring-offset-0'
        >
          <FiUser size={30} className='mr-2' />
          <Avatar>
            <AvatarImage
              src={blo(address as `0x${string}`)}
              height={30}
              width={30}
            />
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className='space-y-2'>
        <DropdownMenuItem>
          <ConnectButton
            theme={isDark ? darkTheme() : lightTheme()}
            client={client}
          />
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
