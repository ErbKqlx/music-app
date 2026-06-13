import Response from "../configs/response.js";
import db from "../models/index.js";

const Report = db.report

class ReportController{
    static async getReports(req, res){
        try {
            const reports = await Report.findAll();
            
            return Response.success(res, "Жалобы успешно получены", reports);
        } catch (error) {
            console.error("Ошибка в getReports:", error);
            return Response.serverError(res, "Не удалось загрузить жалобы");
        }
    }


}

export default ReportController