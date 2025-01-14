import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '../ui/accordion';
import { Card } from '../ui/card';
import { ChevronDown } from 'lucide-react';

export function NftAttributes({
  attributes,
}: {
  attributes: Record<string, unknown>;
}) {
  /**
   * Assume the NFT attributes follow the conventional format
   */
  // @ts-expect-error TODO Fix later
  const items = attributes.filter(
    (item: Record<string, unknown>) => item.trait_type,
  );

  return (
    <AccordionItem value='traits'>
      <AccordionTrigger className='flex w-full justify-between py-4'>
        <span className='text-left'>Traits</span>
        <ChevronDown className='h-4 w-4 shrink-0 transition-transform duration-200' />
      </AccordionTrigger>
      <AccordionContent>
        <div className='flex flex-row flex-wrap gap-3'>
          {/* @ts-expect-error TODO Fix later */}
          {items.map(item => (
            <Card
              key={item.trait_type}
              className='flex flex-col gap-2 border bg-transparent p-4'
            >
              {item.trait_type && (
                <p className='text-center text-sm leading-tight'>
                  {item.trait_type}
                </p>
              )}
              <p className='text-center text-base font-bold'>
                {typeof item.value === 'object'
                  ? JSON.stringify(item.value || {})
                  : item.value}
              </p>
            </Card>
          ))}
        </div>
      </AccordionContent>
    </AccordionItem>
  );
}
