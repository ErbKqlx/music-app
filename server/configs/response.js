class Response{
    // constructor(success, message){
    //     this.success = success
    //     this.message = message
    // }

    static success(res, message = "Успех", data = null){
        // const response = new Response(true, message)
        return res.status(200).json({
            status: 'success',
            message: message,
            data: data,
        })
    }

    static badRequest(res, message = "Ошибка", errors = null){
        return res.status(400).json({
            status: 'error',
            message: message,
            errors: errors,
        })
    }

    static unauthorized(res, message = "Не авторизован"){
        return res.status(401).json({
            status: 'error',
            message: message,
        })
    }

    static forbidden(res, message = "Доступ запрещен"){
        return res.status(403).json({
            status: 'error',
            message: message,
        })
    }

    static notFound(res, message = "Ресурс не найден"){
        return res.status(404).json({
            status: 'error',
            message: message,
        })
    }

    static serverError(res, message = "Внутренняя ошибка сервера"){
        return res.status(500).json({
            status: 'error',
            message: message,
        })
    }
}

export default Response