// update duration, timeLeft hardcoded values. in defn, stopTimer

import React, { useState, useEffect }  from "react";

const TimerComponent = () => {
    // duration in mins later but secs for now
    const [duration, setDuration] = useState('5');
    // timeLeft tracked in seconds. useState(duration * 60)
    const [freshSet, setfreshSet] = useState(true);
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isRunning, setIsRunning] = useState(false); 
    const [inputValue, setInputValue] = useState('');

    const handleInputChange = (event) => {
        setInputValue(event.target.value); 
    };

    const handleDurationChange = (event) => {
        const newDuration = parseInt(event.target.value) || 0;
        setDuration(newDuration);
        setTimeLeft(newDuration);
    }

    const stopTimer = () => {
        setIsRunning(false);
        setDuration(30);
        setTimeLeft(4);
        setInputValue('')
        setfreshSet(true);
    }

    const toggleTimer = () => {
        // if its a fresh, new running timer, update time left display
        if (!isRunning && freshSet) {
            setTimeLeft(duration)
        }

        // if its not fresh set, its just toggling b/w start and pause
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
                        setfreshSet(true);
                        return 0;    
                    }
                    console.log("timeLeft is NOT <=1")
                    setfreshSet(false);
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
    
    // watching specific state variables
    useEffect(() => {
        console.log("inside the use effect --------")
        console.log("timeleft: ", timeLeft)
        console.log("isRunning: ", isRunning)
        console.log("fresh set: ", freshSet)
    }, [isRunning, freshSet, timeLeft])

    return (
        <div>
            <h2> timer header </h2>

            <div>
                <label htmlFor="input">input: </label>
                <input
                    id="input"
                    type="text"
                    value={inputValue}
                    onChange={handleInputChange}
                    disabled={isRunning || !freshSet}
                    placeholder="what are you working on?"
                />
            </div>
            
            <div>
                <label htmlFor="duration">duration: </label>
                <input
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={handleDurationChange}
                    disabled={isRunning || !freshSet}
                />
            </div>

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

