import type { GetStaticPaths, GetStaticPropsContext, NextPage } from "next";
import { Button, Layout } from "components";
import { useRouter } from "next/router";
import useSWR, { useSWRConfig } from "swr";
import { Product, User } from "@prisma/client";
import Link from "next/link";
import useMutation from "libs/client/useMutation";
import { cls } from "libs/client/utils";
import Image from "next/image";
import { GetStaticProps } from "next";
import client from "libs/server/client";

type ProductWithUser = Product & {
  user: User;
};

type ItemDetailResponse = {
  ok: boolean;
  product: ProductWithUser;
  relatedProducts: Product[];
  isLiked: Boolean;
};

const ItemDetail: NextPage<ItemDetailResponse> = ({ product, relatedProducts, isLiked }) => {
  const router = useRouter();
  const { mutate: unboundedMutate } = useSWRConfig();
  const { data, mutate: boundedMutate } = useSWR<ItemDetailResponse>(
    router.query.id ? `/api/products/${router.query.id}` : null
  );
  const [toggleFav] = useMutation(`/api/products/${router.query.id}/fav`);
  const onFavClick = () => {
    toggleFav({});
    if (!data) return;
    boundedMutate(prev => prev && { ...prev, isLiked: !prev.isLiked }, false);
    // unboundedMutate("/api/users/me", (prev: any) => ({ ok: !prev.ok }), false)
  };

  return (
    <Layout canGoBack seoTitle="Product">
      <div className="px-4  py-4">
        <div className="mb-8">
          {data?.product.image ? (
            <div className="relative h-96">
              <Image
                objectFit="cover"
                src={`https://imagedelivery.net/GxMj85p4NcJHzSbEXoeCfQ/${product.image}/public`}
                layout="fill"
                alt="product"
              />
            </div>
          ) : (
            <div className="h-96 bg-slate-300" />
          )}
          <div className="flex cursor-pointer py-3 border-t border-b items-center space-x-3">
            {data?.product.user.avatar ? (
              <Image
                width={48}
                height={48}
                className="w-12 h-12 rounded-full"
                src={`https://imagedelivery.net/GxMj85p4NcJHzSbEXoeCfQ/${product.user.avatar}/avatar`}
                alt="avatar"
              />
            ) : (
              <div className="w-12 h-12 rounded-full bg-slate-300" />
            )}

            <div>
              <p className="text-sm font-medium text-gray-700">{data ? data?.product.user.name : "Loading..."}</p>
              <Link href={`/users/profiles/${data?.product.user.id}`}>
                <a className="text-xs font-medium text-gray-500">View profile &rarr;</a>
              </Link>
            </div>
          </div>
          <div className="mt-5">
            <h1 className="text-3xl font-bold text-gray-900">{data ? product.name : "Loading..."}</h1>
            <span className="text-2xl block mt-3 text-gray-900">{data ? `$${product.price}` : "Loading..."}</span>
            <p className=" my-6 text-gray-700">{data ? product.description : "Loading..."}</p>
            <div className="flex items-center justify-between space-x-2">
              <Button large text="Talk to seller" />
              <button
                onClick={() => onFavClick()}
                className={cls(
                  "p-3 rounded-md flex items-center justify-center hover:bg-gray-100",
                  data?.isLiked ? "text-red-500 hover:text-red-500" : "text-gray-400 hover:text-gray-500"
                )}
              >
                {data?.isLiked ? (
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor">
                    <path
                      fillRule="evenodd"
                      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
                      clipRule="evenodd"
                    />
                  </svg>
                ) : (
                  <svg
                    className="h-6 w-6 "
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden="true"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Similar items</h2>
          <div className=" mt-6 grid grid-cols-2 gap-4">
            {data?.relatedProducts?.map(product => (
              <Link href={`/products/${product.id}`} key={product.id}>
                <a>
                  <div>
                    <div className="h-56 w-full mb-4 bg-slate-300" />
                    <h3 className="text-gray-700 -mb-1">{product.name}</h3>
                    <span className="text-sm font-medium text-gray-900">${product.price}</span>
                  </div>
                </a>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </Layout>
  );
};

export const getStaticPaths: GetStaticPaths = () => {
  return {
    paths: [],
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (ctx: GetStaticPropsContext) => {
  if (!ctx?.params?.id) {
    return {
      props: {},
    };
  }

  const id = ctx.params.id;

  const product = await client.product.findUnique({
    where: {
      id: +id.toString(),
    },
    include: {
      user: {
        select: {
          id: true,
          name: true,
          avatar: true,
        },
      },
    },
  });

  const terms = product?.name.split(" ").map(word => ({
    name: {
      contains: word,
    },
  }));

  let relatedProducts = null;

  if (terms) {
    relatedProducts = await client.product.findMany({
      where: {
        OR: terms[0],
        AND: {
          id: {
            not: product?.id,
          },
        },
      },
    });
    console.log("relatedProducts: ", relatedProducts);
  }

  // const isLiked = Boolean(
  //   await client.fav.findFirst({
  //     where: {
  //       productId: product?.id,
  //       userId: user.id,
  //     },
  //     select: {
  //       id: true,
  //     },
  //   })
  // )
  const isLiked = false;

  return {
    props: {
      product: JSON.parse(JSON.stringify(product)),
      relatedProducts: JSON.parse(JSON.stringify(relatedProducts)),
      isLiked,
    },
  };
};

export default ItemDetail;
