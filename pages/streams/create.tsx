import type { NextPage } from "next"
import { Button, Input, Layout, TextArea } from "components"
import { useForm } from "react-hook-form"
import useMutation from "libs/client/useMutation"
import { useEffect } from "react"
import { useRouter } from "next/router"
import { Stream } from "@prisma/client"

type CreateForm = {
  name: string
  price: number
  description: string
}

type CreateResponse = {
  ok: boolean
  stream: Stream
}

const Create: NextPage = () => {
  const [createStream, { data, loading }] = useMutation<
    CreateForm,
    CreateResponse
  >(`/api/streams`)
  const router = useRouter()

  const { register, handleSubmit } = useForm<CreateForm>()

  const onValid = (form: CreateForm) => {
    if (loading) return
    createStream(form)
  }

  useEffect(() => {
    if (data && data.ok) {
      router.push(`/streams/${data.stream.id}`)
    }
  }, [data, router])

  return (
    <Layout canGoBack title="Go Live">
      <form onSubmit={handleSubmit(onValid)} className=" space-y-4 py-10 px-4">
        <Input
          register={register("name", { required: true })}
          label="Name"
          name="name"
          type="text"
        />
        <Input
          register={register("price", { required: true, valueAsNumber: true })}
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
        />
        <TextArea
          register={register("description", { required: true })}
          name="description"
          label="Description"
        />
        <Button text={loading ? "Loading..." : "Go live"} />
      </form>
    </Layout>
  )
}

export default Create
