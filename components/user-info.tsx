"use client"

import { useStore } from "@/hooks/use-store"

export default function UserInfo() {
  const user = useStore((state) => state.user)

  return (
    <div className="container">
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </div>
  )
}
