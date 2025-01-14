'use client';

import { ProfileSection } from '@/components/profile-page/Profile';
import { client } from '@/consts/client';

import { useEffect } from 'react';
import { useActiveAccount, useConnectModal } from 'thirdweb/react';

export default function ProfilePage() {
  const account = useActiveAccount();
  const { connect } = useConnectModal();
  useEffect(() => {
    if (!account) {
      connect({ client });
    }
  }, [account, connect]);
  if (!account)
    return (
      <div className='min-h-screen flex flex-col'>
        <div className='flex-1 flex items-center justify-center'>
          <h1 className='text-2xl font-bold'>Log in to continue</h1>
        </div>
      </div>
    );
  return <ProfileSection address={account.address} />;
}
