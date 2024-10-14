"use client"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Input } from "@/components/ui/input"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon, LoaderCircle } from "lucide-react"
import React from "react"
import { useStore } from "../hooks/use-store"

export default function SalaryCheckForm() {
  const [submitting, setSubmitting] = React.useState(false)
  const user = useStore((state) => state.user)
  const fullName = user ? user.firstName + " " + (user.middleName ? `${user.middleName} ` : "") + user.lastName : null
  const currentDate = new Date()
  const [date, setDate] = React.useState<Date | undefined>(currentDate)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)
    const formData = new FormData(e.target as HTMLFormElement)
    const data = Object.fromEntries(formData)
    console.log(data)
    setSubmitting(false)
  }

  return (
    <form onSubmit={submit} className="container">
      <h1 className="uppercase font-bold text-center">Расходный кассовый ордер</h1>

      {/* name */}
      <Input required disabled name="name" placeholder="Выдать" defaultValue={fullName ?? ""} />

      <div className="grid grid-cols-2 gap-2">
        {/* basis */}
        <Select required name="basis">
          <SelectTrigger required placeholder="Основание">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="Аванс">Аванс</SelectItem>
            <SelectItem value="Зарплата">Зарплата</SelectItem>
          </SelectContent>
        </Select>

        {/* period */}
        <Select required name="period">
          <SelectTrigger required placeholder="Период">
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
          name="amount"
          type="number"
          placeholder="Сумма"
          onChange={(e) => (e.target.value = e.target.value.replace(/[^0-9]/g, ""))}
          className="pr-8"
        />
        <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">₽</span>
      </div>

      <div className="grid grid-cols-2 gap-2">
        {/* date */}
        <Popover>
          <PopoverTrigger disabled asChild>
            <Button variant={"outline"} className={cn("justify-start font-normal", !date && "text-muted-foreground")}>
              <CalendarIcon className="mr-2 h-4 w-4" />
              {date ? format(date, "dd MMMM yyyy") : <span>Выберите дату</span>}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar mode="single" selected={date} onSelect={setDate} initialFocus />
          </PopoverContent>
        </Popover>
      </div>

      <Button>{submitting ? <LoaderCircle size={18} className="animate-spin" /> : "Отправить"}</Button>
    </form>
  )
}
