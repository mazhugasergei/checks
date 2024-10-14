"use client"

import { initialLogin } from "@/app/actions/logging"
import { useStore } from "@/hooks/use-store"
import { toast } from "@/hooks/use-toast"
import { useEffect } from "react"

export default function InitialLogIn() {
  const setUser = useStore((state) => state.setUser)

  useEffect(() => {
    initialLogin().then((res) => {
      if (res.success) setUser(res.user)
      else if (res.error)
        toast({
          title: res.error.title,
          description: res.error.description,
          variant: res.error.destructive ? "destructive" : "default",
        })
    })
  }, [])

  return null
}
