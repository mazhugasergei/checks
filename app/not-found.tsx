import { buttonVariants } from "@/components/ui/button"
import Link from "next/link"

export default function NotFound() {
  return (
    <main className="flex-1 w-full flex flex-col justify-center items-center">
      <h1 className="font-bold text-3xl">404</h1>
      <p className="mb-2">Страница не найдена</p>
      <Link href="/" className={buttonVariants()}>
        На главную
      </Link>
    </main>
  )
}
