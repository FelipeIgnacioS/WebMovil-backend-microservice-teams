import axios from 'axios';


export interface UserDetail {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  nickname: string;
}

export const fetchUserDetails = async (userIds: number[]): Promise<UserDetail[]> => {
  try {
    
    const URLMS = process.env.URLMS
    const response = await axios.post(`${URLMS}/get-users`, userIds);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error('Error en la solicitud al microservicio de autenticación: ' + error.message);
    } else {
      throw new Error('Error interno del servidor');
    }
  }
};
