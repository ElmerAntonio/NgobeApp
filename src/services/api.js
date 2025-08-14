export const getLessons = async () => [
  { id: 1, title: 'Saludos' },
  { id: 2, title: 'Números' }
];

// Llamada real a una API con axios
import axios from 'axios';

export const getDatos = async () => {
  try {
    const response = await axios.get('https://tu-api.com/endpoint');
    return response.data;
  } catch (error) {
    console.error(error);
    return null;
  }
};