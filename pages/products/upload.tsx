import type { NextPage } from "next"
import { Button, Input, Layout, TextArea } from "components/index"
import { useForm } from "react-hook-form"
import useMutation from "libs/client/useMutation"
import { useEffect } from "react"
import { Product } from "@prisma/client"
import { useRouter } from "next/router"

type UploadProductForm = {
  name: string
  price: number
  description: string
}

type UploadProductMutation = {
  ok: boolean
  product: Product
}

const Upload: NextPage = () => {
  const { register, handleSubmit } = useForm<UploadProductForm>()

  const [uploadProduct, { loading, data }] = useMutation<UploadProductForm, UploadProductMutation>(
    "/api/products"
  )
  const router = useRouter()

  const onValid = (data: UploadProductForm) => {
    if (loading) return
    uploadProduct(data)
  }

  useEffect(() => {
    if (data?.ok) {
      router.push(`/products/${data.product.id}`)
    }
  }, [data, router])

  return (
    <Layout canGoBack title="Upload Product">
      <form className="p-4 space-y-4" onSubmit={handleSubmit(onValid)}>
        <div>
          <label className="w-full cursor-pointer text-gray-600 hover:border-orange-500 hover:text-orange-500 flex items-center justify-center border-2 border-dashed border-gray-300 h-48 rounded-md">
            <svg
              className="h-12 w-12"
              stroke="currentColor"
              fill="none"
              viewBox="0 0 48 48"
              aria-hidden="true"
            >
              <path
                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <input className="hidden" type="file" />
          </label>
        </div>
        <Input
          required
          label="Name"
          name="name"
          type="text"
          register={register("name", { required: true })}
        />
        <Input
          required
          label="Price"
          placeholder="0.00"
          name="price"
          type="text"
          kind="price"
          register={register("price", { required: true })}
        />
        <TextArea
          required
          name="description"
          label="Description"
          register={register("description", { required: true })}
        />
        <Button text={loading ? "Loading..." : "Upload item"} />
      </form>
    </Layout>
  )
}

export default Upload
