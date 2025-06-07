import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import "../Components/LoginSignup.css"; 

const LoginSignup = () => {
    const [state, setState] = useState('Login');
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        city: '',
    });
    const [message, setMessage] = useState(""); 
    const [isChecked, setIsChecked] = useState(false); 
    const navigate = useNavigate();

    const changeHandler = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleResponse = (data) => {
        if (data.success) {
            localStorage.setItem('auth-token', data.token);
            localStorage.setItem('user-info', JSON.stringify({
                username: data.user.username || "", 
                password: data.user.password || "",
                email: data.user.email || "", 
                city: data.user.city || ""
            }));
    
            setMessage(`${state} successful! Redirecting to homepage...`);
            setTimeout(() => {
                navigate("/");
            }, 2000);
        } else {
            setMessage(data.errors || `${state} failed. Please try again.`);
        }
    };
    
    const handleSubmit = () => {
        setMessage(""); 
        
        if (!isChecked) {
            setMessage("You must agree to the terms of use & privacy policy.");
            return;
        }

        state === "Login" ? login() : signup();
    };

    const login = async () => {
        try {
            const response = await fetch('http://localhost:4000/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            handleResponse(data);
        } catch (error) {
            console.error("Login error:", error);
            setMessage("An error occurred. Please try again.");
        }
    };

    const signup = async () => {
        try {
            const response = await fetch('http://localhost:4000/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            });

            const data = await response.json();
            handleResponse(data);
        } catch (error) {
            console.error("Signup error:", error);
            setMessage("An error occurred. Please try again.");
        }
    };

    return (
        <div className="loginsignup">
            <div className="loginsignup-container">
                <h1>{state}</h1>

                <input name="username" onChange={changeHandler} type="text" placeholder="Username" value={formData.username} />
                <input name="email" onChange={changeHandler} type="email" placeholder="Email Address" value={formData.email} />
                <input name="password" onChange={changeHandler} type="password" placeholder="Password" value={formData.password} />
                {state === 'Sign Up' && (
                    <input name="city" onChange={changeHandler} type="text" placeholder="City" value={formData.city} />
                )}

                <button onClick={handleSubmit}>Continue</button>

                {message && <p className="message">{message}</p>} 

                <div className='loginsignup-login'>
                    {state === 'Login' ? (
                        <p>Create an account? <span onClick={() => setState('Sign Up')}>Sign Up</span></p>
                    ) : (
                        <p>Already have an account? <span onClick={() => setState('Login')}>Login</span></p>
                    )}
                </div>

                <div className="loginsignup-agree">
                    <input 
                        type="checkbox" 
                        checked={isChecked} 
                        onChange={() => setIsChecked(!isChecked)} 
                    />
                    <p>By continuing, I agree to the terms of use & privacy policy.</p>
                </div>

                {state === "Login" && (
                    <div className="forgot-password">
                        <p onClick={() => navigate('/forgotpassword')} style={{ cursor: 'pointer', color: 'blue', textDecoration: 'underline' }}>
                            Forgot Password?
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default LoginSignup;
