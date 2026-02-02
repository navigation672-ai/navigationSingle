import React, { useEffect, useState } from 'react';
import { validateToken, generateMapplsURL } from '../utils';
import { useSearchParams } from 'react-router-dom';

const TokenValidator = () => {
    const [searchParams] = useSearchParams();
    const [isValid, setIsValid] = useState(false);
    const [error, setError] = useState('');
    const [redirecting, setRedirecting] = useState(false);

    useEffect(() => {
        const token = searchParams.get('token');
        const dept = searchParams.get('dept');

        if (!token || !dept) {
            setError('Invalid navigation link. Missing parameters.');
            return;
        }

        const isValidToken = validateToken(token, dept);
        
        if (isValidToken) {
            setIsValid(true);
            // Redirect after 2 seconds
            setTimeout(() => {
                setRedirecting(true);
                const mapplsURL = generateMapplsURL(dept, token);
                window.location.href = mapplsURL;
            }, 2000);
        } else {
            setError('This navigation link has expired or is invalid. Please request a fresh link.');
        }
    }, [searchParams]);

    if (error) {
        return (
            <div style={{ 
                padding: '40px', 
                textAlign: 'center',
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                <h2 style={{ color: '#dc2626' }}>Link Expired</h2>
                <p>{error}</p>
                <p>Please scan the QR code again from the main application.</p>
                <a href="/" style={{
                    display: 'inline-block',
                    marginTop: '20px',
                    padding: '10px 20px',
                    backgroundColor: '#0074D9',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '999px'
                }}>
                    Go Back to Main App
                </a>
            </div>
        );
    }

    if (redirecting) {
        return (
            <div style={{ 
                padding: '40px', 
                textAlign: 'center',
                maxWidth: '600px',
                margin: '0 auto'
            }}>
                <h2>Redirecting to Mappls...</h2>
                <p>Opening navigation in Mappls app.</p>
            </div>
        );
    }

    return (
        <div style={{ 
            padding: '40px', 
            textAlign: 'center',
            maxWidth: '600px',
            margin: '0 auto'
        }}>
            <h2>Validating navigation link...</h2>
            <p>Checking token validity...</p>
        </div>
    );
};

export default TokenValidator;