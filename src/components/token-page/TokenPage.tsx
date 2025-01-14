import { client } from '@/consts/client';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { balanceOf, getNFT as getERC1155 } from 'thirdweb/extensions/erc1155';
import { getNFT as getERC721 } from 'thirdweb/extensions/erc721';
import {
  MediaRenderer,
  useActiveAccount,
  useReadContract,
} from 'thirdweb/react';
import { shortenAddress } from 'thirdweb/utils';
import { NftAttributes } from './NftAttributes';
import { CreateListing } from './CreateListing';
import { useMarketplaceContext } from '@/hooks/useMarketplaceContext';
import dynamic from 'next/dynamic';
import { NftDetails } from './NftDetails';
import RelatedListings from './RelatedListings';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import Link from 'next/link';

const CancelListingButton = dynamic(() => import('./CancelListingButton'), {
  ssr: false,
});
const BuyFromListingButton = dynamic(() => import('./BuyFromListingButton'), {
  ssr: false,
});

type Props = {
  tokenId: bigint;
};

export function Token(props: Props) {
  const {
    type,
    nftContract,

    contractMetadata,

    listingsInSelectedCollection,
  } = useMarketplaceContext();
  const { tokenId } = props;
  const account = useActiveAccount();

  const { data: nft } = useReadContract(
    type === 'ERC1155' ? getERC1155 : getERC721,
    {
      tokenId: BigInt(tokenId),
      contract: nftContract,
      includeOwner: true,
    },
  );

  const { data: ownedQuantity1155 } = useReadContract(balanceOf, {
    contract: nftContract,
    owner: account?.address ?? '',
    tokenId: tokenId,
    queryOptions: {
      enabled: !!account?.address && type === 'ERC1155',
    },
  });

  const listings = (listingsInSelectedCollection || []).filter(
    item =>
      item.assetContractAddress.toLowerCase() ===
        nftContract.address.toLowerCase() && item.asset.id === BigInt(tokenId),
  );

  // Remove unused variables

  const ownedByYou =
    nft?.owner?.toLowerCase() === account?.address.toLowerCase();

  return (
    <div className='flex flex-col'>
      <div className='mt-6 mx-auto'>
        <div className='flex lg:flex-row flex-col lg:justify-center justify-between lg:gap-20 gap-5'>
          <div className='flex flex-col lg:w-[45vw] w-[90vw] gap-5'>
            <MediaRenderer
              client={client}
              src={nft?.metadata.image}
              style={{ width: 'max-content', height: 'auto', aspectRatio: '1' }}
            />
            <Accordion
              type='multiple'
              defaultValue={['description', 'attributes', 'details']}
            >
              {nft?.metadata.description && (
                <AccordionItem value='description'>
                  <AccordionTrigger>Description</AccordionTrigger>
                  <AccordionContent>
                    <p>{nft.metadata.description}</p>
                  </AccordionContent>
                </AccordionItem>
              )}

              {nft?.metadata?.attributes &&
                Array.isArray(nft.metadata.attributes) &&
                nft.metadata.attributes.length > 0 && (
                  <NftAttributes attributes={nft.metadata.attributes} />
                )}

              {nft && <NftDetails nft={nft} />}
            </Accordion>
          </div>
          <div className='lg:w-[45vw] w-[90vw]'>
            <p className='text-sm'>Collection</p>
            <div className='flex flex-row gap-3'>
              <h2 className='text-2xl font-bold'>{contractMetadata?.name}</h2>
              <Link
                className='text-muted-foreground hover:text-foreground'
                href={`/collection/${nftContract.chain.id}/${nftContract.address}`}
              >
                <FaExternalLinkAlt size={20} />
              </Link>
            </div>
            <div className='my-4' />
            <p className='text-sm'># {nft?.id.toString()}</p>
            <h2 className='text-2xl font-bold'>{nft?.metadata.name}</h2>
            <div className='my-4' />
            {type === 'ERC1155' ? (
              <>
                {account && ownedQuantity1155 && (
                  <>
                    <p className='text-sm'>You own</p>
                    <h3 className='text-xl font-bold'>
                      {ownedQuantity1155.toString()}
                    </h3>
                  </>
                )}
              </>
            ) : (
              <>
                <p className='text-sm'>Current owner</p>
                <div className='flex flex-row'>
                  <h3 className='text-xl font-bold'>
                    {nft?.owner ? shortenAddress(nft.owner) : 'N/A'}{' '}
                  </h3>
                  {ownedByYou && (
                    <span className='text-muted-foreground'>(You)</span>
                  )}
                </div>
              </>
            )}
            {account &&
              nft &&
              (ownedByYou || (ownedQuantity1155 && ownedQuantity1155 > 0n)) && (
                <CreateListing tokenId={nft?.id} account={account} />
              )}
            <Accordion
              type='multiple'
              defaultValue={['listings', 'related']}
              className='mt-8'
            >
              <AccordionItem value='listings'>
                <AccordionTrigger>
                  Listings ({listings.length})
                </AccordionTrigger>
                <AccordionContent>
                  {listings.length > 0 ? (
                    <div className='rounded-md border'>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Price</TableHead>
                            {type === 'ERC1155' && <TableHead>Qty</TableHead>}
                            <TableHead>Expiration</TableHead>
                            <TableHead>From</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {listings.map(item => {
                            const listedByYou =
                              item.creatorAddress.toLowerCase() ===
                              account?.address.toLowerCase();
                            return (
                              <TableRow key={item.id.toString()}>
                                <TableCell>
                                  {item.currencyValuePerToken.displayValue}{' '}
                                  {item.currencyValuePerToken.symbol}
                                </TableCell>
                                {type === 'ERC1155' && (
                                  <TableCell>
                                    {item.quantity.toString()}
                                  </TableCell>
                                )}
                                <TableCell>
                                  {getExpiration(item.endTimeInSeconds)}
                                </TableCell>
                                <TableCell>
                                  {item.creatorAddress.toLowerCase() ===
                                  account?.address.toLowerCase()
                                    ? 'You'
                                    : shortenAddress(item.creatorAddress)}
                                </TableCell>
                                {account && (
                                  <TableCell>
                                    {!listedByYou ? (
                                      <BuyFromListingButton
                                        account={account}
                                        listing={item}
                                      />
                                    ) : (
                                      <CancelListingButton
                                        account={account}
                                        listingId={item.id}
                                      />
                                    )}
                                  </TableCell>
                                )}
                              </TableRow>
                            );
                          })}
                        </TableBody>
                      </Table>
                    </div>
                  ) : (
                    <p>This item is not listed for sale</p>
                  )}
                </AccordionContent>
              </AccordionItem>

              <RelatedListings excludedListingId={listings[0]?.id ?? -1n} />
            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}

function getExpiration(endTimeInSeconds: bigint) {
  // Get the current date and time
  const currentDate = new Date();

  // Convert seconds to milliseconds (bigint)
  const milliseconds: bigint = endTimeInSeconds * 1000n;

  // Calculate the future date by adding milliseconds to the current date
  const futureDate = new Date(currentDate.getTime() + Number(milliseconds));

  // Format the future date
  const options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    timeZoneName: 'short',
  };
  const formattedDate = futureDate.toLocaleDateString('en-US', options);
  return formattedDate;
}
