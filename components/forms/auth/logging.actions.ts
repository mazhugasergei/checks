"use server"

import prisma from "@/app/db"
import { Toast } from "@/hooks/use-toast"
import { hashPassword, verifyPassword } from "@/lib/utils"
import { User } from "@prisma/client"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"

type LogInResult = { user?: Omit<User, "password"> | null; error?: Toast }

export const signUp = async ({
  adminPassword,
  ...data
}: Omit<User, "id" | "createdAt" | "updatedAt"> & {
  password: string
  adminPassword: string
}): Promise<LogInResult> => {
  const result: LogInResult = { user: null }
  try {
    // check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined")

    // check if username is taken
    const isTaken = await prisma.user.findFirst({ where: { username: data.username } })
    if (isTaken)
      return {
        ...result,
        error: {
          title: "Логин занят",
          description: "Пользователь с таким логином уже существует",
          variant: "destructive",
        },
      }

    // check if admin password is correct
    if (adminPassword !== process.env.ADMIN_PASSWORD)
      return { ...result, error: { description: "Неправильный пароль администратора", variant: "destructive" } }

    // hash password
    const hash = hashPassword(data.password)

    // create user
    const user = await prisma.user.create({ data: { ...data, password: hash } })

    // set token
    const tokenInfo: UserJWTPayload = { id: user.id }
    const token = jwt.sign(tokenInfo, process.env.JWT_SECRET, { expiresIn: "30d" })
    cookies().set("auth", token)

    const { password: _, ...userWithoutPassword } = user
    return { user: userWithoutPassword }
  } catch (error) {
    console.log(error)
    return {
      ...result,
      error: { title: "Что-то пошло не так", description: "Попробуйте снова", variant: "destructive" },
    }
  }
}

export const tokenLogIn = async (): Promise<LogInResult> => {
  const result: LogInResult = { user: null }

  // check if token exists
  const token = cookies().get("auth")?.value
  if (!token) return result

  try {
    // check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined")

    // verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserJWTPayload

    // check if user exists
    const user = await prisma.user.findFirst({ where: { id: decoded.id } })
    if (!user) return { ...result, error: { description: "Войдите в свой аккаунт снова" } }

    // return user with password removed
    const { password, ...userWithoutPassword } = user
    return { user: userWithoutPassword }
  } catch (error) {
    console.error(error)
    return { ...result, error: { description: "Войдите в свой аккаунт снова" } }
  }
}

export const logIn = async ({ username, password }: { username: string; password: string }): Promise<LogInResult> => {
  const result: LogInResult = { user: null }

  try {
    // check if JWT_SECRET is defined
    if (!process.env.JWT_SECRET) throw new Error("JWT_SECRET is not defined")

    // check if user exists
    const user = await prisma.user.findFirst({ where: { username } })
    if (!user) return { ...result, error: { title: "Неправильный логин или пароль" } }
    const isMatch = verifyPassword(password, user.password)
    if (!isMatch) return { ...result, error: { title: "Неправильный логин или пароль" } }

    // set token
    const tokenInfo: UserJWTPayload = { id: user.id }
    const token = jwt.sign(tokenInfo, process.env.JWT_SECRET, { expiresIn: "30d" })
    cookies().set("auth", token)

    // return user with password removed
    const { password: _, ...userWithoutPassword } = user
    return { user: userWithoutPassword }
  } catch (error) {
    console.error(error)
    return { ...result, error: { title: "Что-то пошло не так" } }
  }
}

export const logOut = () => {
  cookies().get("auth")?.value && cookies().delete("auth")
}
