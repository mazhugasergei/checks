import { redirect } from "next/navigation"
import { tokenLogIn } from "../actions/logging.actions"
import ChecksTable from "./checks-table"

export default async function Checks() {
  const { user } = await tokenLogIn()
  if (!user) redirect("/login")

  return (
    <main>
      <section>
        <h1 className="font-bold text-xl mb-2">Расходники</h1>
        <ChecksTable />
      </section>
    </main>
  )
}
