import * as React from 'react';
import * as SliderPrimitive from '@radix-ui/react-slider';

import { cn } from '../../lib/cn';

const Slider = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Root>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Root
    ref={ref}
    className={cn(
      'relative flex w-full touch-none select-none items-center min-h-11',
      className
    )}
    {...props}
  >
    <SliderTrack>
      <SliderRange />
    </SliderTrack>
    {(props.defaultValue ?? props.value ?? [0]).map((_, index) => (
      <SliderThumb key={index} />
    ))}
  </SliderPrimitive.Root>
));
Slider.displayName = SliderPrimitive.Root.displayName;

const SliderTrack = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Track>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Track>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Track
    ref={ref}
    className={cn(
      'relative h-2 w-full grow rounded-full',
      'bg-vault-blue-dark border border-vault-yellow-dark',
      className
    )}
    {...props}
  />
));
SliderTrack.displayName = SliderPrimitive.Track.displayName;

const SliderRange = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Range>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Range>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Range
    ref={ref}
    className={cn('absolute h-full rounded-full bg-vault-yellow', className)}
    {...props}
  />
));
SliderRange.displayName = SliderPrimitive.Range.displayName;

const SliderThumb = React.forwardRef<
  React.ComponentRef<typeof SliderPrimitive.Thumb>,
  React.ComponentPropsWithoutRef<typeof SliderPrimitive.Thumb>
>(({ className, ...props }, ref) => (
  <SliderPrimitive.Thumb
    ref={ref}
    className={cn(
      'block h-5 w-5 rounded-full',
      'border-2 border-vault-yellow bg-vault-gray-light',
      'transition-colors',
      'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-vault-yellow focus-visible:ring-offset-2 focus-visible:ring-offset-vault-blue-dark',
      'disabled:pointer-events-none disabled:opacity-50',
      className
    )}
    {...props}
  />
));
SliderThumb.displayName = SliderPrimitive.Thumb.displayName;

export { Slider, SliderTrack, SliderRange, SliderThumb };
