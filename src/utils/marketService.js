const BASE_URL = 'http://localhost:5001/api';

export const marketService = {
    getTrends: async () => {
        try {
            const response = await fetch(`${BASE_URL}/trends`);
            if (!response.ok) throw new Error('Failed to fetch trends');
            return await response.json();
        } catch (error) {
            console.error('Market Service Error:', error);
            throw error;
        }
    },

    getForecast: async (cropName) => {
        try {
            const response = await fetch(`${BASE_URL}/forecast/${cropName}`);
            if (!response.ok) throw new Error(`Failed to fetch forecast for ${cropName}`);
            return await response.json();
        } catch (error) {
            console.error('Market Service Error:', error);
            throw error;
        }
    }
};
