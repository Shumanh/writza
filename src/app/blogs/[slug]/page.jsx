import { IndividualBlog } from "@/components/blogs/individual-blog";

export default async function BlogPage({ params }) {
  const { slug } = params;
  const id = typeof slug === 'string' ? slug.split('-').pop() : '';

  return (
    <div>
      <IndividualBlog id={id} />
    </div>
  );
}