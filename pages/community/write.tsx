import type { NextPage } from "next"
import { Button, TextArea, Layout } from "components"
import { useForm } from "react-hook-form"
import useMutation from "libs/client/useMutation"
import { useEffect } from "react"
import { Post } from "@prisma/client"
import { useRouter } from "next/router"
import useCoords, { UseCoord } from "libs/client/useCoords"

type WriteForm = {
  question: string
}

type WriteFormWitheGEO = WriteForm & UseCoord

type WriteResponse = {
  ok: boolean
  post: Post
}

const Write: NextPage = () => {
  const { latitude, longitude } = useCoords()

  const { register, handleSubmit } = useForm<WriteForm>()
  const [post, { loading, data }] = useMutation<
    WriteFormWitheGEO,
    WriteResponse
  >("/api/posts")

  const onValid = (data: WriteForm) => {
    if (loading) return
    post({ ...data, latitude, longitude })
  }

  const router = useRouter()

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/community/${data.post.id}`)
    }
  }, [data, router])

  return (
    <Layout canGoBack title="Write Post">
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <TextArea
          register={register("question", { required: true, minLength: 5 })}
          placeholder="Ask a question!"
          required
        />
        <Button text={loading ? "Loading.." : "Submit"} />
      </form>
    </Layout>
  )
}

export default Write
