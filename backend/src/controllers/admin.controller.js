import { success, error } from "../utils/response.js";
import * as AdminService from "../services/admin.service.js";

export const getRevenueStatsController = async (req, res) => {
  try {
    if (req.user.role !== "admin") return error(res, "Không có quyền truy cập", 403);

    const { type, year } = req.query;
    const data = await AdminService.getRevenueStats({ type, year });

    return success(res, "Thống kê doanh thu", data);
  } catch (err) {
    console.log(err.message);
    return error(res, 'Get revenue error', 500);
  }
};
