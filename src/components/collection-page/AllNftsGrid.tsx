'use client';

import { client } from '@/consts/client';
import { useMarketplaceContext } from '@/hooks/useMarketplaceContext';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { useState } from 'react';
import {
  MdKeyboardDoubleArrowLeft,
  MdKeyboardDoubleArrowRight,
} from 'react-icons/md';
import { RiArrowLeftSLine, RiArrowRightSLine } from 'react-icons/ri';
import { getNFTs as getNFTs1155 } from 'thirdweb/extensions/erc1155';
import { getNFTs as getNFTs721 } from 'thirdweb/extensions/erc721';
import { MediaRenderer, useReadContract } from 'thirdweb/react';

export function AllNftsGrid() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [itemsPerPage, setItemsPerPage] = useState<number>(20);
  const [currentPageIndex, setCurrentPageIndex] = useState<number>(0);
  const { nftContract, type, supplyInfo } = useMarketplaceContext();
  const startTokenId = supplyInfo?.startTokenId ?? 0n;
  const totalItems: bigint = supplyInfo
    ? supplyInfo.endTokenId - supplyInfo.startTokenId + 1n
    : 0n;
  const numberOfPages: number = Number(
    (totalItems + BigInt(itemsPerPage) - 1n) / BigInt(itemsPerPage),
  );
  const pages: { start: number; count: number }[] = [];

  for (let i = 0; i < numberOfPages; i++) {
    const currentStartTokenId = startTokenId + BigInt(i * itemsPerPage);
    const remainingItems = totalItems - BigInt(i * itemsPerPage);
    const count =
      remainingItems < BigInt(itemsPerPage)
        ? Number(remainingItems)
        : itemsPerPage;
    pages.push({ start: Number(currentStartTokenId), count: count });
  }
  const { data: allNFTs } = useReadContract(
    type === 'ERC1155' ? getNFTs1155 : getNFTs721,
    {
      contract: nftContract,
      start: pages[currentPageIndex].start,
      count: pages[currentPageIndex].count,
    },
  );

  console.log({ pages, currentPageIndex, length: pages.length });
  return (
    <>
      <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 xl:grid-cols-5 gap-4 p-4 mx-auto mt-5'>
        {allNFTs && allNFTs.length > 0 ? (
          allNFTs.map(item => (
            <Link
              key={item.id}
              href={`/collection/${nftContract.chain.id}/${
                nftContract.address
              }/token/${item.id.toString()}`}
              className='rounded-xl hover:no-underline'
            >
              <div className='flex flex-col'>
                <MediaRenderer client={client} src={item.metadata.image} />
                <p className='text-sm'>
                  {item.metadata?.name ?? 'Unknown item'}
                </p>
              </div>
            </Link>
          ))
        ) : (
          <div className='mx-auto'>Loading...</div>
        )}
      </div>
      <div className='mx-auto max-w-[90vw] lg:max-w-[700px] mt-5 px-2.5 py-1.5 overflow-x-auto'>
        <div className='flex flex-row justify-center gap-3'>
          <Button
            onClick={() => setCurrentPageIndex(0)}
            disabled={currentPageIndex === 0}
            variant='outline'
            size='icon'
          >
            <MdKeyboardDoubleArrowLeft className='h-4 w-4' />
          </Button>
          <Button
            disabled={currentPageIndex === 0}
            onClick={() => setCurrentPageIndex(currentPageIndex - 1)}
            variant='outline'
            size='icon'
          >
            <RiArrowLeftSLine className='h-4 w-4' />
          </Button>
          <p className='my-auto'>
            Page {currentPageIndex + 1} of {pages.length}
          </p>
          <Button
            disabled={currentPageIndex === pages.length - 1}
            onClick={() => setCurrentPageIndex(currentPageIndex + 1)}
            variant='outline'
            size='icon'
          >
            <RiArrowRightSLine className='h-4 w-4' />
          </Button>
          <Button
            onClick={() => setCurrentPageIndex(pages.length - 1)}
            disabled={currentPageIndex === pages.length - 1}
            variant='outline'
            size='icon'
          >
            <MdKeyboardDoubleArrowRight className='h-4 w-4' />
          </Button>
          {/* <Select
            w="80px"
            onChange={(e) => setItemsPerPage(Number(e.target.value))}
          >
            {[20, 40, 60].map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </Select> */}
        </div>
      </div>
    </>
  );
}
