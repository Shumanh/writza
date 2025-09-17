import { IndividualBlog } from "@/components/blogs/individual-blog";

export default async function BlogPage({ params }) {
  const { slug } = await   params;  
  
  const id = slug.split('-').pop();  
  
  return (
    <div>
      <IndividualBlog id={id} />
    </div>
  );
}