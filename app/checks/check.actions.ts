"use server"

import prisma from "../db"

export const getChecks = async () => {
  return await prisma.check.findMany({
    include: { user: true },
  })
}

export const changeCheckPaid = async (id: number) => {
  const check = await prisma.check.findUnique({ where: { id } })
  return await prisma.check.update({
    where: { id },
    data: { paid: !check?.paid },
  })
}

export const deleteCheck = async (id: number) => {
  return await prisma.check.delete({ where: { id } })
}
