import { Layout } from "components";
import { readdirSync } from "fs";
import matter from "gray-matter";
import { GetStaticProps, NextPage } from "next";
import remarkHtml from "remark-html";
import remarkParse from "remark-parse/lib";
import { unified } from "unified";

const Post: NextPage<{ post: string; data: any }> = ({ post, data }) => {
  return (
    <Layout canGoBack hasTabBar title={data.title} seoTitle={data.title}>
      <div className="blog-post-content" dangerouslySetInnerHTML={{ __html: post }}></div>
    </Layout>
  );
};

export function getStaticPaths() {
  // const files = readdirSync("./posts").map(file => {
  //   const [name, _] = file.split(".")
  //   return { params: { slug: name } }
  // })

  return {
    paths: [],
    fallback: "blocking",
  };
}

export const getStaticProps: GetStaticProps = async ctx => {
  const { content, data } = matter.read(`./posts/${ctx.params?.slug}.md`);
  console.log(content);
  const { value } = await unified().use(remarkParse).use(remarkHtml).process(content);

  return {
    props: {
      post: value,
      data,
    },
  };
};

export default Post;
