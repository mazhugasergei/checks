"use client"

import { signUp } from "@/app/actions/logging"
import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export default function SignUpForm() {
  const router = useRouter()
  const [user, setUser] = React.useState<User | null>()
  const [data, setData] = React.useState<User & { password: string }>({
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
    await signUp(data)
    setSubmitting(false)
  }

  return (
    <form onSubmit={submit} className="container">
      <h1 className="uppercase font-bold text-center">Регистрация пользователя</h1>

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

      <div />

      <Input
        required
        value={data.firstName ?? ""}
        onChange={(e) => setData({ ...data, firstName: e.target.value })}
        placeholder="Имя"
      />
      <Input
        value={data.middleName ?? ""}
        onChange={(e) => setData({ ...data, middleName: e.target.value || null })}
        placeholder="Отчество"
      />
      <Input
        required
        value={data.lastName ?? ""}
        onChange={(e) => setData({ ...data, lastName: e.target.value })}
        placeholder="Фамилия"
      />

      <Button>{submitting ? <LoaderCircle size={18} className="animate-spin" /> : "Подтвердить"}</Button>

      {/* <pre>
        <code>{JSON.stringify(data, null, 2)}</code>
      </pre> */}
    </form>
  )
}
