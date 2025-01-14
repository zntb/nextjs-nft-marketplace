import { client } from '@/consts/client';
import { useMarketplaceContext } from '@/hooks/useMarketplaceContext';
import { MediaRenderer } from 'thirdweb/react';
import Link from 'next/link';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronDown } from 'lucide-react';

export default function RelatedListings({
  excludedListingId,
}: {
  excludedListingId: bigint;
}) {
  const { nftContract, allValidListings } = useMarketplaceContext();
  const listings = allValidListings?.filter(
    o =>
      o.id !== excludedListingId &&
      o.assetContractAddress.toLowerCase() ===
        nftContract.address.toLowerCase(),
  );
  if (!listings || !listings.length) return <></>;
  return (
    <AccordionItem value='related'>
      <AccordionTrigger className='flex w-full justify-between py-4'>
        <span className='text-left'>More from this collection</span>
        <ChevronDown className='h-4 w-4 shrink-0 transition-transform duration-200' />
      </AccordionTrigger>
      <AccordionContent>
        <div className='flex w-full gap-4 overflow-x-auto p-4 whitespace-nowrap'>
          {listings?.map(item => (
            <Link
              key={item.id.toString()}
              href={`/collection/${nftContract.chain.id}/${
                nftContract.address
              }/token/${item.asset.id.toString()}`}
              className='min-w-[250px] rounded-xl hover:no-underline'
            >
              <div className='flex flex-col'>
                <MediaRenderer
                  client={client}
                  src={item.asset.metadata.image}
                />
                <p className='text-sm'>
                  {item.asset.metadata?.name ?? 'Unknown item'}
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
      </AccordionContent>
    </AccordionItem>
  );
}
