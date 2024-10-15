import { redirect } from "next/navigation"
import { tokenLogIn } from "../actions/logging"

export default async function Profile() {
  const { user } = await tokenLogIn()
  if (!user) redirect("/login")

  return (
    <main>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </main>
  )
}
