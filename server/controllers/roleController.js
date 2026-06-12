import Response from "../configs/response.js";
import db from "../models/index.js";

const Role = db.role

class RoleController{
    static async getRoles(req, res){
        try {
            const roles = await Role.findAll();
            
            return Response.success(res, "Роли успешно получены", roles);
        } catch (error) {
            console.error("Ошибка в getRoles:", error);
            return Response.serverError(res, "Не удалось загрузить роли");
        }
    }
}

export default RoleController