'use client';

import ProfileSection from '@/components/profile-page/Profile';
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
      <div className='flex items-center justify-center h-screen'>
        <h1 className='text-2xl font-bold'>Log in to continue</h1>
        <div className='m-auto'>Log in to continue</div>
      </div>
    );
  return <ProfileSection />;
}
