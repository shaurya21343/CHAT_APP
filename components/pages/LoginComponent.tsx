import React from 'react';
import { SignIn } from '@clerk/nextjs';

const LoginComponent: React.FC = () => {
    return (
        <div style={{ maxWidth: 400, margin: '0 auto', paddingTop: 40, textAlign: 'center' }}>
            <SignIn routing="hash" />
        </div>
    );
};

export default LoginComponent;
