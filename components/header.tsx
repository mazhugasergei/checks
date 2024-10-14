"use client"

import { logOut } from "@/app/actions/logging"
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { useStore } from "@/hooks/use-store"
import { User } from "lucide-react"
import Link from "next/link"
import { buttonVariants } from "./ui/button"

export default function Header() {
  const user = useStore((state) => state.user)

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

      {user ? (
        <Menubar className="border-none shadow-none p-0">
          <MenubarMenu>
            <MenubarTrigger className="cursor-pointer h-9 w-9 grid place-items-center border rounded-full p-0">
              <User size={16} />
            </MenubarTrigger>
            <MenubarContent>
              <div></div>
              <MenubarItem asChild>
                <Link href="/profile" className="cursor-pointer">
                  Профиль
                </Link>
              </MenubarItem>
              <MenubarSeparator />
              <MenubarItem onClick={handleLogOut} className="cursor-pointer !text-destructive">
                Выйти
              </MenubarItem>
            </MenubarContent>
          </MenubarMenu>
        </Menubar>
      ) : (
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
    </header>
  )
}
