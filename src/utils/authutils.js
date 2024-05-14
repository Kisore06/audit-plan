import { jwtDecode } from 'jwt-decode';
import Cookies from 'js-cookie';

export const isTokenExpired = () => {
    const token = Cookies.get('token');
    if (!token) {
        return true; // No token found, consider it expired
    }
    try {
        const decodedToken = jwtDecode(token);
        const currentTime = Date.now() / 1000;
        if (decodedToken.exp < currentTime) {
            return true; // Token is expired
        }
    } catch (err) {
        console.error('Error decoding token:', err);
        return true; // If there's an error decoding the token, consider it expired
    }
    return false; // Token is valid
};
