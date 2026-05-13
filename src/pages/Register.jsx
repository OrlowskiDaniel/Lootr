import { useState } from "react";
import { signUp } from "../api/auth";

export default function Register() {
    // login consts
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    // handle submit function
    const handleSubmit = async (e) => {
        e.preventDefault();
        // call signUp function from auth.js
        await signUp(email, password);

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
                <button type="submit">Register</button>
            </form>
        </div>
    );
}