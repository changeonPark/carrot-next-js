import { useState } from "react"

type Status<T> = {
  loading: boolean
  data?: T
  error?: any
}

const useMutation = <T,>(url: string): [(data: T) => void, Status<any>] => {
  const [state, setState] = useState<Status<any>>({
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
