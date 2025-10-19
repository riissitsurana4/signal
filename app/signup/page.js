'use client'
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function Signup() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (event) => {
        event.preventDefault();
        setError("");
        setLoading(true);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }
        if (password.length < 8) {
            setError("Password must be at least 8 characters long");
            setLoading(false);
            return;
        }

        try {
            const res = await fetch('/api/auth/signup', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password }),
            })

            if (res.ok) {
                router.push('/dashboard')
            } else {
                const data = await res.json()
                setError(data.error || 'Something went wrong')
            }
        } catch (err) { 
            setError('Something went wrong')
        }
        setLoading(false);
    };

    return (
        <main className="min-h-screen flex items-center justify-center bg-gray-50 p-6">
            <div className="w-full max-w-md bg-white rounded-xl shadow-lg p-8">
                <h1 className="text-2xl font-bold mb-6 text-center">Welcome to <span className='text-indigo-600'>Blip:Messenger</span></h1>
                <h2 className="text-xl font-bold mb-2 text-center">Create Account</h2>
                <p className="mb-4">* Required fields</p>

                {error && (
                    <div className="mb-4 p-3 text-red-600 rounded-md text-sm text-center">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="name">Name*</label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                            className="w-full px-2 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium mb-1" htmlFor="email">Email*</label>
                        <input
                            type="text"
                            id="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-2 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium mb-1" htmlFor="password">Password*</label>
                        <input
                            type={showPassword ? "text" : "password"}
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-2 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-2 top-8 text-sm text-indigo-600 focus:outline-none"
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                    <div className="relative">
                        <label className="block text-sm font-medium mb-1" htmlFor="confirm-password">Confirm Password*</label>
                        <input
                            type={showConfirmPassword ? "text" : "password"}
                            id="confirm-password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            required
                            className="w-full px-2 py-2 border border-gray-400 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                        />
                        <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute right-2 top-8 text-sm text-indigo-600 focus:outline-none"
                        >
                            {showConfirmPassword ? "Hide" : "Show"}
                        </button>
                    </div>



                    <button type="submit" disabled={loading} className="w-full px-6 py-3 bg-indigo-600 text-white rounded-md font-medium hover:bg-indigo-700 transition disabled:opacity-50">
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <p className="mt-6 text-center text-sm text-gray-600">
                    Already have an account?{' '}
                    <Link href="/login" className="text-indigo-600 hover:underline">
                        Sign in
                    </Link>
                </p>
            </div>
        </main>
    );
}