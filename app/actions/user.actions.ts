"use server"

import { User } from "@prisma/client"
import prisma from "../db"

export const updateUser = async (user: User) => {
  return await prisma.user.update({
    where: {
      id: user.id,
    },
    data: {
      ...user,
    },
  })
}
