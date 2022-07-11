import { useState } from "react"

type Status<R> = {
  loading: boolean
  data?: R
  error?: any
}

const useMutation = <T, R>(url: string): [(data: T) => void, Status<R>] => {
  const [state, setState] = useState<Status<R>>({
    loading: false,
    data: undefined,
    error: undefined,
  })
  const mutation = (data: T) => {
    setState(prev => ({
      ...prev,
      loading: true,
    }))

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then(response => response.json().catch(() => {}))
      // .then((json) => setData(json))
      .then(data => setState(prev => ({ ...prev, data, loading: false })))
      .catch(error => setState(prev => ({ ...prev, error, loading: false })))
  }

  return [mutation, { ...state }]
}

export default useMutation
