import React from 'react';
import { useNavigate } from 'react-router-dom'; 
import './style/mainPage.css';

function MainPage() {
    const navigate = useNavigate(); 

    return (
        <div>
            <div className="background"></div> 
            <div className="front">
                <p>Choose your Role</p>
                <button
                    className="button-5"
                    role="button"
                    onClick={() => navigate('/usersignup')} 
                >
                    Buyer
                </button>
                <br />
                <button
                    className="button-5"
                    role="button"
                    onClick={() => navigate('/agentregister')} 
                >
                    Agent
                </button>
            </div>
        </div>
    );
}

export default MainPage;
