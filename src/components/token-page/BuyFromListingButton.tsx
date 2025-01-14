import { client } from '@/consts/client';
import { useMarketplaceContext } from '@/hooks/useMarketplaceContext';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import {
  type Hex,
  NATIVE_TOKEN_ADDRESS,
  getContract,
  sendAndConfirmTransaction,
  sendTransaction,
  toTokens,
  waitForReceipt,
} from 'thirdweb';
import { allowance, approve, decimals } from 'thirdweb/extensions/erc20';
import {
  type DirectListing,
  buyFromListing,
} from 'thirdweb/extensions/marketplace';
import {
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from 'thirdweb/react';
import type { Account } from 'thirdweb/wallets';

type Props = {
  listing: DirectListing;
  account: Account;
};

export default function BuyFromListingButton(props: Props) {
  const { account, listing } = props;
  const { marketplaceContract, refetchAllListings, nftContract } =
    useMarketplaceContext();
  const switchChain = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const { toast } = useToast();
  return (
    <Button
      variant='default'
      className='w-full'
      onClick={async () => {
        if (activeChain?.id !== nftContract.chain.id) {
          await switchChain(nftContract.chain);
        }
        try {
          if (
            listing.currencyContractAddress.toLowerCase() !==
            NATIVE_TOKEN_ADDRESS.toLowerCase()
          ) {
            const customTokenContract = getContract({
              address: listing.currencyContractAddress as Hex,
              client,
              chain: nftContract.chain,
            });
            const result = await allowance({
              contract: customTokenContract,
              owner: account.address,
              spender: marketplaceContract.address as Hex,
            });

            if (result < listing?.pricePerToken) {
              const _decimals = await decimals({
                contract: customTokenContract,
              });
              const transaction = approve({
                contract: customTokenContract,
                spender: marketplaceContract.address as Hex,
                amount: toTokens(listing?.pricePerToken, _decimals),
              });
              await sendAndConfirmTransaction({ transaction, account });
            }
          }

          const transaction = buyFromListing({
            contract: marketplaceContract,
            listingId: listing.id,
            quantity: listing.quantity,
            recipient: account.address,
          });
          console.log(transaction);
          const receipt = await sendTransaction({
            transaction,
            account,
          });
          await waitForReceipt({
            transactionHash: receipt.transactionHash,
            client,
            chain: nftContract.chain,
          });
          toast({
            title: 'Purchase completed!',
            description: 'The asset(s) should arrive in your account shortly',
            variant: 'default',
          });
          refetchAllListings();
        } catch (err) {
          console.error(err);
          if ((err as Error).message.startsWith('insufficient funds for gas')) {
            toast({
              title: 'Insufficient funds',
              description: `Make sure you have enough gas for the transaction + ${listing.currencyValuePerToken.displayValue} ${listing.currencyValuePerToken.symbol}`,
              variant: 'destructive',
            });
          }
        }
      }}
    >
      Buy
    </Button>
  );
}
