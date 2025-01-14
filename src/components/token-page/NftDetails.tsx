import { useMarketplaceContext } from '@/hooks/useMarketplaceContext';
import type { NFT } from 'thirdweb';
import { shortenAddress } from 'thirdweb/utils';
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { ChevronDown } from 'lucide-react';
import { FaExternalLinkAlt } from 'react-icons/fa';

type Props = {
  nft: NFT;
};

export function NftDetails(props: Props) {
  const { type, nftContract } = useMarketplaceContext();
  const { nft } = props;
  const contractUrl = `${
    nftContract.chain.blockExplorers
      ? nftContract.chain.blockExplorers[0]?.url
      : ''
  }/address/${nftContract.address}`;
  const tokenUrl = `${
    nftContract.chain.blockExplorers
      ? nftContract.chain.blockExplorers[0]?.url
      : ''
  }/nft/${nftContract.address}/${nft.id.toString()}`;

  return (
    <AccordionItem value='details'>
      <AccordionTrigger className='flex w-full justify-between py-4'>
        <span className='text-left'>Details</span>
        <ChevronDown className='h-4 w-4 shrink-0 transition-transform duration-200' />
      </AccordionTrigger>
      <AccordionContent className='space-y-4'>
        <div className='flex items-center justify-between'>
          <span className='text-sm text-muted-foreground'>
            Contract address
          </span>
          <a
            href={contractUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 text-sm text-primary hover:underline'
          >
            {shortenAddress(nftContract.address)}
            <FaExternalLinkAlt className='h-3 w-3' />
          </a>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-sm text-muted-foreground'>Token ID</span>
          <a
            href={tokenUrl}
            target='_blank'
            rel='noopener noreferrer'
            className='flex items-center gap-2 text-sm text-primary hover:underline'
          >
            {nft?.id.toString()}
            <FaExternalLinkAlt className='h-3 w-3' />
          </a>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-sm text-muted-foreground'>Token Standard</span>
          <span className='text-sm'>{type}</span>
        </div>

        <div className='flex items-center justify-between'>
          <span className='text-sm text-muted-foreground'>Chain</span>
          <span className='text-sm'>
            {nftContract.chain.name ?? 'Unnamed chain'}
          </span>
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
