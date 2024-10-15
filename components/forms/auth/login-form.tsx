"use client"

import { logIn } from "@/app/actions/logging"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "@/hooks/use-toast"
import { User } from "@prisma/client"
import { LoaderCircle } from "lucide-react"
import React from "react"

export default function LogInForm() {
  const [data, setData] = React.useState<Omit<User, "id" | "role" | "createdAt" | "updatedAt"> & { password: string }>({
    username: "",
    password: "",
    firstName: "",
    middleName: null,
    lastName: "",
  })
  const [submitting, setSubmitting] = React.useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await logIn(data).then(({ success, error }) => {
      if (success) window.location.href = "/"
      if (error)
        toast({
          title: error.title,
          description: error.description,
          variant: error.destructive ? "destructive" : "default",
        })
    })
    setSubmitting(false)
  }

  return (
    <form onSubmit={submit} className="container">
      <h1 className="uppercase font-bold text-center">Авторизация пользователя</h1>

      <Input
        required
        value={data.username ?? ""}
        onChange={(e) => setData({ ...data, username: e.target.value })}
        placeholder="Логин"
      />
      <Input
        required
        value={data.password ?? ""}
        onChange={(e) => setData({ ...data, password: e.target.value })}
        placeholder="Пароль"
      />

      <Button>{submitting ? <LoaderCircle size={18} className="animate-spin" /> : "Подтвердить"}</Button>

      {/* <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre> */}
    </form>
  )
}
