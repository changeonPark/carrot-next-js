import { FieldErrors, useForm } from "react-hook-form"

type LoginForm = {
  username: string
  password: string
  email: string
}

const Forms = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginForm>({
    mode: "onChange",
  })

  const onValid = (data: LoginForm) => {
    console.log("is valid")
  }

  const onInvalid = (errors: FieldErrors) => {
    console.log(errors)
  }

  return (
    <form onSubmit={handleSubmit(onValid, onInvalid)}>
      <input
        {...register("username", {
          required: "Username is required",
          minLength: {
            message: "5글자 이상 적으세용",
            value: 5,
          },
        })}
        type="text"
        placeholder="Username"
      />
      <input
        {...register("email", {
          required: "Email is required",
          validate: {
            notNaver: value =>
              !value.includes("@naver.com") || "네이버 입뺀 ㅅㄱ",
          },
        })}
        type="email"
        placeholder="Email"
      />
      {errors.email?.message}
      <input
        {...register("password", { required: "Password is required" })}
        type="password"
        placeholder="Password"
      />
      <input type="submit" value="Create Account" />
    </form>
  )
}

export default Forms
