import Link from 'next/link';
import ChatRoomSVG from './components/ChatRoomSVG';

export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50">
            <header className="w-full bg-white shadow">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl sm:text-3xl font-bold">Blip:Messenger</h1>

                    <div className="flex items-center gap-3">
                        <Link
                            href="/contact"
                            className="text-sm font-medium text-gray-700 hover:text-gray-900 px-3 py-2 rounded-md"
                        >
                            Contact
                        </Link>

                        <Link
                            href="/login"
                            className="px-4 py-2 text-sm font-medium bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition"
                        >
                            Login 
                        </Link>
                    </div>
                </div>
            </header>

            <section className="max-w-7xl mx-auto px-6 py-20 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                {/* Left side - Animated Chat SVG */}
                <div className="hidden lg:flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 shadow-sm border border-gray-200">
                    <div className="w-full max-w-md">
                        <ChatRoomSVG />
                    </div>
                </div>

                {/* Right side - Hero content */}
                <div className="text-center lg:text-left space-y-6">
                    <h2 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-gray-900 leading-tight">
                        The <span className="text-indigo-600">NOT</span> so fastest way to message.
                    </h2>

                    <p className="text-lg sm:text-xl text-gray-600 max-w-xl mx-auto lg:mx-0">
                        Slow chats. Real vibes. Join a community that values conversation over speed.
                    </p>

                    <div className="mt-8 flex flex-col sm:flex-row justify-center lg:justify-start gap-4">
                        <Link
                            href="/login"
                            className="inline-flex items-center justify-center px-8 py-4 bg-indigo-600 text-white rounded-lg text-lg font-semibold hover:bg-indigo-700 hover:shadow-lg transition-all duration-200"
                        >
                            Get Started
                        </Link>

                        <Link
                            href="/contact"
                            className="inline-flex items-center justify-center px-8 py-4 border-2 border-gray-300 rounded-lg text-gray-700 text-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200"
                        >
                            Contact Us
                        </Link>
                    </div>

                </div>
            </section>
        </main>
    );
}