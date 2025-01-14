import { blo } from 'blo';
import { shortenAddress } from 'thirdweb/utils';
import { ProfileMenu } from './Menu';
import { useState } from 'react';
import { NFT_CONTRACTS, type NftContract } from '@/consts/nft_contracts';
import {
  MediaRenderer,
  useActiveAccount,
  useReadContract,
} from 'thirdweb/react';
import { getContract, toEther } from 'thirdweb';
import { client } from '@/consts/client';
import { getOwnedERC721s } from '@/extensions/getOwnedERC721s';
import { OwnedItem } from './OwnedItem';
import { getAllValidListings } from 'thirdweb/extensions/marketplace';
import { MARKETPLACE_CONTRACTS } from '@/consts/marketplace_contract';
import Link from 'next/link';
import { getOwnedERC1155s } from '@/extensions/getOwnedERC1155s';
import { ExternalLink } from 'lucide-react';
import { useGetENSAvatar } from '@/hooks/useGetENSAvatar';
import { useGetENSName } from '@/hooks/useGetENSName';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Image from 'next/image';

type Props = {
  address: string;
};

export function ProfileSection(props: Props) {
  const { address } = props;
  const account = useActiveAccount();
  const isYou = address.toLowerCase() === account?.address.toLowerCase();
  const { data: ensName } = useGetENSName({ address });
  const { data: ensAvatar } = useGetENSAvatar({ ensName });
  const [tabIndex, setTabIndex] = useState<number>(0);
  const [selectedCollection, setSelectedCollection] = useState<NftContract>(
    NFT_CONTRACTS[0],
  );
  const contract = getContract({
    address: selectedCollection.address,
    chain: selectedCollection.chain,
    client,
  });

  const { data, isLoading: isLoadingOwnedNFTs } = useReadContract(
    selectedCollection.type === 'ERC1155' ? getOwnedERC1155s : getOwnedERC721s,
    {
      contract,
      owner: address,
      requestPerSec: 50,
      queryOptions: {
        enabled: !!address,
      },
    },
  );

  const chain = contract.chain;
  const marketplaceContractAddress = MARKETPLACE_CONTRACTS.find(
    o => o.chain.id === chain.id,
  )?.address;
  if (!marketplaceContractAddress) throw Error('No marketplace contract found');
  const marketplaceContract = getContract({
    address: marketplaceContractAddress,
    chain,
    client,
  });
  const { data: allValidListings } = useReadContract(getAllValidListings, {
    contract: marketplaceContract,
    queryOptions: { enabled: data && data.length > 0 },
  });
  const listings = allValidListings?.length
    ? allValidListings.filter(
        item =>
          item.assetContractAddress.toLowerCase() ===
            contract.address.toLowerCase() &&
          item.creatorAddress.toLowerCase() === address.toLowerCase(),
      )
    : [];

  return (
    <div className='px-5 lg:px-12'>
      <div className='flex flex-col gap-5 lg:flex-row md:flex-col sm:flex-col'>
        <Image
          src={ensAvatar ?? blo(address as `0x${string}`)}
          alt='Profile'
          width={150}
          height={150}
          className='w-[100px] lg:w-[150px] rounded-lg'
        />
        <div className='my-auto'>
          <h1 className='text-2xl font-bold'>{ensName ?? 'Unnamed'}</h1>
          <p className='text-gray-500'>{shortenAddress(address)}</p>
        </div>
      </div>

      <div className='mt-5 flex flex-col gap-10 lg:flex-row'>
        <ProfileMenu
          selectedCollection={selectedCollection}
          setSelectedCollection={setSelectedCollection}
        />
        {isLoadingOwnedNFTs ? (
          <div>
            <p>Loading...</p>
          </div>
        ) : (
          <div>
            <div className='flex flex-row justify-between px-3'>
              <Tabs
                defaultValue='owned'
                onValueChange={v => setTabIndex(v === 'owned' ? 0 : 1)}
              >
                <TabsList>
                  <TabsTrigger value='owned'>
                    Owned ({data?.length})
                  </TabsTrigger>
                  <TabsTrigger value='listings'>
                    Listings ({listings.length || 0})
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              <Link
                href={`/collection/${selectedCollection.chain.id}/${selectedCollection.address}`}
                className='text-gray-500 hover:text-gray-700'
              >
                View collection{' '}
                <ExternalLink className='mx-0.5 inline h-4 w-4' />
              </Link>
            </div>
            <div className='grid grid-cols-1 gap-4 p-4 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-4'>
              {tabIndex === 0 ? (
                <>
                  {data && data.length > 0 ? (
                    <>
                      {data?.map(item => (
                        <OwnedItem
                          key={item.id.toString()}
                          nftCollection={contract}
                          nft={item}
                        />
                      ))}
                    </>
                  ) : (
                    <div>
                      <p>
                        {isYou
                          ? 'You'
                          : ensName
                          ? ensName
                          : shortenAddress(address)}{' '}
                        {isYou ? 'do' : 'does'} not own any NFT in this
                        collection
                      </p>
                    </div>
                  )}
                </>
              ) : (
                <>
                  {listings && listings.length > 0 ? (
                    <>
                      {listings?.map(item => (
                        <Link
                          key={item.id}
                          href={`/collection/${contract.chain.id}/${
                            contract.address
                          }/token/${item.asset.id.toString()}`}
                          className='block w-[250px] rounded-xl hover:no-underline'
                        >
                          <div className='flex flex-col'>
                            <MediaRenderer
                              client={client}
                              src={item.asset.metadata.image}
                            />
                            <p className='mt-3'>
                              {item.asset?.metadata?.name ?? 'Unknown item'}
                            </p>
                            <p>Price</p>
                            <p>
                              {toEther(item.pricePerToken)}{' '}
                              {item.currencyValuePerToken.symbol}
                            </p>
                          </div>
                        </Link>
                      ))}
                    </>
                  ) : (
                    <div>You do not have any listing with this collection</div>
                  )}
                </>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
