"use client"

import { signUp } from "@/components/forms/auth/logging.actions"
import { PasswordInput } from "@/components/password-input"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { User } from "@prisma/client"
import { LoaderCircle } from "lucide-react"
import React from "react"

export default function SignUpForm() {
  const [data, setData] = React.useState<
    Omit<User, "id" | "createdAt" | "updatedAt"> & { password: string; adminPassword: string }
  >({
    username: "",
    password: "",
    firstName: "",
    middleName: null,
    lastName: "",
    role: "",
    adminPassword: "",
  })
  const [submitting, setSubmitting] = React.useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    await signUp(data).then(({ error }) => {
      if (error)
        toast({
          title: error.title,
          description: error.description,
          variant: error.variant,
        })
      else window.location.href = "/"
    })
    setSubmitting(false)
  }

  return (
    <form onSubmit={submit} className="container">
      <h1 className="uppercase font-bold text-center">Регистрация пользователя</h1>

      {/* login info */}
      <Input
        required
        value={data.username ?? ""}
        onChange={(e) => setData({ ...data, username: e.target.value })}
        placeholder="Логин"
      />
      <PasswordInput
        required
        placeholder="Пароль"
        value={data.password ?? ""}
        onChange={(e) => setData({ ...data, password: e.target.value })}
      />

      <div />

      {/* name */}
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

      <div />

      {/* role */}
      {(() => {
        const roles: { value: string; label: string }[] = [
          {
            value: "user",
            label: "Пользователь",
          },
          {
            value: "admin",
            label: "Администратор",
          },
        ]
        return (
          <Select required value={data.role} onValueChange={(value) => setData({ ...data, role: value })}>
            <SelectTrigger required placeholder="Роль">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {roles.map((role) => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )
      })()}

      {/* admin password */}
      <PasswordInput
        required
        placeholder="Пароль администратора"
        value={data.adminPassword ?? ""}
        onChange={(e) => setData({ ...data, adminPassword: e.target.value })}
      />

      <Button>{submitting ? <LoaderCircle size={18} className="animate-spin" /> : "Подтвердить"}</Button>

      {/* debug */}
      {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
    </form>
  )
}
