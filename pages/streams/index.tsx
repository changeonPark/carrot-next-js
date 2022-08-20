import type { NextPage } from "next"
import Link from "next/link"
import { FloatingButton, Layout } from "components"
import { Stream } from "@prisma/client"
import useSWR from "swr"
import { useCallback, useEffect, useRef, useState } from "react"
import useInfinityScroll from "libs/client/useInfinityScroll"

type StreamsResponse = {
  ok: boolean
  streams: Stream[]
}

const Streams: NextPage = () => {
  const [page, setPage] = useState(1)
  const [showData, setShowData] = useState<Stream[]>([])
  const ref = useRef<HTMLDivElement>(null)
  const { data } = useSWR<StreamsResponse>(`/api/streams?page=${page}`)

  const getNextPage: IntersectionObserverCallback = useCallback(
    (entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) setPage(prev => prev + 1)
      })
    },
    []
  )
  useInfinityScroll(ref.current, getNextPage)

  useEffect(() => {
    if (!data?.streams) return
    setShowData(prev => [...prev, ...data.streams])
  }, [data?.streams])

  return (
    <Layout hasTabBar title="라이브" seoTitle="Live">
      <div className=" divide-y-[1px] space-y-4">
        {showData.map(stream => (
          <Link key={stream.id} href={`/streams/${stream.id}`}>
            <a className="pt-4 block  px-4">
              <div className="w-full rounded-md shadow-sm bg-slate-300 aspect-video" />
              <h1 className="text-2xl mt-2 font-bold text-gray-900">
                {stream.name}
              </h1>
            </a>
          </Link>
        ))}
        <div ref={ref}></div>
        <FloatingButton href="/streams/create">
          <svg
            className="w-6 h-6"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
            ></path>
          </svg>
        </FloatingButton>
      </div>
    </Layout>
  )
}

export default Streams
