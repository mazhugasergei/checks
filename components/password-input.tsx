"use client"

import { cn } from "@/lib/utils"
import { Eye, EyeOff } from "lucide-react"
import React from "react"
import { Button } from "./ui/button"
import { Input, InputProps } from "./ui/input"

export const PasswordInput = React.forwardRef<HTMLInputElement, InputProps>(({ className, ...props }, ref) => {
  const [passwordVisible, setPasswordVisible] = React.useState(false)
  return (
    <span className="relative">
      <Input type={passwordVisible ? "text" : "password"} className={cn("pr-[2.1875rem]", className)} {...props} />
      <Button
        variant="ghost"
        type="button"
        size="icon"
        className="scale-75 origin-right absolute right-1 top-1/2 -translate-y-1/2"
        onClick={() => setPasswordVisible(!passwordVisible)}
      >
        {passwordVisible ? <Eye size={18} /> : <EyeOff size={18} />}
      </Button>
    </span>
  )
})
