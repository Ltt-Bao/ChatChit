import api from "@/lib/axios";

export const adminService = {
    getAllUsers: async () => {
        const res = await api.get("admin/users", {withCredentials: true});
        return res.data;
    },
    updateStatus: async (userId: string) => {
        const res = await api.patch(`admin/users/${userId}/status`);
        return res.data;
    }
}

