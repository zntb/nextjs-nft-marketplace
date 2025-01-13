'use client';

import Image from 'next/image';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import { NFT_CONTRACTS } from '@/consts/nft_contracts';
import { Box } from 'lucide-react';

export default function Home() {
  return (
    <div className='flex items-center justify-center h-screen'>
      <div className='mt-24 m-auto'>
        <div className='flex flex-col gap-4'>
          {/* Delete this <Card /> in your own app */}
          <Card className='border-1 border-gray-200 max-w-90vw mx-auto'>
            <CardHeader>
              <h1 className='text-2xl font-bold'>Marketplace Template v2</h1>
            </CardHeader>

            <CardContent>
              {_latestUpdates.map(item => (
                <Box key={item.title}>
                  <h2 className='text-sm uppercase'>{item.title}</h2>
                  {item.bullet_points.map(pt => (
                    <p className='text-sm' key={pt}>
                      {pt}
                    </p>
                  ))}
                </Box>
              ))}
            </CardContent>
          </Card>
          <h2 className='text-2xl font-bold'>
            Trending collections Trending collections
          </h2>
          <div className='flex flex-row flex-wrap gap-5 justify-evenly'>
            {NFT_CONTRACTS.map(item => (
              <div key={item.address}>
                <Image
                  src={item.thumbnailUrl || ''}
                  alt={item.title || ''}
                  width={200}
                  height={200}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Delete this in your own app
const _latestUpdates: Array<{ title: string; bullet_points: string[] }> = [
  {
    title: 'Latest software',
    bullet_points: [
      'Shipped with the latest thirdweb SDK (v5) and Next.js 14 (App router)',
    ],
  },
  {
    title: 'Multi-chain',
    bullet_points: [
      'Seamlessly trade and browse items on multiple chains',
      "You'd have to deploy a thirdweb Marketplace V3 contract on each of the chains you want to support",
    ],
  },
  {
    title: 'Multiple collections supported',
    bullet_points: [
      'The new template now supports multiple collections, you can view your owned NFTs and your listings',
    ],
  },
  {
    title: 'Upcoming features',
    bullet_points: [
      'Select different currencies (ERC20) when creating listings',
      'UI for English Auctions',
    ],
  },
  {
    title: 'Contribute',
    bullet_points: [
      'We welcome all contributions from the community.',
      'Found a bug or have some suggestions? Create a GitHub issue!',
      'Repo: https://github.com/thirdweb-example/marketplace-template',
    ],
  },
];
