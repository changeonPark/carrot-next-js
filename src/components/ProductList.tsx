import useSWR from "swr"
import { ProductWithCount } from "../../pages"
import Item from "./Item"

type Record = {
  id: number
  product: ProductWithCount
}

type ProductType = {
  [key: string]: Record[]
}

type ProductListResponse = ProductType & {
  ok: boolean
}

type Props = {
  kind: "favs" | "sales" | "purchases"
}

const ProductList = ({ kind }: Props) => {
  const { data } = useSWR<ProductListResponse>(`/api/users/me/${kind}`)

  if (data && data.ok) {
    return (
      <>
        {data[kind].map(record => (
          <Item
            id={record.product.id}
            key={record.id}
            title={record.product.name}
            price={record.product.price}
            comments={1}
            hearts={record.product._count.favs}
          />
        ))}
      </>
    )
  }

  return null
}

export default ProductList
