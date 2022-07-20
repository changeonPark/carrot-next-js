import type { NextPage } from "next"
import { Button, Input, Layout } from "components"
import { useForm } from "react-hook-form"
import { useEffect } from "react"
import useUser from "libs/client/useUser"
import useMutation from "libs/client/useMutation"
import { useRouter } from "next/router"

type EditProfileForm = {
  name?: string
  email?: string
  phone?: string
  formErrors?: string
}

type EditProfileResponse = {
  ok: boolean
  error?: string
}

const EditProfile: NextPage = () => {
  const { user } = useUser()
  const {
    register,
    setValue,
    handleSubmit,
    setError,
    formState: { errors },
    clearErrors,
  } = useForm<EditProfileForm>()

  const router = useRouter()

  const [editProfile, { data, loading }] = useMutation<
    EditProfileForm,
    EditProfileResponse
  >(`/api/users/me`, "PUT")

  const onValid = ({ email, phone, name }: EditProfileForm) => {
    if (loading) return
    if (email === "" && phone === "" && name === "") {
      return setError("formErrors", {
        message: "Email OR Phone number OR Name are required.",
      })
    }

    editProfile({ email, phone, name })
  }

  useEffect(() => {
    if (user?.name) setValue("name", user.name)
    if (user?.email) setValue("email", user.email)
    if (user?.phone) setValue("phone", user.phone)
  }, [user, setValue])

  useEffect(() => {
    if (data && !data.ok) {
      setError("formErrors", { message: data.error })
    }
  }, [data, setError])

  useEffect(() => {
    if (data && data.ok) {
      router.back()
    }
  }, [data, router])

  return (
    <Layout canGoBack title="Edit Profile">
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          <div className="w-14 h-14 rounded-full bg-slate-500" />
          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              id="picture"
              type="file"
              className="hidden"
              accept="image/*"
            />
          </label>
        </div>
        <Input
          register={register("name", {
            onBlur: () => clearErrors(),
          })}
          label="User Name"
          name="name"
          type="text"
        />
        <Input
          register={register("email", {
            onBlur: () => clearErrors(),
          })}
          label="Email address"
          name="email"
          type="email"
        />
        <Input
          register={register("phone", {
            onBlur: () => clearErrors(),
          })}
          label="Phone number"
          name="phone"
          type="number"
          kind="phone"
        />
        {errors.formErrors ? (
          <span className="my-2 text-red-600 text-center block">
            {errors.formErrors.message}
          </span>
        ) : null}
        <Button text={loading ? "Loading..." : "Update profile"} />
      </form>
    </Layout>
  )
}

export default EditProfile
