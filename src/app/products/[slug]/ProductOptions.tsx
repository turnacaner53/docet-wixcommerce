import { Label } from '@/components/ui/label';
import { checkInStock, cn } from '@/lib/utils';
import { products } from '@wix/stores';

interface ProductOptionsProps {
  product: products.Product;
  selectedOptions: Record<string, string>;
  setSelectedOptions: (options: Record<string, string>) => void;
}

export default function ProductOptions({
  product,
  selectedOptions,
  setSelectedOptions,
}: ProductOptionsProps) {
  return (
    <div className='space-y-2.5'>
      {product.productOptions?.map((option) => (
        <fieldset key={option.name} className='space-y-1.5'>
          <legend>
            <Label asChild>
              <span>{option.name}</span>
            </Label>
          </legend>
          <div className='flex flex-wrap items-center gap-1.5'>
            {option.choices?.map((choice) => (
              <div key={choice.description}>
                <input
                  className='peer hidden'
                  type='radio'
                  id={choice.description}
                  name={option.name}
                  value={choice.description}
                  checked={selectedOptions[option.name || ''] === choice.description}
                  onChange={() =>
                    setSelectedOptions({
                      ...selectedOptions,
                      [option.name || '']: choice.description || '',
                    })
                  }
                />
                <Label
                  className={cn(
                    'flex min-w-14 items-center justify-center gap-1.5 rounded-md border p-2 hover:cursor-pointer peer-checked:border-primary',
                    !checkInStock(product, {
                      ...selectedOptions,
                      [option.name || '']: choice.description || '',
                    }) && 'opacity-50',
                  )}
                  htmlFor={choice.description}
                >
                  {option.optionType === products.OptionType.color && (
                    <span
                      className='mr-2 size-4 rounded-full border'
                      style={{ backgroundColor: choice.value }}
                    />
                  )}
                  <span>{choice.description}</span>
                </Label>
              </div>
            ))}
          </div>
        </fieldset>
      ))}
    </div>
  );
}
