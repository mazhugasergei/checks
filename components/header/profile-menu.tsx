"use client"

import { logOut } from "@/app/actions/logging.actions"
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
import { useRouter } from "next/navigation"

export default function ProfileMenu({ user }: { user: Omit<User, "password"> }) {
  const router = useRouter()

  const handleLogOut = () => {
    logOut()
    router.refresh()
  }

  return (
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
          <MenubarItem asChild>
            <Link href="/checks" className="cursor-pointer">
              Расходники
            </Link>
          </MenubarItem>

          <MenubarSeparator />

          {/* log out */}
          <MenubarItem onClick={handleLogOut} className="cursor-pointer !text-destructive">
            Выйти
          </MenubarItem>
        </MenubarContent>
      </MenubarMenu>
    </Menubar>
  )
}
