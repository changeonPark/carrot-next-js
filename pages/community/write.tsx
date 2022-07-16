import type { NextPage } from "next"
import { Button, TextArea, Layout } from "components/index"
import { useForm } from "react-hook-form"
import useMutation from "libs/client/useMutation"
import { useEffect } from "react"
import { Post } from "@prisma/client"
import { useRouter } from "next/router"

type WriteForm = {
  question: string
}

type WriteResponse = {
  ok: boolean
  post: Post
}

const Write: NextPage = () => {
  const { register, handleSubmit } = useForm<WriteForm>()
  const [post, { loading, data }] = useMutation<WriteForm, WriteResponse>(
    "/api/posts"
  )

  const onValid = (data: WriteForm) => {
    if (loading) return
    console.log(data)
    post(data)
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
