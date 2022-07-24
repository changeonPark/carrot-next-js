import { useEffect } from "react"

const useInfinityScroll = (
  target: HTMLDivElement | null,
  callback: IntersectionObserverCallback
) => {
  useEffect(() => {
    let observer: IntersectionObserver

    if (target) {
      observer = new IntersectionObserver(callback, {
        threshold: 0.4,
        rootMargin: "50px",
      })
      observer.observe(target)
    }

    return () => observer && observer.disconnect()
  }, [target, callback])
}

export default useInfinityScroll
