"use client"

import { LogInButtons } from "@/components/header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/hooks/use-toast"
import { Check, User } from "@prisma/client"
import { LoaderCircle } from "lucide-react"
import Link from "next/link"
import React from "react"
import { ToastAction } from "../../components/ui/toast"
import { createCheck } from "./check.actions"

export default function SalaryCheckForm({ user }: { user?: Omit<User, "password"> | null }) {
  const defaultData: Omit<Check, "id" | "updatedAt" | "createdAt"> = {
    name:
      user && user.role !== "admin"
        ? user.firstName + " " + (user.middleName ? `${user.middleName} ` : "") + user.lastName
        : "",
    basis: "",
    period: "",
    amount: "",
    userId: user ? user.id : null,
    paid: false,
  }

  const [data, setData] = React.useState(defaultData)
  const [submitting, setSubmitting] = React.useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) return
    setSubmitting(true)
    await createCheck(data)
    setSubmitting(false)
    toast({
      title: "Заебумба",
      description: "Расходник успешно создан",
      action: (
        <ToastAction altText="Расходники">
          <Link href="/checks">Расходники</Link>
        </ToastAction>
      ),
    })
    setData(defaultData)
  }

  return (
    <div className="relative isolate">
      {user === null && (
        <div className="container absolute z-50 inset-0 flex flex-col gap-2 items-center justify-center bg-background/50 backdrop-blur">
          <p className="text-center text-balance text-sm font-medium">
            Для создания расходника необходимо авторизоваться
          </p>
          <LogInButtons />
        </div>
      )}

      <form onSubmit={submit} className="container">
        <h1 className="uppercase font-bold text-center">Расходный кассовый ордер</h1>

        {/* name */}
        <Input
          required
          disabled={user?.role !== "admin"}
          name="name"
          placeholder="Выдать"
          value={data.name}
          onChange={(e) => user?.role === "admin" && setData({ ...data, name: e.target.value })}
        />

        <div className="grid grid-cols-2 gap-2">
          {/* basis */}
          <Select
            required
            disabled={!user}
            name="basis"
            value={data.basis}
            onValueChange={(value) => setData({ ...data, basis: value })}
          >
            <SelectTrigger required disabled={!user} placeholder="Основание">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Аванс">Аванс</SelectItem>
              <SelectItem value="Зарплата">Зарплата</SelectItem>
            </SelectContent>
          </Select>

          {/* period */}
          <Select
            required
            disabled={!user}
            name="period"
            value={data.period}
            onValueChange={(value) => setData({ ...data, period: value })}
          >
            <SelectTrigger required disabled={!user} placeholder="Период">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Январь">Январь</SelectItem>
              <SelectItem value="Февраль">Февраль</SelectItem>
              <SelectItem value="Март">Март</SelectItem>
              <SelectItem value="Апрель">Апрель</SelectItem>
              <SelectItem value="Май">Май</SelectItem>
              <SelectItem value="Июнь">Июнь</SelectItem>
              <SelectItem value="Июль">Июль</SelectItem>
              <SelectItem value="Август">Август</SelectItem>
              <SelectItem value="Сентябрь">Сентябрь</SelectItem>
              <SelectItem value="Октябрь">Октябрь</SelectItem>
              <SelectItem value="Ноябрь">Ноябрь</SelectItem>
              <SelectItem value="Декабрь">Декабрь</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* amount */}
        <div className="relative">
          <Input
            required
            disabled={!user}
            name="amount"
            type="number"
            placeholder="Сумма"
            value={data.amount}
            onChange={(e) => setData({ ...data, amount: e.target.value.replace(/[^0-9]/g, "") })}
            className="pr-8"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">₽</span>
        </div>

        <Button disabled={submitting || !user}>
          {submitting ? <LoaderCircle size={18} className="animate-spin" /> : "Отправить"}
        </Button>

        {/* debug */}
        {/* <pre>{JSON.stringify(data, null, 2)}</pre> */}
      </form>
    </div>
  )
}
