'use client';
import FallingLeaves from "../components/FallingLeaves";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Onboarding() {
    const { data: session, status } = useSession();
    const router = useRouter();

    useEffect(() => {
        if (status === 'loading') return;
        if (!session) router.push('/login');
    }, [session, status, router]);

    if (status === 'loading') {
        return (
            <main className="min-h-screen flex items-center justify-center bg-primary">
                <div className="text-primary">Loading...</div>
            </main>
        );
    }

    return (
        <main className="min-h-screen flex items-center justify-center bg-primary p-6">
            <FallingLeaves />
            <div className="w-full max-w-4xl bg-white rounded-xl shadow-lg p-8 text-center">
                <h1 className="text-3xl font-bold mb-4 text-accent-soft">Welcome to Blip:Messenger, {session?.user?.name}!</h1>
                <p className="text-primary text-xl mb-8">We are glad to have you on board. Let&apos;s get started!</p>

                <div className="bg-gray-50 p-6 rounded-lg mb-8">
                    <h2 className="text-2xl font-bold mb-4 text-accent-soft">Next Steps</h2>
                    <ul className="list-disc list-inside text-left space-y-2 text-primary max-w-2xl mx-auto">
                        <li>Explore the chat rooms and start connecting with others.</li>
                        <li>Customize your profile to let others know more about you.</li>
                        <li>Check out the settings to tailor your experience.</li>
                        <li><Link href="/friends" className="text-accent hover:underline">Add friends</Link> to build your network and chat privately.</li>
                        <li>Search for groups or create your own to join communities.</li>
                    </ul>
                </div>

                <Link href="/dashboard" className="inline-block bg-accent text-button font-semibold px-6 py-3 rounded-lg hover:bg-accent-soft transition">
                    Go to Dashboard
                </Link>
            </div>
        </main>
    );
}