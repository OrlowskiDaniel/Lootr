import { useState } from 'react';
import { signIn } from '../api/auth';

export default function Login() {
    // login consts
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // handle submit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        // call signIn function from auth.js
        await signIn(email, password);

    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <button type="submit">Login</button>
            </form>
        </div>
    );
}