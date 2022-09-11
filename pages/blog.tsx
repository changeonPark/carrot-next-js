import { Layout } from "components"

const Blog = () => {
  return (
    <Layout title="Blog" seoTitle="Blog" canGoBack>
      <h1 className="font-semibold text-lg">Latest Posts</h1>
      <ul>
        <li>Welcome everyone!</li>
      </ul>
    </Layout>
  )
}

export default Blog
