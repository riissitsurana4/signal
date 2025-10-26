'use client';
import { useTheme } from "next-themes";
import { useState, useEffect } from "react";

export default function ThemeSwitcher() {
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    const handleChange = (e) => {
        setTheme(e.target.value);
        window.location.reload(); 
    };

    return (
        <select
            value={theme}
            onChange={handleChange}
            className="p-2 border border-input rounded-lg bg-primary text-primary focus:outline-none focus:ring-2 focus-ring-form"
        >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="fall">Fall</option>
        </select>
    );
}