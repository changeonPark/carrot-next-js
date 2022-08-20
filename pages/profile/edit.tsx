import type { NextPage } from "next"
import { Button, Input, Layout } from "components"
import { useForm } from "react-hook-form"
import { useEffect, useState } from "react"
import useUser from "libs/client/useUser"
import useMutation from "libs/client/useMutation"
import { useRouter } from "next/router"

type EditProfileForm = {
  name?: string
  email?: string
  phone?: string
  avatar?: FileList
  avatarId?: string
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
    watch,
  } = useForm<EditProfileForm>()

  const router = useRouter()

  const [editProfile, { data, loading }] = useMutation<
    EditProfileForm,
    EditProfileResponse
  >(`/api/users/me`, "PUT")

  const onValid = async ({ email, phone, name, avatar }: EditProfileForm) => {
    if (loading) return

    if (email === "" && phone === "" && name === "") {
      return setError("formErrors", {
        message: "Email OR Phone number OR Name are required.",
      })
    }

    if (avatar && avatar.length > 0) {
      const { uploadURL } = await (await fetch(`/api/files`)).json()

      const form = new FormData()
      form.append("file", avatar[0], String(user?.id))

      const {
        result: { id },
      } = await (
        await fetch(uploadURL, {
          method: "POST",
          body: form,
        })
      ).json()

      editProfile({ email, phone, name, avatar, avatarId: id })
    } else {
      editProfile({ email, phone, name })
    }
  }

  const [avatarPreview, setAvatarPreview] = useState<string>("")

  useEffect(() => {
    const subscription = watch((value, { name, type }) => {
      if (name === "avatar" && type === "change" && value.avatar) {
        const file = value.avatar[0]
        setAvatarPreview(URL.createObjectURL(file))
      }
    })
    return () => subscription.unsubscribe()
  }, [watch])

  useEffect(() => {
    if (user?.name) setValue("name", user.name)
    if (user?.email) setValue("email", user.email)
    if (user?.phone) setValue("phone", user.phone)
    if (user?.avatar)
      setAvatarPreview(
        `https://imagedelivery.net/GxMj85p4NcJHzSbEXoeCfQ/${user.avatar}/avatar`
      )
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
    <Layout canGoBack title="Edit Profile" seoTitle="Profile">
      <form onSubmit={handleSubmit(onValid)} className="py-10 px-4 space-y-4">
        <div className="flex items-center space-x-3">
          {avatarPreview ? (
            <img
              src={avatarPreview}
              className="w-14 h-14 rounded-full bg-slate-500"
            />
          ) : (
            <div className="w-14 h-14 rounded-full bg-slate-500" />
          )}

          <label
            htmlFor="picture"
            className="cursor-pointer py-2 px-3 border hover:bg-gray-50 border-gray-300 rounded-md shadow-sm text-sm font-medium focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 text-gray-700"
          >
            Change
            <input
              {...register("avatar")}
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
