import { useEffect, useState } from "react";
import { toast } from "sonner";
import { adminService } from "@/services/adminService";
import Logout from "@/components/auth/Logout";
import { useAuthStore } from "@/stores/useAuthStore";
import { UserCog } from "lucide-react";
import type { User } from "@/type/user";
import DashboardToolbar from "@/components/admin/DashboardToolbar";
import UserTable from "@/components/admin/UserTable";
import Pagination from "@/components/admin/Pagination";

const DashboardPage = () => {
  const { user: currentUser } = useAuthStore();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  // States cho Filter, Sort và Pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  // Lưu cục sort gồm: Cột nào đang sort, và chiều nào (asc/desc)
  const [sortConfig, setSortConfig] = useState<{ key: "username" | "displayName", direction: "asc" | "desc" }>({
    key: "displayName", // Mặc định sort theo tên hiển thị
    direction: "asc"
  });
  const [currentPage, setCurrentPage] = useState(1);
  const usersPerPage = 5; // Số user trên 1 trang

  // Hàm xử lý khi click vào tiêu đề cột
  const handleSort = (key: "username" | "displayName") => {
    setSortConfig((prev) => ({
      key,
      // Nếu đang click vào cột hiện tại mà là asc thì đổi thành desc, còn cột khác thì mặc định là asc
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };
  // Gọi API lấy dữ liệu
  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await adminService.getAllUsers();
      setUsers(data.users || []);
    } catch (error) {
      console.error(error);
      toast.error("Không thể tải danh sách người dùng");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Xử lý Khóa/Mở khóa
  const handleToggleStatus = async (userId: string, currentUsername: string) => {
    if (userId === currentUser?._id) {
      toast.error("Ní không thể tự khóa mình được đâu =))");
      return;
    }
    if (currentUsername === 'superadmin') {
      toast.error("Không thể đụng vào tài khoản tối cao!");
      return;
    }

    try {
      const data = await adminService.updateStatus(userId);
      toast.success(data.message);

      setUsers((prevUsers) =>
        prevUsers.map((u) =>
          u._id === userId ? { ...u, isActive: !u.isActive } : u
        )
      );
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Lỗi khi cập nhật trạng thái");
    }
  };

  // --- LOGIC FILTER & SORT & PAGINATION ---
  const filteredUsers = users.filter((u) => {
    // Dùng || "" để nếu field nào bị undefined thì nó tự biến thành chuỗi rỗng, không bị crash
    const name = u.displayName || "";
    const uname = u.username || "";
    const mail = u.email || "";
    const search = (searchTerm || "").toLowerCase();

    // Lọc theo search term
    const matchesSearch = name.toLowerCase().includes(search) ||
      uname.toLowerCase().includes(search) ||
      mail.toLowerCase().includes(search);

    // Lọc theo Role
    const matchesRole = roleFilter === "all" || u.role === roleFilter;

    // Lọc theo Status
    const matchesStatus = statusFilter === "all" || 
      (statusFilter === "active" ? u.isActive === true : u.isActive === false);

    return matchesSearch && matchesRole && matchesStatus;
  });

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    let valA = "";
    let valB = "";

    // Lấy dữ liệu tùy theo cột đang được sort
    if (sortConfig.key === "username") {
      valA = (a.username || "").toLowerCase();
      valB = (b.username || "").toLowerCase();
    } else {
      valA = (a.displayName || a.username || "").toLowerCase();
      valB = (b.displayName || b.username || "").toLowerCase();
    }

    // Đảo chiều tùy theo direction
    if (sortConfig.direction === "asc") return valA.localeCompare(valB);
    return valB.localeCompare(valA);
  });

  const totalPages = Math.ceil(sortedUsers.length / usersPerPage);
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedUsers.slice(indexOfFirstUser, indexOfLastUser);


  return (
    <div className="min-h-screen bg-muted/30 p-8">
      <div className="max-w-6xl mx-auto space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight flex items-center gap-2">
              <UserCog className="h-8 w-8" />
              Quản Lý Người Dùng
            </h1>
            <p className="text-muted-foreground mt-1">
              Dashboard dành riêng cho Admin thao tác
            </p>
          </div>
          {/* Nút đăng xuất */}
          <div className="hover:bg-fuchsia-300">
            <Logout />
          </div>
        </div>

        {/* Toolbar */}
        <DashboardToolbar
          searchTerm={searchTerm}
          onSearchChange={(val) => { setSearchTerm(val); setCurrentPage(1); }}
          roleFilter={roleFilter}
          onRoleFilterChange={(val) => { setRoleFilter(val); setCurrentPage(1); }}
          statusFilter={statusFilter}
          onStatusFilterChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
        />

        {/* Table */}
        <UserTable
          loading={loading}
          users={currentUsers}
          currentUser={currentUser}
          onToggleStatus={handleToggleStatus}
          sortConfig={sortConfig}
          onSort={handleSort}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
          loading={loading}
        />

      </div>
    </div>
  );
};

export default DashboardPage;