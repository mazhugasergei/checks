"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { buttonVariants } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Check } from "@prisma/client"
import { format } from "date-fns"
import { LoaderCircle } from "lucide-react"
import React from "react"
import Loading from "../loading"
import { changeCheckPaid, deleteCheck, getChecks } from "./check.actions"

export default function ChecksTable() {
  const [checks, setChecks] = React.useState<Check[] | null>()

  const sortChecks = (data: Check[]) => {
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

  const handleUpdateCheckClient = (updatedCheck: Check) => {
    setChecks((prevChecks) =>
      prevChecks ? sortChecks(prevChecks.map((check) => (check.id === updatedCheck.id ? updatedCheck : check))) : null
    )
  }

  const handleDeleteCheckClient = async (id: number) => {
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
          <TableHead className="w-0" />
        </TableRow>
      </TableHeader>
      <TableBody>
        {checks === undefined && (
          <TableRow>
            <TableCell colSpan={999}>
              <Loading />
            </TableCell>
          </TableRow>
        )}
        {checks === null && (
          <TableRow>
            <TableCell colSpan={999}>Нет данных</TableCell>
          </TableRow>
        )}
        {checks?.map((check) => (
          <CheckRow
            key={check.id}
            check={check}
            handleUpdateCheckClient={handleUpdateCheckClient}
            handleDeleteCheckClient={handleDeleteCheckClient}
          />
        ))}
      </TableBody>
    </Table>
  )
}

const CheckRow = ({
  check: { id, name, basis, period, amount, createdAt, paid },
  handleUpdateCheckClient,
  handleDeleteCheckClient,
}: {
  check: Check
  handleUpdateCheckClient: (updatedCheck: Check) => void
  handleDeleteCheckClient: (id: number) => void
}) => {
  const [checkPending, setCheckPending] = React.useState(false)

  const handleCheckChange = async () => {
    setCheckPending(true)
    const updatedCheck = await changeCheckPaid(id)
    handleUpdateCheckClient(updatedCheck)
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
          {checkPending ? (
            <LoaderCircle size={16} className="animate-spin" />
          ) : (
            <Checkbox checked={paid} onCheckedChange={handleCheckChange} className="block" />
          )}
        </div>
      </TableCell>
      <TableCell>
        <DeleteButton id={id} handleDeleteCheckClient={handleDeleteCheckClient} />
      </TableCell>
    </TableRow>
  )
}

const DeleteButton = ({
  id,
  handleDeleteCheckClient,
}: {
  id: number
  handleDeleteCheckClient: (id: number) => void
}) => {
  const [deletePending, setDeletePending] = React.useState(false)
  const [alertDialogOpen, setAlertDialogOpen] = React.useState(false)

  const handleDeleteCheck = async () => {
    setDeletePending(true)
    await deleteCheck(id)
    handleDeleteCheckClient(id)
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
          <AlertDialogAction
            disabled={deletePending}
            onClick={async (e) => {
              e.preventDefault()
              await handleDeleteCheck()
              setAlertDialogOpen(false)
            }}
          >
            {deletePending ? <LoaderCircle size={16} className="animate-spin" /> : "Удалить"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
