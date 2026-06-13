import Response from "../configs/response.js";
import db from "../models/index.js";

const ReportType = db.report_type;

class ReportTypeController {
    static async getReportTypes(req, res) {
        try {
            const reportTypes = await ReportType.findAll({ order: [['id', 'ASC']] });
            return Response.success(res, "Типы жалоб успешно получены", reportTypes);
        } catch (error) {
            console.error("Ошибка в getReportTypes:", error);
            return Response.serverError(res, "Не удалось загрузить типы жалоб");
        }
    }

    static async addReportType(req, res) {
        try {
            const { name } = req.body;
            if (!name || !name.trim()) {
                return Response.badRequest(res, "Название типа жалобы обязательно");
            }

            const newType = await ReportType.create({ name: name.trim() });
            return Response.success(res, "Тип жалобы успешно добавлен", newType);
        } catch (error) {
            console.error("Ошибка в addReportType:", error);
            return Response.serverError(res, "Не удалось добавить тип жалобы");
        }
    }

    static async updateReportType(req, res) {
        try {
            const { id } = req.params;
            const { name } = req.body;

            if (!name || !name.trim()) {
                return Response.badRequest(res, "Название типа жалобы не может быть пустым");
            }

            const reportType = await ReportType.findByPk(id);
            if (!reportType) {
                return Response.notFound(res, "Тип жалобы не найден");
            }

            reportType.name = name.trim();
            await reportType.save();

            return Response.success(res, "Тип жалобы успешно обновлен", reportType);
        } catch (error) {
            console.error("Ошибка в updateReportType:", error);
            return Response.serverError(res, "Не удалось обновить тип жалобы");
        }
    }
    
    static async deleteReportType(req, res) {
        try {
            const { id } = req.params;

            const reportType = await ReportType.findByPk(id);
            if (!reportType) {
                return Response.notFound(res, "Тип жалобы не найден");
            }

            await reportType.destroy();
            return Response.success(res, "Тип жалобы успешно удален", reportType);
        } catch (error) {
            console.error("Ошибка в deleteReportType:", error);
            
            if (error.name === 'SequelizeForeignKeyConstraintError') {
                return Response.badRequest(res, "Нельзя удалить тип жалобы, так как существуют связанные с ним жалобы");
            }
            return Response.serverError(res, "Не удалось удалить тип жалобы");
        }
    }
}

export default ReportTypeController;