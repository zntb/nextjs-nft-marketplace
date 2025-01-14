import { useMarketplaceContext } from '@/hooks/useMarketplaceContext';
import { sendAndConfirmTransaction } from 'thirdweb';
import { cancelListing } from 'thirdweb/extensions/marketplace';
import {
  useActiveWalletChain,
  useSwitchActiveWalletChain,
} from 'thirdweb/react';
import type { Account } from 'thirdweb/wallets';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';

type Props = {
  account: Account;
  listingId: bigint;
};

export default function CancelListingButton(props: Props) {
  const { marketplaceContract, refetchAllListings, nftContract } =
    useMarketplaceContext();
  const switchChain = useSwitchActiveWalletChain();
  const activeChain = useActiveWalletChain();
  const { account, listingId } = props;
  const { toast } = useToast();

  return (
    <Button
      variant='destructive'
      className='w-full'
      onClick={async () => {
        if (activeChain?.id !== nftContract.chain.id) {
          await switchChain(nftContract.chain);
        }
        const transaction = cancelListing({
          contract: marketplaceContract,
          listingId,
        });
        await sendAndConfirmTransaction({
          transaction,
          account,
        });
        toast({
          title: 'Listing cancelled successfully',
          variant: 'default',
        });
        refetchAllListings();
      }}
    >
      Cancel
    </Button>
  );
}
