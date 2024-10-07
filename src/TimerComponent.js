// update duration, timeLeft hardcoded values. in defn, stopTimer

import React, { useState, useEffect, useCallback }  from "react";

const TimerComponent = () => {
    // duration in mins later but secs for now
    const [duration, setDuration] = useState('5');
    // timeLeft tracked in seconds. useState(duration * 60)
    const [freshSet, setfreshSet] = useState(true);
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isRunning, setIsRunning] = useState(false); 
    const [inputValue, setInputValue] = useState('');

    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    
    const [segmentStart, setSegmentStart] = useState(null);
    const [totalElapsedTime, setTotalElapsedTime] = useState(0);
    const [sets, setSets] = useState([]);
    const [isRecordable, setIsRecordable] = useState(false);

    
    const formatTime = (date) => {
        return date ? date.toLocaleTimeString([], {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        }) : ''
    };

    const formatElapsedTime = (seconds) => {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;
        if (minutes > 0) {
            return `${minutes} ${minutes === 1 ? "min" : "mins"}`;
        } else {
            return `${remainingSeconds} ${ remainingSeconds === 1 ? "sec" : "secs"}`;
        }

    };

    // handling changes
    const handleInputChange = (event) => {
        setInputValue(event.target.value); 
    };

    const handleDurationChange = (event) => {
        const newDuration = parseInt(event.target.value);

        // should be a positive number
        if (newDuration < 0) {
            alert("please enter a positive number")
            setDuration('');
            setTimeLeft(0);
            return;
        }

        // if empty
        if (Number.isNaN(newDuration)) {
            setDuration('');
            setTimeLeft(0);
        } else {
            setDuration(newDuration);
            setTimeLeft(newDuration);
        }
    }
    
    const toggleTimer = () => {
        if (!isRunning && freshSet) {
            // START timer if u aren't not running yet, its a fresh set
            const now = new Date();
            setStartTime(now);
            setSegmentStart(now.getTime()); // Date.now() is timestamp in milliseconds
            setTimeLeft(duration);
            setIsRunning(true); 
            setfreshSet(false);
            setIsRecordable(true);
        } else if (!isRunning && !freshSet) {
            // RESUME timer if we aren't running, its not fresh set
            setSegmentStart(Date.now())
            setIsRunning(true);
        } else if (isRunning) {
            // PAUSE timer if currently running, and let's log elapsed time
            const currentEnd = Date.now()
            const segmentDuration = Math.floor((currentEnd - segmentStart) / 1000);
            setTotalElapsedTime((prev) => prev + segmentDuration);
            console.log('total elapsed time: ', totalElapsedTime)
            
            // reset to start another segment to calculate elapsed time with
            setIsRunning(false);
            setSegmentStart(null);
        }  
    }

    const stopTimer = () => {
        // reset
        setIsRunning(false);
        setfreshSet(true);

        setDuration(30);
        setTimeLeft(5);
        setInputValue('')
        setStartTime(null);
        setEndTime(null);
        setSegmentStart(null);
        setTotalElapsedTime(0);
        setIsRecordable(false);
    }

    const recordSet = useCallback(() => {
        // record last elapsed time and total it up
        if (isRecordable) {
            const currentEnd = Date.now();
            
            if (segmentStart !== null) {
                const segmentDuration = Math.floor((currentEnd - segmentStart) / 1000);

                setTotalElapsedTime((prev) => {
                    const finalElapsedTime = prev + segmentDuration;
    
                    // record end time
                    const endTimeDate = new Date()
                    setEndTime(endTimeDate);
    
                    console.log("finalElapsedTime: ", finalElapsedTime)
                    
                    // record set information
                    setSets(prevSets => [...sets, 
                        {
                            start: startTime,
                            end: endTimeDate,
                            elapsed: finalElapsedTime,
                            task: inputValue
                        }
                    ]);
    
                    return finalElapsedTime;
                })             
            } else {
                // there's no active segment to calculate since segmentStart is null
                const endTimeDate = new Date()
                setEndTime(endTimeDate);

                setSets(prevSets => [...sets, 
                    {
                        start: startTime,
                        end: endTimeDate,
                        elapsed: totalElapsedTime,
                        task: inputValue
                    }
                ]);
            }
            // reset information
            stopTimer();
        } else {
            // isRecordable is false, just a guard clause
            console.log("isRecordable: ", isRecordable)
            return;
        }  
    // dependencies - variables / state values that come from / are defined outside the fn but are used within the fn
    // point is to update function whenever these external values change
    // since finalElapsedTime and endTimeDate are both local variables calculated within this fn, they dont need to be listed as dependency array
    }, [isRecordable, segmentStart, startTime, totalElapsedTime, inputValue, sets]);

    useEffect(() => {
        // console.log("effect running, isRunning:", isRunning);
        let intervalId;

        if(isRunning) {
            intervalId = setInterval(() => {
                setTimeLeft(currTime => {
                    // when currTime is on 5th tick of 1 -> 0, so ON 5th second
                    if (currTime <= 1) {
                        // console.log("currTime < 1 is triggered")
                        if (isRecordable) {
                            recordSet();
                        }
                        return 0;    
                    }
                    // console.log("timeLeft is NOT <=1")
                    setfreshSet(false);
                    return currTime - 1;
                    
                });       
            }, 1000);

            return () => {
                if (intervalId) {
                    // cleanup function that runs when useEffect is called + theres existing interval to clean up
                    // when we first start, the cleanup fn is defined but not run.
                    // console.log('cleanup: clearing interval')
                    clearInterval(intervalId);
                }
            }
        }
    }, [isRunning, isRecordable, recordSet]);
    
    // watching specific state variables
    useEffect(() => {
        // console.log("inside the use effect --------")
        // console.log("timeleft: ", timeLeft)
        // console.log("isRunning status: ", isRunning)
        // console.log("fresh set status: ", freshSet)
        console.log("start time: ", startTime)
        console.log("end time: ", endTime)
        console.log("segment start time: ", segmentStart)
        console.log("total elasped time: ", totalElapsedTime)
    }, [startTime, endTime, segmentStart, totalElapsedTime])
    // [isRunning, freshSet, timeLeft, startTime, endTime, segmentStart, totalElapsedTime]

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

            <button onClick={toggleTimer}> {isRunning ? 'pause' : 'start'}</button>

            <button onClick={stopTimer}>stop</button>

            {isRecordable && (<button onClick={recordSet}>record</button>)}
            

            <div>
                <h3>sets: </h3>
                <ul>
                    {sets.map((set, index) => (
                        <li key={index}>
                            {formatTime(set.start)} -  {formatTime(set.end)} ({formatElapsedTime(set.elapsed)})
                            {set.task && `: ${set.task}`}
                        </li>
                    ))}
                </ul>
                   
            </div>
            
        </div>
    );
};

export default TimerComponent;

