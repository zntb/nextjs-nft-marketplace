import { NFT_CONTRACTS, type NftContract } from '@/consts/nft_contracts';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import type { Dispatch, SetStateAction } from 'react';
// import { ChevronDown } from 'lucide-react';

type Props = {
  selectedCollection: NftContract;
  setSelectedCollection: Dispatch<SetStateAction<NftContract>>;
};

export function ProfileMenu(props: Props) {
  const { selectedCollection, setSelectedCollection } = props;
  return (
    <div className='w-72 left-4 top-48'>
      <Accordion
        type='single'
        collapsible
        className='w-full bg-[#1a1d24] rounded-lg'
      >
        <AccordionItem value='collections' className='border-none'>
          <AccordionTrigger className='flex justify-between px-4 py-2 hover:no-underline'>
            <span className='flex-1 text-left font-medium'>Collections</span>
            {/* <ChevronDown className='h-4 w-4 shrink-0 transition-transform duration-200' /> */}
          </AccordionTrigger>
          <AccordionContent className='space-y-1 px-2 pb-2'>
            {NFT_CONTRACTS.map(item => (
              <Button
                key={item.address}
                variant='ghost'
                className={`w-full h-14 justify-start hover:bg-[#2a2d34] ${
                  item.address === selectedCollection.address
                    ? 'opacity-100'
                    : 'opacity-40'
                }`}
                onClick={() => setSelectedCollection(item)}
              >
                <div className='flex items-center gap-3'>
                  <Image
                    src={item.thumbnailUrl ?? ''}
                    alt={item.title ?? 'Collection'}
                    width={40}
                    height={40}
                    className='rounded-lg'
                  />
                  <span className='text-sm'>
                    {item.title ?? 'Unknown collection'}
                  </span>
                </div>
              </Button>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}
