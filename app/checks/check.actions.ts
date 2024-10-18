"use server"

import { Check } from "@prisma/client"
import { tokenLogIn } from "../../components/forms/auth/logging.actions"
import prisma from "../db"

export const getChecks = async () => {
  const { user } = await tokenLogIn()
  if (!user) return null
  return await prisma.check.findMany({
    include: { user: true },
    where: user.role === "admin" ? undefined : { userId: user.id },
  })
}

export const createCheck = async (check: Omit<Check, "id" | "updatedAt" | "createdAt">) => {
  return await prisma.check.create({
    data: { ...check },
  })
}

export const changeCheckPaid = async (id: number) => {
  const check = await prisma.check.findUnique({ where: { id } })
  return await prisma.check.update({
    where: { id },
    data: { paid: !check?.paid },
  })
}

export const deleteCheck = async (id: number): Promise<{ check?: Check; error?: string }> => {
  const check = await prisma.check.findUnique({ where: { id } })
  if (!check) return { error: "Расходник не существует или уже удален" }
  const { user } = await tokenLogIn()
  if (!user) return { error: "Вы не авторизованы" }
  if (user.role !== "admin" && check.paid) return { error: "Вы не можете удалить оплаченный расходник" }
  return { check: await prisma.check.delete({ where: { id } }) }
}
