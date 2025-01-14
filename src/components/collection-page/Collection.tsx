import { MediaRenderer, useReadContract } from 'thirdweb/react';
import { getNFT as getNFT721 } from 'thirdweb/extensions/erc721';
import { getNFT as getNFT1155 } from 'thirdweb/extensions/erc1155';
import { client } from '@/consts/client';

import { useMarketplaceContext } from '@/hooks/useMarketplaceContext';
import { ListingGrid } from './ListingGrid';
import { AllNftsGrid } from './AllNftsGrid';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';

export function Collection() {
  const {
    type,
    nftContract,
    isLoading,
    contractMetadata,
    listingsInSelectedCollection,
    supplyInfo,
  } = useMarketplaceContext();

  // In case the collection doesn't have a thumbnail, we use the image of the first NFT
  const { data: firstNFT } = useReadContract(
    type === 'ERC1155' ? getNFT1155 : getNFT721,
    {
      contract: nftContract,
      tokenId: 0n,
      queryOptions: {
        enabled: !isLoading && !contractMetadata?.image,
      },
    },
  );

  const thumbnailImage: string =
    (contractMetadata?.image as string) || firstNFT?.metadata.image || '';

  return (
    <>
      <div className='mt-6'>
        <div className='flex flex-col items-center gap-4'>
          <MediaRenderer
            client={client}
            src={thumbnailImage}
            style={{
              borderRadius: '20px',
              width: '200px',
              height: '200px',
            }}
          />
          <h1 className='text-2xl font-bold'>
            {contractMetadata?.name || 'Unknown collection'}
          </h1>
          {typeof contractMetadata?.description === 'string' && (
            <p className='max-w-[300px] lg:max-w-[500px] text-center'>
              {contractMetadata.description}
            </p>
          )}

          <Tabs
            defaultValue='listings'
            className='mt-5'
            onValueChange={value => value}
          >
            <TabsList className='grid w-full grid-cols-2'>
              <TabsTrigger value='listings'>
                Listings ({listingsInSelectedCollection.length || 0})
              </TabsTrigger>
              <TabsTrigger value='all'>
                All items{' '}
                {supplyInfo
                  ? `(${(
                      supplyInfo.endTokenId -
                      supplyInfo.startTokenId +
                      1n
                    ).toString()})`
                  : ''}
              </TabsTrigger>
            </TabsList>
            <TabsContent value='listings'>
              <ListingGrid />
            </TabsContent>
            <TabsContent value='all'>
              <AllNftsGrid />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
