import React, { useState } from 'react';
import axios from 'axios';
import Breadcrumb from './components/Breadcrumbs/Breadcrumb';

const ResetPassword: React.FC = () => {
    const [newPassword, setNewPassword] = useState<string>('');
    const [confirmPassword, setConfirmPassword] = useState<string>('');
    const token = new URLSearchParams(window.location.search).get('token');

    const handleResetPassword = async (e: React.FormEvent) => {
        e.preventDefault(); // Prevent the default form submission
        if (newPassword !== confirmPassword) {
            alert("Passwords do not match.");
            return;
        }
        
        try {
            const response = await axios.post(`http://localhost:8787/reset-password?token=${token}`, {
                newPassword,
                confirmPassword,
            });
            console.log(response.data);
            // Handle successful password reset (e.g., notify user or redirect)
            alert("Password has been reset successfully.");
        } catch (error: unknown) {
            if (axios.isAxiosError(error) && error.response) {
                console.error("Error response data:", error.response.data);
                alert(error.response.data || "An error occurred while resetting the password.");
            } else {
                console.error("Unexpected error:", error);
                alert("An unexpected error occurred.");
            }
        }
    };
    
    return (
        <>
              <Breadcrumb pageName="Reset Password" />

        <form onSubmit={handleResetPassword}>
            <h2>Reset Password</h2>
            <input 
                type="password" 
                placeholder="New Password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
            />
            <input 
                type="password" 
                placeholder="Confirm Password" 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
                required 
            />
            <button type="submit">Reset Password</button>
        </form>
        </>
    );
};

export default ResetPassword;
