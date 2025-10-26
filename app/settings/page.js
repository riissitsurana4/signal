'use client';
import ThemeSwitcher from "../components/themeSwitcher"
import { useState, useEffect } from "react";
import { useSession, signOut } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import FallingLeaves from '../components/FallingLeaves';

export default function Settings() {
    const { data: session, update, status } = useSession();
    const router = useRouter();
    const [name, setName] = useState(session?.user?.name || '');
    const [email, setEmail] = useState(session?.user?.email || '');
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [oldPassword, setOldPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const [changingPassword, setChangingPassword] = useState(false);
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (status === 'unauthenticated') {
            router.push('/login');
        }
    }, [status, router]);


    const handleProfile = async () => {
        setSaving(true);
        try {
            const res = await fetch('/api/users', {
                method: "PATCH",
                body: JSON.stringify({ name, email }),
            });
            if (res.ok) {
                await update({ name, email });
                alert('Profile updated!');
            } else {
                alert('Failed to update profile');
            }
        } catch (error) {
            alert('Error updating profile');
        }
        setSaving(false);
    };

    const handlePasswordChange = async () => {
        setError('');
        setLoading(true);
        if (newPassword !== confirmNewPassword) {
            setError("Passwords do not match");
            setLoading(false);
            return;
        }
        if (newPassword.length < 8) {
            setError("Password must be at least 8 characters long");
            setLoading(false);
            return;
        }
        try {
            const res = await fetch('/api/users/password', {
                method: "POST",
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ oldPassword, newPassword }),
            });
            if (res.ok) {
                alert('Password changed successfully!');
                setOldPassword('');
                setNewPassword('');
                setConfirmNewPassword('');
            } else {
                const data = await res.json();
                setError(data.error || 'Failed to change password');
            }
        } catch (error) {
            setError('Error changing password');
        }
        setLoading(false);
    };
    const handleAccountDeletion = async () => {
        if (!confirm('Are you sure you want to delete your account? This action cannot be undone.')) return;
        setDeleting(true);
        await signOut({ callbackUrl: '/' });
        setDeleting(false);
    };

    return (
        <div className="min-h-screen bg-primary flex items-center justify-center p-4">
            <FallingLeaves />
            <div className="bg-primary p-8 w-full max-w-md">
                <h1 className="text-2xl mb-6 text-center">Settings</h1>
                <section className="bg-primary border border-input rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">Theme Switcher</h2>
                    <ThemeSwitcher />
                    <p> Switch between themes. Do <span className="font-bold"> NOT</span> use dark theme, still working on some elements in dark theme.</p>
                </section>
                <section className="bg-primary border border-input rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">Profile</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-primary mb-2">Name</label>
                            <input
                                type="text"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                className="w-full p-3 border border-input rounded-lg bg-primary text-primary focus:outline-none focus:ring-2 focus-ring-form"
                            />
                        </div>
                        <div>
                            <label className="block text-primary mb-2">Email</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="w-full p-3 border border-input rounded-lg bg-primary text-primary focus:outline-none focus:ring-2 focus-ring-form"
                            />
                        </div>
                        <button
                            onClick={handleProfile}
                            disabled={saving}
                            className="px-6 py-3 bg-accent text-button rounded-lg hover:bg-accent-soft disabled:opacity-50"
                        >
                            {saving ? 'Saving...' : 'Save Changes'}
                        </button>
                    </div>
                </section>

                <section className="bg-primary border border-input rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">Password</h2>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-primary mb-2">Old Password</label>
                            <input
                                type="password"
                                value={oldPassword}
                                onChange={(e) => setOldPassword(e.target.value)}
                                className="w-full p-3 border border-input rounded-lg bg-primary text-primary focus:outline-none focus:ring-2 focus-ring-form"
                            />
                        </div>
                        <div>
                            <label className="block text-primary mb-2">New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                className="w-full p-3 border border-input rounded-lg bg-primary text-primary focus:outline-none focus:ring-2 focus-ring-form"
                            />
                        </div>
                        <div>
                            <label className="block text-primary mb-2">Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmNewPassword}
                                onChange={(e) => setConfirmNewPassword(e.target.value)}
                                className="w-full p-3 border border-input rounded-lg bg-primary text-primary focus:outline-none focus:ring-2 focus-ring-form"
                            />
                        </div>
                        <button
                            onClick={handlePasswordChange}
                            disabled={changingPassword}
                            className="px-6 py-3 bg-accent text-button rounded-lg hover:bg-accent-soft disabled:opacity-50"
                        >
                            {changingPassword ? 'Changing...' : 'Change Password'}
                        </button>
                        {error && <p className="text-red-500 mt-2">{error}</p>}
                    </div>
                </section>
                <section className="bg-primary border border-input rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">Account Deletion</h2>
                    <button
                        onClick={handleAccountDeletion}
                        disabled={deleting}
                        className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 disabled:opacity-50"
                    >
                        {deleting ? 'Deleting...' : 'Delete Account'}
                    </button>
                </section>

                <section className="bg-primary border border-input rounded-lg p-6 mb-6">
                    <h2 className="text-xl font-semibold text-primary mb-4">Coming Soon!!</h2>
                    <p> More Features like notification, blocked user, etc coming soon</p>
                    <Link href="/dashboard" className="text-accent hover:underline font-bold text-2xl">Go back to Dashboard</Link>
                </section>
            </div>
        </div>
    )
}