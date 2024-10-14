import { clsx, type ClassValue } from "clsx"
import crypto from "crypto"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => {
  return twMerge(clsx(inputs))
}

export const hashPassword = (password: string) => {
  const salt = crypto.randomBytes(16).toString("hex")
  const hash = crypto.scryptSync(password, salt, 64).toString("hex")
  return `${salt}:${hash}`
}

export const verifyPassword = (password: string, storedHash: string) => {
  const [salt, hash] = storedHash.split(":")
  const hashToVerify = crypto.scryptSync(password, salt, 64).toString("hex")
  return hash === hashToVerify
}
