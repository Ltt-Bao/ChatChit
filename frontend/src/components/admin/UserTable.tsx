import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown, Lock, Unlock } from "lucide-react";
import type { User } from "@/type/user";

interface UserTableProps {
  loading: boolean;
  users: User[];
  currentUser: any; 
  onToggleStatus: (userId: string, currentUsername: string) => void;
  sortConfig: { key: "username" | "displayName", direction: "asc" | "desc" };
  onSort: (key: "username" | "displayName") => void;
}

export default function UserTable({ loading, users, currentUser, onToggleStatus, sortConfig, onSort }: UserTableProps) {
  const renderSortIcon = (columnKey: "username" | "displayName") => {
    if (sortConfig.key !== columnKey) return <ArrowUpDown className="ml-1 h-4 w-4 inline text-muted-foreground opacity-50" />;
    return sortConfig.direction === "asc" 
      ? <ArrowUp className="ml-1 h-4 w-4 inline text-primary" /> 
      : <ArrowDown className="ml-1 h-4 w-4 inline text-primary" />;
  };
  return (
    <div className="bg-background rounded-lg shadow-sm border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-6 py-3 font-medium cursor-pointer hover:text-foreground transition-colors select-none"
                onClick={() => onSort("username")} >Tài khoản {renderSortIcon("username")}</th>
              <th className="px-6 py-3 font-medium cursor-pointer hover:text-foreground transition-colors select-none"
                onClick={() => onSort("displayName")}>Tên hiển thị {renderSortIcon("displayName")}</th>
              <th className="px-6 py-3 font-medium">Email</th>
              <th className="px-6 py-3 font-medium">Vai trò</th>
              <th className="px-6 py-3 font-medium">Trạng thái</th>
              <th className="px-6 py-3 font-medium text-right">Hành động</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {loading ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">Đang tải dữ liệu...</td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted-foreground">Không tìm thấy người dùng nào</td>
              </tr>
            ) : (
              users.map((u) => (
                <tr key={u._id} className="hover:bg-muted/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{u.username}</td>
                  <td className="px-6 py-4">{u.displayName}</td>
                  <td className="px-6 py-4">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role === 'admin' ? 'bg-purple-100 text-purple-700' : 
                        u.role === 'user' ? 'bg-blue-100 text-blue-700' : 
                        'bg-gray-100 text-gray-700'
                      }`}>
                      {u.role.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.isActive ? (
                      <span className="text-green-600 font-medium flex items-center gap-1"><Unlock className="h-3 w-3"/> Đang hoạt động</span>
                    ) : (
                      <span className="text-red-600 font-medium flex items-center gap-1"><Lock className="h-3 w-3"/> Bị khóa</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-right">
                    <Button
                      variant={u.isActive ? "destructive" : "default"}
                      size="sm"
                      onClick={() => onToggleStatus(u._id, u.username)}
                      disabled={u._id === currentUser?._id || u.username === 'admin'}
                    >
                      {u.isActive ? "Khóa" : "Mở khóa"}
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}