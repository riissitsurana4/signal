import Link from 'next/link';
import { Mail, Github } from 'lucide-react';
import FallingLeaves from '../components/FallingLeaves';

export default function Contact() {
    return (
        <main className="min-h-screen flex items-center justify-center bg-primary text-primary">
            <FallingLeaves />
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="bg-primary p-8 rounded-lg shadow-lg w-full max-w-md text-center">
                    <h1 className="text-2xl font-bold mb-4">Contact Us</h1>
                    <p className="text-primary/70 mb-6">Follow us or reach out!</p>
                    <div className="space-y-4">
                        <Link
                            href="mailto:rishitsurana4@gmail.com"
                            className="flex items-center justify-center space-x-2 p-3 bg-button text-button rounded-lg hover:brightness-90 transition"
                        >
                            <Mail size={20} /> <span>Email Us</span>
                        </Link>
                        <Link
                            href="https://github.com/riissitsurana4"
                            className="flex items-center justify-center space-x-2 p-3 bg-button text-button rounded-lg hover:brightness-90 transition"
                        >
                            <Github size={20} /> <span>GitHub</span>
                        </Link>
                    </div>
                </div>
            </div>
        </main>
    );
}
