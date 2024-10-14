"use client"

import { cn } from "@/lib/utils"
import * as React from "react"

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {}

const Input = React.forwardRef<HTMLInputElement, InputProps>(({ className, type, ...props }, ref) => {
  const { placeholder, ...rest } = props
  const [focus, setFocus] = React.useState(false)
  return (
    <span className="relative isolate">
      {props.placeholder && (
        <span
          className={cn(
            "pointer-events-none absolute z-10 left-2 top-0 -translate-y-1/2 text-xs font-medium bg-background px-1",
            focus ? "text-foreground" : "text-muted-foreground"
          )}
        >
          <span className={cn(props.disabled && "opacity-50")}>
            {props.placeholder} {props.required ? <span className="text-red-500">*</span> : ""}
          </span>
        </span>
      )}
      <input
        type={type}
        onFocus={() => setFocus(true)}
        onBlur={() => setFocus(false)}
        className={cn(
          "flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
          className
        )}
        ref={ref}
        {...rest}
      />
    </span>
  )
})
Input.displayName = "Input"

export { Input }
