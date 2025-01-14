import { client } from '@/consts/client';
import { useMarketplaceContext } from '@/hooks/useMarketplaceContext';
import { MediaRenderer } from 'thirdweb/react';
import Link from 'next/link';

export function ListingGrid() {
  const { listingsInSelectedCollection, nftContract } = useMarketplaceContext();
  const len = listingsInSelectedCollection.length;

  if (!listingsInSelectedCollection || !len) return null;

  return (
    <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 p-4 mx-auto mt-5'>
      {listingsInSelectedCollection.map(item => (
        <Link
          key={item.id}
          href={`/collection/${nftContract.chain.id}/${
            nftContract.address
          }/token/${item.asset.id.toString()}`}
          className='rounded-xl hover:no-underline'
        >
          <div className='flex flex-col'>
            <MediaRenderer client={client} src={item.asset.metadata.image} />
            <p className='text-sm'>
              {item.asset?.metadata?.name ?? 'Unknown item'}
            </p>
            <p className='text-sm text-muted-foreground'>Price</p>
            <p className='text-sm font-medium'>
              {item.currencyValuePerToken.displayValue}{' '}
              {item.currencyValuePerToken.symbol}
            </p>
          </div>
        </Link>
      ))}
    </div>
  );
}
