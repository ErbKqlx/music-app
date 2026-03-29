import http from '../http.js'

export function getUsers(){
    return http.get('/users')
}