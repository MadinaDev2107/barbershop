import Link from "next/link";
import "bootstrap/dist/css/bootstrap.min.css";

const Sidebar = () => {
  return (
    <div
      className="d-flex flex-column bg-light p-3"
      style={{ width: "250px", height: "100vh" }}
    >
      <h2 className="text-center mb-4">Admin Panel</h2>
      <Link href={"/admin/book"} className="btn btn-success mb-2 w-100">
        Book
      </Link>
      <Link href={"/admin/masters"} className="btn btn-success mb-2 w-100">
        Masters
      </Link>
      <Link href={"/admin/skills"} className="btn btn-success mb-2 w-100">
        Skills
      </Link>
    </div>
  );
};

export default Sidebar;
