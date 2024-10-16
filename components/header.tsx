"use client"

import { logOut, tokenLogIn } from "@/app/actions/logging.actions"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { User } from "@prisma/client"
import { User as UserIcon } from "lucide-react"
import Link from "next/link"
import React from "react"
import { buttonVariants } from "./ui/button"
import { Skeleton } from "./ui/skeleton"

export default function Header() {
  const [user, setUser] = React.useState<Omit<User, "password"> | null>()

  React.useEffect(() => {
    tokenLogIn().then(({ user }) => setUser(user))
  }, [])

  const handleLogOut = () => {
    logOut()
    window.location.reload()
  }

  return (
    <header className="flex gap-2 justify-between items-center">
      <nav className="flex gap-2 items-center">
        <Link href="/" className={buttonVariants({ size: "sm", variant: "link" })}>
          Главная
        </Link>
      </nav>

      {/* loading */}
      {user === undefined && <Skeleton className="h-8 w-20 rounded-full" />}

      {/* not logged in */}
      {user === null && (
        <div className="flex gap-2 items-center">
          <Link href="/login" className={buttonVariants({ size: "sm", className: "!rounded-full" })}>
            Войти
          </Link>
          <Link
            href="/signup"
            className={buttonVariants({ size: "sm", variant: "outline", className: "!rounded-full" })}
          >
            Регистрация
          </Link>
        </div>
      )}

      {/* logged in */}
      {user && (
        <Menubar className="border-none shadow-none p-0">
          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer h-9 w-9 grid place-items-center !bg-background border rounded-full p-0">
              <UserIcon size={16} />
            </MenubarTrigger>
            <MenubarContent align="end">
              {/* user */}
              <MenubarItem asChild className="leading-5 text-sm py-1.5 px-2">
                <Link href="/profile" className="group cursor-pointer flex flex-col !items-start">
                  <span className="font-bold">
                    {user.firstName + " " + (user.middleName ? `${user.middleName} ` : "") + user.lastName}
                  </span>
                  <span className="group-hover:underline">{user.username}</span>
                </Link>
              </MenubarItem>

              <MenubarSeparator />

              {/* checks */}
              {user.role === "admin" && (
                <MenubarItem asChild>
                  <Link href="/checks" className="cursor-pointer">
                    Расходники
                  </Link>
                </MenubarItem>
              )}

              <MenubarSeparator />

              {/* log out */}
              <MenubarItem onClick={handleLogOut} className="cursor-pointer !text-destructive">
                Выйти
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      )}
    </header>
  )
}
