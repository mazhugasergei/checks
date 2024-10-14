import InitialLogIn from "@/components/auth/initial-login"
import Header from "@/components/header"
import { Toaster } from "@/components/ui/toaster"
import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: "Чеки",
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <div className="min-h-screen flex flex-col max-w-3xl space-y-4 p-4 mx-auto">
          <Header />
          {/* <UserInfo /> */}
          {children}
          <InitialLogIn />
          <Toaster />
        </div>
      </body>
    </html>
  )
}
