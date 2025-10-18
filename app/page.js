import Link from 'next/link';


export default function Home() {
    return (
        <main className="min-h-screen bg-gray-50">
            <header className="w-full bg-white shadow">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <h1 className="text-2xl sm:text-3xl font-bold">Blip:Messenger</h1>
                    <div className="flex items-center gap-3">
                        <button className="px-4 py-2 text-sm font-medium text-gray-900">
                            <Link href="/contact">
                                Contact Us
                            </Link>
                        </button>
                        <button className="px-4 py-2 text-sm font-medium text-gray-900">
                            <Link href="/login">
                                Login / Sign Up
                            </Link>
                        </button>
                    </div>
                </div>
            </header>

            <section className="max-w-7xl mx-auto px-6 py-16 items-center">
                <div className="text-center mb-8">
                    <h2 className="text-gray-900 text-4xl sm:text-3xl">
                        The <span className="font-bold">NOT</span> so fastest way to message.
                    </h2>
                </div>
                <div className="flex justify-center col-span-3">
                    <button className="px-6 bg-black rounded-md text-white mr-4">
                        <Link href="/login">
                            Login / Sign Up
                        </Link>
                    </button>
                    <button className="px-6 py-3">
                        <Link href="/contact">
                            Contact Us
                        </Link>
                    </button>
                </div>
            </section>
        </main>
    );
}