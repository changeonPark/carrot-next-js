import { User } from "@prisma/client"
import { useRouter } from "next/router"
import { useEffect } from "react"
import useSWR from "swr"

type UserResponse = {
  ok: boolean
  profile: User
}

const PUBLIC_LIST = ["/enter"]

const useUser = () => {
  const router = useRouter()
  const { data, error } = useSWR<UserResponse>(
    PUBLIC_LIST.includes(router.pathname) ? null : "/api/users/me"
  )

  useEffect(() => {
    console.log("useUser Effect")
    if (data && !data.ok) {
      console.log("useUser Replace")
      router.replace("/enter")
    }
  }, [data, router])

  return { user: data?.profile, isLoading: !data && !error }
}

export default useUser
