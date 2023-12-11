import axios from "axios";



export const fetchUserId = async (email: string) => {
    try {
        const URLMS = process.env.URLMS
        
        const response = await axios.get(`${URLMS}/email/${email}`);
        return response.data.id;
    } catch (error) {
        if (axios.isAxiosError(error)) {
        throw new Error('Error en la solicitud al microservicio de autenticación: ' + error.message);
        } else {
        throw new Error('Error interno del servidor');
        }
    }
}