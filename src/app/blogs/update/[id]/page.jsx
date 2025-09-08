import { UpdateBlogForm } from "@/components/blogs/update";
import { AdminProtection } from "@/components/auth/admin-protection";

export default async function UpdateBlogPage({ params }) {
  const { id } =await params;
  return (
    <AdminProtection>
      <div>
        <UpdateBlogForm id={id} />
      </div>
    </AdminProtection>
  );
}



