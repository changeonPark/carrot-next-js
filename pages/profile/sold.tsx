import type { NextPage } from "next"
import { Item, Layout } from "components"
import ProductList from "components/ProductList"

const Sold: NextPage = () => {
  return (
    <Layout title="판매내역" canGoBack seoTitle="Sold">
      <div className="flex flex-col space-y-5 pb-10  divide-y">
        <ProductList kind="sales" />
      </div>
    </Layout>
  )
}

export default Sold
