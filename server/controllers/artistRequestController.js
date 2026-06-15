import Response from "../configs/response.js";
import db from "../models/index.js";
import { literal } from "sequelize";
import { getFileUrl } from "../utils/fileHelper.js";

const Artist = db.artist;
const ArtistRequest = db.artist_request
const RequestStatus = db.request_status
const User = db.user;

const RECAPTCHA_SECRET = '6Lcc1yAtAAAAABH1BuKAHwBo1MfpwY1AZJLjWDAv';

class ArtistRequestController {
    
    // static async getRequests(req, res){
    //     try{
            
    //     }
    //     catch (error) {
    //         console.error("Ошибка при выводе заявок:", error);
    //         return Response.serverError(res, "Не удалось вывести заявки");
    //     }
    // }

    static async createRequest(req, res) {
        try {
            const id_user = req.userId;
            const { name, bio, captchaToken } = req.body;

            if (!captchaToken) {
                return res.status(400).json({ message: "Необходимо пройти проверку на робота" });
            }

            const googleVerifyUrl = `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA_SECRET}&response=${captchaToken}`;

            const response = await fetch(googleVerifyUrl, { method: 'POST' });
            const captchaResult = await response.json();

            if (!captchaResult.success) {
                return res.status(400).json({ message: "Проверка на робота не пройдена. Попробуйте еще раз." });
            }

            if (!name || !name.trim()) {
                return res.status(400).json({ message: "Укажите псевдоним исполнителя" });
            }


            const PENDING_STATUS = 3;
            const existingRequest = await ArtistRequest.findOne({
                where: { id_user, id_request_status: PENDING_STATUS }
            });

            if (existingRequest) {
                return res.status(409).json({ message: "Ваша заявка уже находится на рассмотрении модератором" });
            }

            const alreadyArtist = await Artist.findOne({ where: { id_user } });
            if (alreadyArtist) {
                return res.status(400).json({ message: "Вы уже являетесь исполнителем" });
            }

            const newRequest = await ArtistRequest.create({
                id_user,
                name: name.trim(),
                bio: bio && bio.trim() ? bio.trim() : null,
                id_request_status: PENDING_STATUS
            });

            return Response.success(res, "Заявка успешно отправлена на модерацию", newRequest);
        } catch (error) {
            console.error("Ошибка при создании заявки:", error);
            return Response.serverError(res, "Не удалось отправить заявку");
        }
    }

    static async approveRequest(req, res) {
        try {
            const { id } = req.params;
            
            const request = await ArtistRequest.findByPk(id);
            if (!request) {
                return res.status(404).json({ message: "Заявка не найдена" });
            }

            if (request.id_request_status !== 3) {
                return res.status(400).json({ message: "Эта заявка уже была обработана" });
            }

            const newArtist = await Artist.create({
                id_user: request.id_user,
                name: request.name,
                bio: request.bio,
            });

            const APPROVED_STATUS = 1; 
            request.id_request_status = APPROVED_STATUS;
            await request.save();

            return Response.success(res, "Заявка успешно одобрена, исполнитель создан", newArtist);
        } catch (error) {
            console.error("Ошибка при одобрении заявки:", error);
            return Response.serverError(res, "Ошибка при обработке заявки");
        }
    }
}

export default ArtistRequestController;