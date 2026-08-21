// Använder miljövariabeln om den finns, annars localhost
export const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000'