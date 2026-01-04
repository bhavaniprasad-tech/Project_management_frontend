import * as React from "react"
import * as CheckboxPrimitive from "@radix-ui/react-checkbox"

import { cn } from "@/lib/utils"

const Checkbox = React.forwardRef(({ className, ...props }, ref) => (
  <CheckboxPrimitive.Root
    ref={ref}
    className={cn(
      "peer h-4 w-4 shrink-0 border border-gray-600 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-blue-600 data-[state=checked]:text-white data-[state=checked]:border-blue-600 rounded-full",
      className
    )}
    style={{ borderRadius: '50%' }}
    {...props}>
    <CheckboxPrimitive.Indicator className={cn("flex items-center justify-center text-current w-full h-full")}>
      <span className="text-[10px] leading-none">✓</span>
    </CheckboxPrimitive.Indicator>
  </CheckboxPrimitive.Root>
))
Checkbox.displayName = CheckboxPrimitive.Root.displayName

export { Checkbox } 