"use client"

import { logIn } from "@/app/actions/logging"
import { useStore } from "@/hooks/use-store"
import { toast } from "@/hooks/use-toast"
import { LoaderCircle } from "lucide-react"
import { useRouter } from "next/navigation"
import React from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"

export default function LogInForm() {
  const router = useRouter()
  const setUser = useStore((state) => state.setUser)
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
    await logIn(data)
      .then((res) => {
        if (res.success) {
          setUser(res.user)
          router.push("/")
        } else if (res.error)
          toast({
            title: res.error.title,
            description: res.error.description,
            variant: res.error.destructive ? "destructive" : "default",
          })
      })
      .catch((e) => {
        toast({
          title: "Ошибка",
          description: e.message,
          variant: "destructive",
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
