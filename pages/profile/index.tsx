import type { NextPage, NextPageContext } from "next";
import Link from "next/link";
import { Layout } from "components";
import useUser from "libs/client/useUser";
import useSWR, { SWRConfig } from "swr";
import { Review, User } from "@prisma/client";
import { cls } from "libs/client/utils";
import { withSsrSession } from "libs/server/withSession";
import client from "libs/server/client";
import { Suspense } from "react";
import dynamic from "next/dynamic";

const Reviews = dynamic(() => import("./Reviews"), { ssr: false });
const MiniProfile = dynamic(() => import("./MiniProfile"), { ssr: false });

const Profile: NextPage = () => {
  return (
    <Layout hasTabBar title="나의 캐럿" seoTitle="Profile">
      <div className="px-4">
        <Suspense fallback={<span>Loading...</span>}>
          <MiniProfile />
        </Suspense>
        <div className="mt-10 flex justify-around">
          <Link href="/profile/sold">
            <a className="flex flex-col items-center">
              <div className="w-14 h-14 text-white bg-orange-400 rounded-full flex items-center justify-center">
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
                    d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
                  ></path>
                </svg>
              </div>
              <span className="text-sm mt-2 font-medium text-gray-700">판매내역</span>
            </a>
          </Link>
          <Link href="/profile/bought">
            <a className="flex flex-col items-center">
              <div className="w-14 h-14 text-white bg-orange-400 rounded-full flex items-center justify-center">
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
                    d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
                  ></path>
                </svg>
              </div>
              <span className="text-sm mt-2 font-medium text-gray-700">구매내역</span>
            </a>
          </Link>
          <Link href="/profile/favorites">
            <a className="flex flex-col items-center">
              <div className="w-14 h-14 text-white bg-orange-400 rounded-full flex items-center justify-center">
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
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  ></path>
                </svg>
              </div>
              <span className="text-sm mt-2 font-medium text-gray-700">관심목록</span>
            </a>
          </Link>
        </div>
        <Suspense fallback={<span>Loading...</span>}>
          <Reviews />
        </Suspense>
      </div>
    </Layout>
  );
};

const Page: NextPage = () => {
  return (
    <SWRConfig
      value={{
        suspense: true,
      }}
    >
      <Profile />
    </SWRConfig>
  );
};

// export const getServerSideProps = withSsrSession(async function ({
//   req,
// }: NextPageContext) {
//   const profile = await client.user.findUnique({
//     where: { id: req?.session.user?.id },
//   })
//   return {
//     props: {
//       profile: JSON.parse(JSON.stringify(profile)),
//     },
//   }
// })

export default Page;
