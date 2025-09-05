import { UpdateBlogForm } from "@/components/blogs/update";

export default async function UpdateBlogPage({ params }) {
  const { id } =await params;
  return (
    <div>
      <UpdateBlogForm id={id} />
    </div>
  );
}



