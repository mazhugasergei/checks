"use client"

import { Button } from "@/components/ui/button"
import { useEffect } from "react"

interface Error {
  error: Error
  reset: () => void
}

export default function Error({ error, reset }: Error) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <main className="flex-1 w-full flex flex-col justify-center items-center">
      <h2 className="font-bold text-3xl">#!@*%$</h2>
      <p className="mb-2">Что-то пошло не так</p>
      <Button onClick={reset}>Перегрузить</Button>
    </main>
  )
}
