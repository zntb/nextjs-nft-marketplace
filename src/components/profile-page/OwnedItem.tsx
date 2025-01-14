import { client } from '@/consts/client';

import type { NFT, ThirdwebContract } from 'thirdweb';
import { MediaRenderer } from 'thirdweb/react';
import Link from 'next/link';

export function OwnedItem(props: {
  nft: NFT;
  nftCollection: ThirdwebContract;
}) {
  const { nft, nftCollection } = props;
  return (
    <>
      <Link
        href={`/collection/${nftCollection.chain.id}/${
          nftCollection.address
        }/token/${nft.id.toString()}`}
        className='block w-[250px] rounded-xl hover:no-underline'
      >
        <div className='flex flex-col'>
          <MediaRenderer client={client} src={nft.metadata.image} />
          <p className='text-sm'>{nft.metadata?.name ?? 'Unknown item'}</p>
        </div>
      </Link>
    </>
  );
}
