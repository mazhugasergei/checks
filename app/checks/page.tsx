import { redirect } from "next/navigation"
import { tokenLogIn } from "../actions/logging"

export default async function Checks() {
  const { user } = await tokenLogIn()
  if (user?.role !== "admin") redirect("/")

  return <div>Checks</div>
}
