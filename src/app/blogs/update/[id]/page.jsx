import { UpdateBlogForm } from "@/components/blogs/update";

export default function UpdateBlogPage({ params }) {
  const { id } = params;
  return (
    <div>
      <UpdateBlogForm id={id} />
    </div>
  );
}



