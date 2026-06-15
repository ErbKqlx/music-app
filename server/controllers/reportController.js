import { Op } from "sequelize";
import Response from "../configs/response.js";
import db from "../models/index.js";

const Report = db.report;
const User = db.user;
const Comment = db.comment;
const ReportType = db.report_type;
const ReportStatus = db.report_status

class ReportController {
    static async getCommentReports(req, res) {
        try {
            const reports = await Report.findAll({
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'email']
                    },
                    {
                        model: ReportType,
                        as: 'reportType',
                        attributes: ['id', 'name']
                    },
                    {
                        model: Comment,
                        as: 'comment',
                        attributes: ['id', 'text', 'id_user'] 
                    },
                    {
                        model: ReportStatus,
                        as: 'reportStatus',
                        attributes: ['id', 'name']
                    }
                ],
                order: [['created_at', 'DESC']]
            });
            
            return Response.success(res, "Жалобы на комментарии успешно получены", reports);
        } catch (error) {
            console.error("Ошибка в getCommentReports:", error);
            return Response.serverError(res, "Не удалось загрузить жалобы");
        }
    }

    static async updateReportStatus(req, res) {
        try {
            const { id } = req.params;
            const { id_status } = req.body;

            const statusExists = await ReportStatus.findByPk(id_status);
            if (!statusExists) {
                return Response.notFound(res, "Указанный статус жалобы не найден");
            }

            const report = await Report.findByPk(id);
            if (!report) {
                return Response.notFound(res, "Жалоба не найдена");
            }

            report.id_report_status = id_status;
            await report.save();

            if ((statusExists.name === 'Принята') && report.id_comment) {
                await Comment.destroy({ where: { id: report.id_comment } });
            }

            const updatedReport = await Report.findByPk(id, {
                include: [
                    {
                        model: User,
                        as: 'user',
                        attributes: ['id', 'username', 'email']
                    },
                    {
                        model: ReportType,
                        as: 'reportType',
                        attributes: ['id', 'name']
                    },
                    {
                        model: Comment,
                        as: 'comment',
                        attributes: ['id', 'text', 'id_user'] 
                    },
                    {
                        model: ReportStatus,
                        as: 'reportStatus',
                        attributes: ['id', 'name']
                    }
                ]
            });

            return Response.success(res, "Статус жалобы успешно обновлен", updatedReport);
        } catch (error) {
            console.error("Ошибка в updateReportStatus:", error);
            return Response.serverError(res, "Не удалось обновить статус жалобы");
        }
    }

    static async deleteReviewedReports(req, res) {
        try {
            const pending_status_id = 3;

            const deletedCount = await Report.destroy({
                where: {
                    id_report_status: {
                        [Op.ne]: pending_status_id
                    }
                }
            });

            return Response.success(
                res, 
                `Успешно удалено рассмотренных жалоб: ${deletedCount}`, 
                deletedCount
            );
        } catch (error) {
            console.error("Ошибка в deleteReviewedReports:", error);
            return Response.serverError(res, "Не удалось удалить рассмотренные жалобы");
        }
    }

    static async reportComment(req, res) {
        try {
            const { id } = req.params;
            const { id_report_type, text } = req.body;
            const id_user = req.userId;

            if (!id_report_type) {
                return Response.badRequest(res, "Не указан тип жалобы");
            }

            const reportTypeExists = await ReportType.findByPk(id_report_type);
            if (!reportTypeExists) {
                return res.status(404).json({ message: "Указанный тип жалобы не найден" });
            }

            const comment = await Comment.findByPk(id);
            if (!comment) {
                return res.status(404).json({ message: "Комментарий, на который вы жалуетесь, не найден" });
            }

            if (Number(comment.id_user) === Number(id_user)) {
                return res.status(400).json({ message: "Вы не можете отправить жалобу на свой собственный комментарий" });
            }

            const DEFAULT_PENDING_STATUS_ID = 3;
            
            const existingReport = await Report.findOne({
                where: {
                    id_comment: id,
                    id_user: id_user,
                    id_report_status: DEFAULT_PENDING_STATUS_ID 
                }
            });

            if (existingReport) {
                return res.status(409).json({ message: "Вы уже отправили жалобу на этот комментарий. Она находится на рассмотрении." });
            }

            const newReport = await Report.create({
                id_comment: id,
                id_user: id_user,
                id_report_type: id_report_type,
                id_report_status: DEFAULT_PENDING_STATUS_ID,
                text: text ? text.trim() : null,
                created_at: new Date(),
            });

            const reportWithIncludes = await Report.findByPk(newReport.id, {
                include: [
                    { model: User, as: 'user', attributes: ['id', 'username', 'email'] },
                    { model: ReportType, as: 'reportType', attributes: ['id', 'name'] },
                    { model: Comment, as: 'comment', attributes: ['id', 'text', 'id_user'] },
                    { model: ReportStatus, as: 'reportStatus', attributes: ['id', 'name'] }
                ]
            });

            return Response.success(res, "Жалоба успешно отправлена и будет рассмотрена модератором", reportWithIncludes);

        } catch (error) {
            console.error("Ошибка в reportComment:", error);
            return Response.serverError(res, "Не удалось отправить жалобу");
        }
    }
}

export default ReportController;