"use server"

import { hashPassword, verifyPassword } from "@/lib/utils"
import jwt from "jsonwebtoken"
import { cookies } from "next/headers"
import prisma from "../db"

type Login = {
  success: boolean
  user: User | null
  error?: {
    title?: string
    description: string
    destructive?: boolean
  }
}

export const signUp = async (data: User & { password: string }): Promise<Login> => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined")
    throw new Error("Что-то пошло не так")
  }

  // check if username is taken
  const isTaken = await prisma.user.findFirst({ where: { username: data.username } })
  if (isTaken)
    return { success: false, user: null, error: { description: "Пользователь с таким логином уже существует" } }

  // hash password
  const hash = hashPassword(data.password)

  // create user
  const user = await prisma.user.create({ data: { ...data, password: hash } })

  // set token
  const tokenInfo: UserJWTPayload = {
    id: user.id,
  }
  const token = jwt.sign(tokenInfo, process.env.JWT_SECRET, { expiresIn: "30d" })
  cookies().set("auth", token)

  const { password: _, ...userWithoutPassword } = user
  return { success: true, user: userWithoutPassword }
}

export const tokenLogIn = async (): Promise<Login> => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined")
    throw new Error("Internal Server Error")
  }

  // check if token exists
  const token = cookies().get("auth")?.value
  if (!token) return { success: false, user: null }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET) as UserJWTPayload
    // check if user exists
    const user = await prisma.user.findFirst({ where: { id: decoded.id } })
    if (!user) {
      cookies().delete("auth")
      return { success: false, user: null, error: { description: "Войдите в свой аккаунт снова" } }
    }
    // return user with password removed
    const { password, ...userWithoutPassword } = user
    return { success: true, user: userWithoutPassword }
  } catch (error) {
    cookies().delete("auth")
    return {
      success: false,
      user: null,
      error: { title: "Что-то пошло не так", description: "Попробуйте войти в свой аккаунт снова", destructive: true },
    }
  }
}

export const logIn = async ({ username, password }: { username: string; password: string }): Promise<Login> => {
  if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is not defined")
    throw new Error("Internal Server Error")
  }

  try {
    // check if user exists
    const user = await prisma.user.findFirst({ where: { username } })
    if (!user)
      return { success: false, user: null, error: { description: "Неправильный логин или пароль", destructive: true } }
    const isMatch = verifyPassword(password, user.password)
    if (!isMatch)
      return { success: false, user: null, error: { description: "Неправильный логин или пароль", destructive: true } }

    // set token
    const tokenInfo: UserJWTPayload = {
      id: user.id,
    }
    const token = jwt.sign(tokenInfo, process.env.JWT_SECRET, { expiresIn: "30d" })
    cookies().set("auth", token)

    // return user with password removed
    const { password: _, ...userWithoutPassword } = user
    return { success: true, user: userWithoutPassword }
  } catch (error) {
    console.error(error)
    return {
      success: false,
      user: null,
      error: { title: "Что-то пошло не так", description: "Попробуйте войти в свой аккаунт снова", destructive: true },
    }
  }
}

export const logOut = () => {
  cookies().delete("auth")
}
