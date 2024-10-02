import React, { useState }  from "react";

const TimerComponent = () => {
    // duration in mins
    const [duration, setDuration] = useState(30);
    // timeLeft tracked in seconds
    const [timeLeft, setTimeLeft] = useState(duration * 60);
    const [isRunning, setIsRunning] = useState(false); 

    return (
        <div>
            <h2> timer header </h2>
            <p> time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10? '0' : ''}{timeLeft % 60}</p>
            <button
                onClick={() => setIsRunning(!isRunning)}>
                {isRunning ? 'pause' : 'start'}
            </button>
        </div>
    );
};

export default TimerComponent;

