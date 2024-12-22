import * as React from 'react';
import * as ProgressPrimitive from '@radix-ui/react-progress';
import { motion, useInView, useAnimation } from 'framer-motion';

import { cn } from '@ltw/ui/lib/utils';

const Progress = React.forwardRef<
  React.ElementRef<typeof ProgressPrimitive.Root>,
  React.ComponentPropsWithoutRef<typeof ProgressPrimitive.Root>
>(({ className, value, ...props }, ref) => {
  const progressRef = React.useRef(null);
  const isInView = useInView(progressRef, { once: true });
  const controls = useAnimation();

  React.useEffect(() => {
    if (isInView) {
      controls.start({
        transform: `translateX(-${100 - (value || 0)}%)`,
        transition: {
          type: 'spring',
          stiffness: 40,
          damping: 15
        }
      });
    }
  }, [isInView, value, controls]);

  return (
    <ProgressPrimitive.Root
      ref={ref}
      className={cn('relative h-4 w-full overflow-hidden rounded-full bg-secondary', className)}
      {...props}
    >
      <motion.div
        ref={progressRef}
        className="h-full w-full flex-1 bg-primary"
        initial={{ transform: 'translateX(-100%)' }}
        animate={controls}
      />
    </ProgressPrimitive.Root>
  );
});
Progress.displayName = ProgressPrimitive.Root.displayName;

export { Progress };
