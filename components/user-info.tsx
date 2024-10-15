"use client"

import { tokenLogIn } from "@/app/actions/logging"
import React from "react"
import { Skeleton } from "./ui/skeleton"

export default function UserInfo() {
  const [user, setUser] = React.useState<User | null>()

  React.useEffect(() => {
    tokenLogIn().then(({ user }) => setUser(user))
  }, [])

  return (
    <div className="container">
      {/* loading */}
      {user === undefined && (
        <div className="space-y-1">
          <Skeleton className="w-[3%] h-4 rounded" />
          <Skeleton className="w-[30%] h-4 rounded ml-[2%]" />
          <Skeleton className="w-[50%] h-4 rounded ml-[2%]" />
          <Skeleton className="w-[40%] h-4 rounded ml-[2%]" />
          <Skeleton className="w-[3%] h-4 rounded" />
        </div>
      )}

      {/* not logged in */}
      {user === null && <pre>null</pre>}

      {/* logged in */}
      {user && <pre>{JSON.stringify(user, null, 2)}</pre>}
    </div>
  )
}
