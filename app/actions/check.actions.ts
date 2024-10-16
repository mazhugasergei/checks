"use server"

import { Check } from "@prisma/client"
import prisma from "../db"

export const createCheck = async (check: Omit<Check, "id" | "updatedAt" | "createdAt">) => {
  return await prisma.check.create({
    data: { ...check },
  })
}
