import { UpdateBlogForm } from "@/components/blogs/update";
import { AdminProtection } from "@/components/auth/admin-protection";

export default function UpdateBlogPage({ params }) {
  const { id } = params;
  return (
    <AdminProtection>
      <div>
        <UpdateBlogForm id={id} />
      </div>
    </AdminProtection>
  );
}



