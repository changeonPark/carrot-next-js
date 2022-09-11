import { Layout } from "components"
import { readdirSync, readFileSync } from "fs"
import matter from "gray-matter"
import { NextPage } from "next"

type Posts = {
  title: string
  date: string
  category: string
}

const Blog: NextPage<{ posts: Posts[] }> = ({ posts }) => {
  return (
    <Layout title="Blog" seoTitle="Blog" canGoBack>
      <h1 className="font-semibold text-xl mb-5">Latest Posts</h1>
      <ul>
        {posts.map((post, index) => (
          <li key={index} className="mb-5">
            <h2 className="text-lg text-red-500">{post.title}</h2>
            <h3>
              {post.date} / {post.category}
            </h3>
          </li>
        ))}
      </ul>
    </Layout>
  )
}

export async function getStaticProps() {
  const posts = readdirSync("posts").map(file => {
    const content = readFileSync(`./posts/${file}`, "utf-8")
    return matter(content).data
  })
  console.log(posts)
  return {
    props: {
      posts,
    },
  }
}

export default Blog
