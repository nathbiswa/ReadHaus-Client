'use client'
import Link from 'next/link';
import React from 'react';

const NotFound = () => {
    return (
        <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '80vh',
            textAlign: 'center',
            padding: '20px'
        }}>
            <h1 style={{ fontSize: '120px', fontWeight: 'bold', margin: '0', color: '#ff4d4f' }}>404</h1>
            <h2 style={{ fontSize: '32px', marginBottom: '15px', color: '#333' }}>Page Not Found</h2>
            <p style={{ fontSize: '18px', color: '#666', maxWidth: '500px', marginBottom: '30px' }}>
                The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                href="/"
                style={{
                    padding: '12px 24px',
                    background: '#007bff',
                    color: 'white',
                    textDecoration: 'none',
                    borderRadius: '5px',
                    fontWeight: 'bold',
                    transition: 'background 0.2s'
                }}
                onMouseOver={(e) => e.target.style.background = '#0056b3'}
                onMouseOut={(e) => e.target.style.background = '#007bff'}
            >
                Back to Home
            </Link>
        </div>
    );
};

export default NotFound;