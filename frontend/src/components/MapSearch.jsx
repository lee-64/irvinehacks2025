import React, {useState} from 'react';

export default function MapSearch({onSubmit, placeholder}) {
    const [inputPrompt, setPrompt] = useState('');

    const handleSubmit = (event) => {
        event.preventDefault();

        // Trim the input to remove unnecessary whitespace
        const trimmedPrompt = inputPrompt.trim();

        // Check if the input is not empty
        if (trimmedPrompt === "") {
            alert("Please enter a valid query.");
            return;
        }

        // Call the onSubmit handler passed from Main.js
        onSubmit(trimmedPrompt);

        setPrompt('');
    };

    return (
        <div className="">
        <form onSubmit={handleSubmit} className="">
            <input
                type="text"
                id="userInput"
                value={inputPrompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="transition-all border border-gray-200 rounded-xl p-3 pr-12 bg-white text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-offset-2 focus:ring-gray-300 text-sm"
                placeholder={placeholder}
                required
            />
        </form>
        </div>
    );
}