'use client';

import { defaultSystem } from '@chakra-ui/react';
import { ChakraProvider } from '@chakra-ui/react';
import type { ReactNode } from 'react';
import { ThirdwebProvider } from 'thirdweb/react';

export function Providers({ children }: { children: ReactNode }) {
  return (
    <ChakraProvider value={defaultSystem}>
      <ThirdwebProvider>{children}</ThirdwebProvider>
    </ChakraProvider>
  );
}
