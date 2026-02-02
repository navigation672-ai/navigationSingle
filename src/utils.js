import CryptoJS from 'crypto-js';

const SECRET_KEY = "your-very-secret-key-do-not-expose-in-production";
const TOKEN_MAX_AGE = 30 * 60 * 1000; // 30 minutes in milliseconds

// Simple token generation using timestamp
export const generateToken = (dept) => {
    const tokenData = {
        dept: dept,
        timestamp: Date.now(),
        expiry: Date.now() + TOKEN_MAX_AGE
    };
    const tokenString = JSON.stringify(tokenData);
    return CryptoJS.AES.encrypt(tokenString, SECRET_KEY).toString();
};

export const validateToken = (token, dept) => {
    try {
        const bytes = CryptoJS.AES.decrypt(token, SECRET_KEY);
        const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
        
        // Check if token is expired
        if (Date.now() > decryptedData.expiry) {
            return false;
        }
        
        // Check if department matches
        if (decryptedData.dept !== dept) {
            return false;
        }
        
        return true;
    } catch (error) {
        return false;
    }
};

// Department data
export const EAST_LAND_DEPARTMENTS = {
    "project_planning": "13.2057989,80.3209443",
    "shop_vii": "13.2062904,80.3207080",
    "shop_vi": "13.2099126,80.3209142",
    "shop_v": "13.2086706,80.3205279",
    "shop_iv": "13.2070161,80.3203764",
    "ev_shop": "13.2075096,80.3191446",
    "hrd_centre": "13.2068653,80.3192841",
    "canteen": "13.2066567,80.3192250",
    "central_quality_office": "13.2064706,80.3196311",
    "field_quality_centre": "13.206572069601032,80.31957997029414",
    "defense_sourcing": "13.2057989,80.3209443",
};

export const EAST_LAND_DISPLAY = {
    "project_planning": "Project Planning",
    "shop_vii": "Shop VII",
    "shop_vi": "Shop VI",
    "shop_v": "Shop V",
    "shop_iv": "Shop IV",
    "ev_shop": "EV Shop",
    "hrd_centre": "HRD Centre",
    "canteen": "Canteen",
    "central_quality_office": "Central Quality Office",
    "field_quality_centre": "Field Quality Centre",
    "defense_sourcing": "Defense Sourcing",
};



// Mappls navigation URL generator
export const generateMapplsURL = (deptCode, token) => {
    const deptName = EAST_LAND_DISPLAY[deptCode];
    const deptCoords = EAST_LAND_DEPARTMENTS[deptCode];
    
    if (!deptName || !deptCoords) return '#';
    
    const [lat, lon] = deptCoords.split(',');
    const encodedName = encodeURIComponent(deptName);
    return `https://mappls.com/navigation?places=${lat.trim()},${lon.trim()},${encodedName}&isNav=true&mode=driving&token=${token}`;
};











