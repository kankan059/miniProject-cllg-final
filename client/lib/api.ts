import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL; 

// 1. Axios Instance Banana
const api = axios.create({
  baseURL: API_URL, 
  headers: {
    'Content-Type': 'application/json',
  },
});

//  Event Fetching Function
export const getEvents = async () => {
  try {
    // GET request to http://localhost/api/events
    const response = await api.get('/events'); 
    return response.data; // return array event
  } catch (error) {
    console.error("Error fetching events:", error);
    
    throw error;
  }
};

//  Single Event Fetching Function
export const getEventById = async (id: string) => {
  try {
    const response = await api.get(`/events/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching event ${id}:`, error);
    throw error;
  }
};


export default api;