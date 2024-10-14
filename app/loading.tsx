import { LoaderCircle } from "lucide-react"

export default function Loading() {
  return (
    <div className="flex-1 flex items-center justify-center">
      <LoaderCircle className="animate-spin" />
    </div>
  )
}
