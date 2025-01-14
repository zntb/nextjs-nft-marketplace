/* eslint-disable @next/next/no-img-element */
import { NATIVE_TOKEN_ICON_MAP, Token } from '@/consts/supported_tokens';
import { useMarketplaceContext } from '@/hooks/useMarketplaceContext';
import { useRef, useState } from 'react';
import { NATIVE_TOKEN_ADDRESS, sendAndConfirmTransaction } from 'thirdweb';
import {
  isApprovedForAll as isApprovedForAll1155,
  setApprovalForAll as setApprovalForAll1155,
} from 'thirdweb/extensions/erc1155';
import {
  isApprovedForAll as isApprovedForAll721,
  setApprovalForAll as setApprovalForAll721,
} from 'thirdweb/extensions/erc721';
import { createListing } from 'thirdweb/extensions/marketplace';
import {
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from 'thirdweb/react';
import type { Account } from 'thirdweb/wallets';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Check, ChevronDown } from 'lucide-react';

type Props = {
  tokenId: bigint;
  account: Account;
};

export function CreateListing(props: Props) {
  const priceRef = useRef<HTMLInputElement>(null);
  const qtyRef = useRef<HTMLInputElement>(null);
  const { tokenId, account } = props;
  const switchChain = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const [currency, setCurrency] = useState<Token>();
  const { toast } = useToast();

  const {
    nftContract,
    marketplaceContract,
    refetchAllListings,
    type,
    supportedTokens,
  } = useMarketplaceContext();
  const chain = marketplaceContract.chain;

  const nativeToken: Token = {
    tokenAddress: NATIVE_TOKEN_ADDRESS,
    symbol: chain.nativeCurrency?.symbol || 'NATIVE TOKEN',
    icon: NATIVE_TOKEN_ICON_MAP[chain.id] || '',
  };

  const options: Token[] = [nativeToken].concat(supportedTokens);

  return (
    <div className='flex flex-col w-full max-w-[430px] gap-4 mt-4'>
      {type === 'ERC1155' ? (
        <div className='flex flex-row flex-wrap justify-between gap-4'>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>Price</label>
            <Input type='number' ref={priceRef} placeholder='Enter a price' />
          </div>
          <div className='flex flex-col gap-2'>
            <label className='text-sm font-medium'>Quantity</label>
            <Input
              type='number'
              ref={qtyRef}
              defaultValue={1}
              placeholder='Quantity to sell'
            />
          </div>
        </div>
      ) : (
        <div className='flex flex-col gap-2'>
          <label className='text-sm font-medium'>Price</label>
          <Input
            type='number'
            ref={priceRef}
            placeholder='Enter a price for your listing'
          />
        </div>
      )}

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant='outline' className='w-full justify-between'>
            {currency ? (
              <div className='flex items-center'>
                <img
                  src={currency.icon}
                  alt={currency.symbol}
                  className='w-8 h-8 rounded-full mr-3'
                />
                <span>{currency.symbol}</span>
              </div>
            ) : (
              'Select currency'
            )}
            <ChevronDown className='ml-2 h-4 w-4' />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className='w-full'>
          {options.map(token => (
            <DropdownMenuItem
              key={token.tokenAddress}
              onClick={() => setCurrency(token)}
              className='flex items-center justify-between'
            >
              <div className='flex items-center'>
                <img
                  src={token.icon}
                  alt={token.symbol}
                  className='w-8 h-8 rounded-full mr-3'
                />
                <span>{token.symbol}</span>
              </div>
              {token.tokenAddress.toLowerCase() ===
                currency?.tokenAddress.toLowerCase() && (
                <Check className='h-4 w-4' />
              )}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        disabled={!currency}
        onClick={async () => {
          const value = priceRef.current?.value;
          if (!value) {
            return toast({
              title: 'Please enter a price for this listing',
              variant: 'destructive',
            });
          }
          if (!currency) {
            return toast({
              title: `Please select a currency for the listing`,
              variant: 'destructive',
            });
          }
          if (activeChain?.id !== nftContract.chain.id) {
            await switchChain(nftContract.chain);
          }
          const _qty = BigInt(qtyRef.current?.value ?? 1);
          if (type === 'ERC1155') {
            if (!_qty || _qty <= 0n) {
              return toast({
                title: 'Error',
                description: 'Invalid quantity',
                variant: 'destructive',
              });
            }
          }

          // Check for approval
          const checkApprove =
            type === 'ERC1155' ? isApprovedForAll1155 : isApprovedForAll721;

          const isApproved = await checkApprove({
            contract: nftContract,
            owner: account.address,
            operator: marketplaceContract.address,
          });

          if (!isApproved) {
            const setApproval =
              type === 'ERC1155' ? setApprovalForAll1155 : setApprovalForAll721;

            const approveTx = setApproval({
              contract: nftContract,
              operator: marketplaceContract.address,
              approved: true,
            });

            await sendAndConfirmTransaction({
              transaction: approveTx,
              account,
            });
          }

          const transaction = createListing({
            contract: marketplaceContract,
            assetContractAddress: nftContract.address,
            tokenId,
            quantity: type === 'ERC721' ? 1n : _qty,
            currencyContractAddress: currency?.tokenAddress,
            pricePerToken: value,
          });

          await sendAndConfirmTransaction({
            transaction,
            account,
          });
          refetchAllListings();
        }}
      >
        List
      </Button>
    </div>
  );
}
