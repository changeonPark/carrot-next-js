import type { NextPage } from "next"
import { Item, Layout } from "components"
import ProductList from "components/ProductList"

const Bought: NextPage = () => {
  return (
    <Layout title="구매내역" canGoBack seoTitle="Bought">
      <div className="flex flex-col space-y-5 pb-10  divide-y">
        <ProductList kind="purchases" />
      </div>
    </Layout>
  )
}

export default Bought
