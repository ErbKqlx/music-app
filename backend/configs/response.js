class Response{
    constructor(success, message){
        this.success = success
        this.message = message
    }

    static success(res, message = "Success", status = 200){
        const response = new Response(true, message)
        return res.status(status).json(new Response(true, message))
    }

    static error(res, message = "Error", status = 400){
        const response = new Response(false, message)
        return res.status(status).json(response)
    }

    static unauthorized(res, message = "Unauthorized"){
        return this.error(res, message, 401)
    }

    static forbidden(res, message = "Forbidden"){
        return this.error(res, message, 403)
    }

    static notFound(res, message = "Not Found"){
        return this.error(res, message, 404)
    }

    static serverError(res, message = "Internal Server Error", error = null){
        const response = new Response(false, message)
        return res.status(error.status || 500).json(response)
    }
}

export default Response