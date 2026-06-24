'use client'
import { authClient } from '@/lib/auth-client';
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';

const UserProfile = () => {
    // Getting session and loading state from authClient
    const { data: session, isPending } = authClient.useSession();

    const [name, setName] = useState('');
    const [image, setImage] = useState('');
    const [loading, setLoading] = useState(false);

    // Pre-fill fields when session loads
    useEffect(() => {
        if (session?.user) {
            setName(session.user.name || '');
            setImage(session.user.image || '');
        }
    }, [session]);

    if (isPending) {
        return <div style={{ textAlign: 'center', marginTop: '50px' }}>Loading session...</div>;
    }

    if (!session?.user) {
        return <div style={{ textAlign: 'center', marginTop: '50px', color: 'red' }}>Please log in first.</div>;
    }

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            // Using Better-Auth's built-in updateUser method
            const { data, error } = await authClient.updateUser({
                name: name,
                image: image,
            });

            if (!error) {
                // Trigger error toast if Better-Auth returns an error
                toast.success('Profile updated successfully! 🎉');

            } else {
                // Trigger success toast upon successful update
                toast.error(error.message || 'Could not update profile.');
            }
        } catch (error) {
            console.error("Profile update error:", error);
            toast.error('Internal server error! Please try again.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ maxWidth: '400px', margin: '50px auto', padding: '20px', border: '1px solid #ccc', borderRadius: '8px' }}>
            <h2>Update Profile</h2>

            {image && (
                <div style={{ textAlign: 'center', marginBottom: '15px' }}>
                    <img
                        src={image}
                        alt="Profile Preview"
                        style={{ width: '80px', height: '80px', borderRadius: '50%', objectFit: 'cover', border: '2px solid #007bff' }}
                    />
                </div>
            )}

            <form onSubmit={handleUpdateProfile}>
                {/* Email Input (Disabled) */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Email:</label>
                    <input
                        type="email"
                        value={session.user.email || ''}
                        disabled
                        style={{ width: '100%', padding: '8px', background: '#f0f0f0', border: '1px solid #ccc', borderRadius: '4px', cursor: 'not-allowed' }}
                    />
                </div>

                {/* Name Input */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Name:</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your name"
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>

                {/* Profile Image URL Input */}
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>Profile Image URL:</label>
                    <input
                        type="text"
                        value={image}
                        onChange={(e) => setImage(e.target.value)}
                        placeholder="Paste image URL here"
                        required
                        style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={loading}
                    style={{
                        width: '100%',
                        padding: '10px',
                        background: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: loading ? 'not-allowed' : 'pointer'
                    }}
                >
                    {loading ? 'Updating...' : 'Save Profile'}
                </button>
            </form>
        </div>
    );
};

export default UserProfile;