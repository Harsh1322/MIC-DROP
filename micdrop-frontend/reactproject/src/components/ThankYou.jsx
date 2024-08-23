import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Thankyou.css'; // Import the CSS file for styling

const ThankYou = () => {
    const navigate = useNavigate();

    useEffect(() => {
        // Set a timer to redirect after 30 seconds
        const timer = setTimeout(() => {
            navigate('/scorer');
        }, 30000); // 30000 milliseconds = 30 seconds

        // Cleanup the timer when the component unmounts
        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <div className="thank-you-container">
            <h1 className="thank-you-heading">Thank you for voting!</h1>
            <p className="thank-you-message">
                Please do not refresh; you will be redirected automatically.
            </p>
        </div>
    );
};

export default ThankYou;
