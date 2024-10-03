// update duration, timeLeft hardcoded values. in defn, stopTimer

import React, { useState, useEffect }  from "react";

const TimerComponent = () => {
    // duration in mins
    const [duration, setDuration] = useState(30);
    // timeLeft tracked in seconds. useState(duration * 60)
    const [timeLeft, setTimeLeft] = useState(4);
    const [isRunning, setIsRunning] = useState(false); 
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value);
    };

    const stopTimer = () => {
        setIsRunning(false);
        setDuration(30);
        setTimeLeft(4);
    }

    const toggleTimer = () => {
        setIsRunning(!isRunning);
    }

    useEffect(() => {
        console.log("effect running, isRunning:", isRunning);
        let intervalId;

        if(isRunning) {
            intervalId = setInterval(() => {
                setTimeLeft(currTime => {
                    if (currTime < 1) {
                        console.log("currTime < 1 is triggered")
                        setIsRunning(false);
                        return 0;  
                    }
                    console.log("timeLeft is NOT <=1")
                    return currTime - 1;
                });       
            }, 1000);

            return () => {
                if (intervalId) {
                    // cleanup function that runs when useEffect is called + theres existing interval to clean up
                    // when we first start, the cleanup fn is defined but not run.
                    console.log('cleanup: clearing interval')
                    clearInterval(intervalId);
                }
            }
        }
    }, [isRunning]);

    return (
        <div>
            <h2> timer header </h2>
            <input
                id="input"
                type="text"
                value={inputValue}
                onChange={handleInputChange}
                placeholder="what are you working on?"
            />
            <p> time left: {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10? '0' : ''}{timeLeft % 60}</p>
            <button
                onClick={toggleTimer}>
                {isRunning ? 'pause' : 'start'}
            </button>
            <button
                onClick={stopTimer}>
                    stop
            </button>
        </div>
    );
};

export default TimerComponent;

