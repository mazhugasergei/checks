import { tokenLogIn } from "@/components/forms/auth/logging.actions"
import Link from "next/link"
import { buttonVariants } from "../ui/button"
import ProfileMenu from "./profile-menu"

export default async function Header() {
  const { user } = await tokenLogIn()

  return (
    <header className="flex gap-2 justify-between items-center">
      <nav className="flex gap-2 items-center">
        <Link href="/" className={buttonVariants({ size: "sm", variant: "link" })}>
          Главная
        </Link>
      </nav>

      {/* not logged in */}
      {!user && (
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
      {user && <ProfileMenu user={user} />}
    </header>
  )
}
