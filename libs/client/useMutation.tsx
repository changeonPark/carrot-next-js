import { useState } from "react"

type Status<T> = {
  loading: boolean
  data: T | undefined
  error: any | undefined
}

const useMutation = <T,>(url: string): [(data: T) => void, Status<any>] => {
  const [state, setState] = useState<Status<any>>({
    loading: false,
    data: undefined,
    error: undefined,
  })
  const [loading, setLoading] = useState(false)
  const [data, setData] = useState<any | undefined>(undefined)
  const [error, setError] = useState<any | undefined>(undefined)
  const mutation = (data: T) => {
    setLoading(true)

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json().catch(() => {}))
      // .then((json) => setData(json))
      .then(setData)
      .catch(setError)
      .finally(() => setLoading(false))
  }

  return [mutation, { loading, data, error }]
}

export default useMutation
