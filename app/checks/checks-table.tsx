"use client"

import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button, buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { toast } from "@/hooks/use-toast"
import { Check, User } from "@prisma/client"
import { format } from "date-fns"
import { Check as CheckIcon, LoaderCircle, X } from "lucide-react"
import React from "react"
import { tokenLogIn } from "../actions/logging.actions"
import Loading from "../loading"
import { changeCheckPaid, deleteCheck, getChecks } from "./check.actions"

export default function ChecksTable() {
  const [checks, setChecks] = React.useState<Check[] | null>()

  const sortChecks = (data: Check[] | null) => {
    if (!data) return null
    return data.sort((a, b) => {
      if (a.paid === b.paid) {
        return a.paid
          ? b.updatedAt.getTime() - a.updatedAt.getTime() // Paid: sort by updatedAt (newest first)
          : a.createdAt.getTime() - b.createdAt.getTime() // Unpaid: sort by createdAt (oldest first)
      }
      return Number(a.paid) - Number(b.paid) // Unpaid comes first
    })
  }

  React.useEffect(() => {
    getChecks().then((data) => {
      setChecks(sortChecks(data))
    })
  }, [])

  const handleUpdateItemClient = (updatedCheck: Check) => {
    setChecks((prevChecks) =>
      prevChecks
        ? sortChecks(prevChecks.map((check) => (check.id === updatedCheck.id ? updatedCheck : check)))
        : undefined
    )
  }

  const handleDeleteItemClient = async (id: number) => {
    setChecks((prevChecks) => prevChecks?.filter((check) => check.id !== id))
  }

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Выдать</TableHead>
          <TableHead>Основание</TableHead>
          <TableHead>Период</TableHead>
          <TableHead>Сумма</TableHead>
          <TableHead>Создан</TableHead>
          <TableHead className="text-center">Оплачен</TableHead>
          <TableHead className="w-0 p-0" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {/* loading */}
        {checks === undefined && (
          <TableRow>
            <TableCell colSpan={999}>
              <Loading />
            </TableCell>
          </TableRow>
        )}
        {/* no checks */}
        {checks?.length === 0 && (
          <TableRow>
            <TableCell colSpan={999} className="text-center">
              Нет расходников
            </TableCell>
          </TableRow>
        )}
        {/* checks */}
        {checks?.map((check) => (
          <DataRow
            key={check.id}
            check={check}
            handleUpdateItemClient={handleUpdateItemClient}
            handleDeleteItemClient={handleDeleteItemClient}
          />
        ))}
      </TableBody>
    </Table>
  )
}

const DataRow = ({
  check: { id, name, basis, period, amount, createdAt, paid },
  handleUpdateItemClient,
  handleDeleteItemClient,
}: {
  check: Check
  handleUpdateItemClient: (updatedCheck: Check) => void
  handleDeleteItemClient: (id: number) => void
}) => {
  const [user, setUser] = React.useState<Omit<User, "password"> | null>(null)
  const [checkPending, setCheckPending] = React.useState(false)

  React.useEffect(() => {
    tokenLogIn().then(({ user }) => setUser(user))
  }, [])

  const handleCheckChange = async () => {
    setCheckPending(true)
    const updatedCheck = await changeCheckPaid(id)
    handleUpdateItemClient(updatedCheck)
    setCheckPending(false)
  }

  return (
    <TableRow key={id}>
      <TableCell>{name}</TableCell>
      <TableCell>{basis}</TableCell>
      <TableCell>{period}</TableCell>
      <TableCell>{amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ".")}</TableCell>
      <TableCell>{format(new Date(createdAt), "dd.MM.yyyy")}</TableCell>
      <TableCell className="px-0">
        <div className="grid place-items-center">
          {user?.role !== "admin" && paid && <CheckIcon size={16} />}
          {user?.role !== "admin" && !paid && <X size={16} />}
          {user?.role === "admin" && checkPending && <LoaderCircle size={16} className="animate-spin" />}
          {user?.role === "admin" && !checkPending && (
            <Checkbox checked={paid} onCheckedChange={handleCheckChange} className="block" />
          )}
        </div>
      </TableCell>
      <TableCell className="px-0">
        {(user?.role === "admin" || !paid) && <DeleteButton id={id} handleDeleteItemClient={handleDeleteItemClient} />}
      </TableCell>
    </TableRow>
  )
}

const DeleteButton = ({ id, handleDeleteItemClient }: { id: number; handleDeleteItemClient: (id: number) => void }) => {
  const [deletePending, setDeletePending] = React.useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = React.useState(false)

  const handleDeleteItem = async () => {
    setDeletePending(true)
    const { error } = await deleteCheck(id)
    if (error)
      toast({
        title: "Ошибка",
        description: error,
        variant: "destructive",
      })
    else {
      handleDeleteItemClient(id)
      setAlertDialogOpen(false)
    }
    setDeletePending(false)
  }

  return (
    <AlertDialog open={alertDialogOpen} onOpenChange={setAlertDialogOpen}>
      <AlertDialogTrigger className={buttonVariants({ variant: "outline" })}>Удалить</AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Вы уверены?</AlertDialogTitle>
          <AlertDialogDescription>
            Это действие не может быть отменено. Это навсегда удалит запись с наших серверов.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel disabled={deletePending}>Отмена</AlertDialogCancel>
          <Button disabled={deletePending} onClick={handleDeleteItem}>
            {deletePending ? <LoaderCircle size={16} className="animate-spin" /> : "Удалить"}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
