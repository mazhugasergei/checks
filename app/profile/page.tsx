import { redirect } from "next/navigation"
import { tokenLogIn } from "../../components/forms/auth/logging.actions"

export default async function Profile() {
  const { user } = await tokenLogIn()
  if (!user) redirect("/login")

  return (
    <main>
      <pre>{JSON.stringify(user, null, 2)}</pre>
    </main>
  )
}
