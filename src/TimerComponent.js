// update duration, timeLeft hardcoded values. in defn, stopTimer
import React, { useState, useEffect, useCallback, useRef }  from "react";
import haikyuuMelody from './assets/haikyuu_soft_melody.mp3';
import CustomCheckbox from "./CustomCheckbox";

const TimerComponent = ( { sessions, setSessions, theme }) => {
    // duration in mins later but secs for now
    const [duration, setDuration] = useState(5);
    // timeLeft tracked in seconds. useState(duration * 60)
    const [freshSession, setfreshSession] = useState(true);
    const [timeLeft, setTimeLeft] = useState(duration);
    const [isRunning, setIsRunning] = useState(false); 
    const [inputValue, setInputValue] = useState('');

    const [startTime, setStartTime] = useState(null);
    const [endTime, setEndTime] = useState(null);
    
    const [segmentStart, setSegmentStart] = useState(null);
    const [totalElapsedTime, setTotalElapsedTime] = useState(0);
    // array of objects, where each object is a completed timer session
    const [isRecordable, setIsRecordable] = useState(false);
    
    const audioRef = useRef(null);

    const [categories, setCategories] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);
    
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
        setShowDropdown(true);
    };

    const handleCategorySelect = (category) => {
        setInputValue(category);
        setShowDropdown(false);
    }

    const updateCategories = useCallback((newTask) => {
        if(newTask) {
            setCategories(prevCategories => {
                const cleanedTask = newTask.toLowerCase().trim();
                if (!prevCategories.includes(cleanedTask)) {
                    return [...prevCategories, cleanedTask];
                }
                return prevCategories;
            })
        }
    }, []);

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

    const handleRemoveSet = (index) => {
        const confirmRemove = window.confirm("remove this session?")
        if (confirmRemove) {
            setSessions(prevSets => prevSets.filter((_, i) => i !== index));
        }
    };
    
    const toggleTimer = () => {
        if (!isRunning && freshSession) {
            // START timer if u aren't not running yet, its a fresh set
            const now = new Date();
            setStartTime(now);
            setSegmentStart(now.getTime()); // timestamp in milliseconds
            setTimeLeft(duration);
            setIsRunning(true); 
            setfreshSession(false);
            setIsRecordable(true);
            updateCategories(inputValue);
            setShowDropdown(false);
        } else if (!isRunning && !freshSession) {
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

    const stopTimer = useCallback (() => {
        // reset
        setIsRunning(false);
        setfreshSession(true);

        setDuration(30);
        setTimeLeft(5);
        setInputValue('')
        setStartTime(null);
        setEndTime(null);
        setSegmentStart(null);
        setTotalElapsedTime(0);
        setIsRecordable(false);
    }, [])

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
                    setSessions(prevSets => [...prevSets, 
                        {
                            start: startTime,
                            end: endTimeDate,
                            elapsed: finalElapsedTime,
                            task: inputValue
                        }
                    ]);

                    if (inputValue) {
                        updateCategories();
                    }

                    return finalElapsedTime;
                })             
            } else {
                // there's no active segment to calculate since segmentStart is null
                const endTimeDate = new Date()
                setEndTime(endTimeDate);

                setSessions(prevSets => [...prevSets, 
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
    }, [isRecordable, segmentStart, startTime, totalElapsedTime, inputValue, setSessions, updateCategories, stopTimer]);

    useEffect(() => {
        // console.log("effect running, isRunning:", isRunning);
        let intervalId;

        if(isRunning) {
            intervalId = setInterval(() => {
                setTimeLeft(currTime => {
                    // when currTime is on 5th tick of 1 -> 0, so ON 5th second
                    if (currTime <= 1) {
                        clearInterval(intervalId); // stop interval immediately, rather than waiting for next effect cleanup
                        setIsRunning(false);
                        if (audioRef.current) {
                            audioRef.current.play();
                        }
                        if (isRecordable) {
                            recordSet(inputValue);
                        }
                        return 0;    
                    }
                    // console.log("timeLeft is NOT <=1")
                    setfreshSession(false);
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
        console.log("timeleft: ", timeLeft)
        // console.log("isRunning status: ", isRunning)
        // console.log("fresh set status: ", freshSet)
        console.log("start time: ", startTime)
        console.log("end time: ", endTime)
        console.log("segment start time: ", segmentStart)
        console.log("total elasped time: ", totalElapsedTime)
    }, [startTime, endTime, segmentStart, timeLeft, totalElapsedTime])
    // [isRunning, freshSet, timeLeft, startTime, endTime, segmentStart, totalElapsedTime]

    useEffect(() => {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.title = `${minutes}:${seconds < 10 ? '0' : ''}${seconds} left`;
    }, [timeLeft]);

    useEffect(() => {
        const handleKeyDown = (event) => {
            if (event.key === 'Enter' && !isRunning) {
                event.preventDefault();
                toggleTimer();
            }
        };
        
        document.addEventListener("keydown", handleKeyDown);

        return () => {
        document.removeEventListener("keydown", handleKeyDown);
        }
    }, [toggleTimer, isRunning]);

    // styling
    const baseColor = theme === 'dark' ? 'bg-darkBlue text-customOrange' : 'bg-customOrange text-darkBlue';
    const borderColor = theme === 'dark' ? 'border-customOrange' : 'border-darkBlue';

    return (
        <div className={`flex flex-col items-center justify-center w-full max-w-lg mx-auto font-mono ${baseColor} ${borderColor}`}>
            <div
                className={`p-1 mb-1  ${baseColor} ${borderColor}`}
                style={{
                    fontSize: `clamp(4rem, 20vw, 11rem)`,
                }}
            >   
                {Math.floor(timeLeft / 60)}:{timeLeft % 60 < 10? '0' : ''}{timeLeft % 60}
            </div>

            <div className="flex space-x-2 w-full mb-4 font-bold">
                <div className="flex-grow relative">
                    <input
                        className={`w-full flex-grow p-2 border rounded-xl shadow ${baseColor} ${borderColor} ${theme === 'dark' ? 'placeholder-dark' : 'placeholder-light'}`}
                        id="input"
                        type="text"
                        value={inputValue}
                        onChange={handleInputChange}
                        onFocus={() => setShowDropdown(true)}
                        onBlur={() => setTimeout(() => setShowDropdown(false), 200)}
                        disabled={isRunning || !freshSession}
                        placeholder=
                        "working on..."
                    />

                    {showDropdown && categories.length > 0 && (
                        <ul className={`absolute z-10 w-full mt-1 rounded-xl shadow-lg ${baseColor} bg-opacity-90 max-h-40 overflow-y-auto`}>
                        {categories.map((category, index) => (
                            <li 
                                key={index}
                                className="px-4 py-2 cursor-pointer hover:${theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'} first:rounded-t-xl last:rounded-b-xl"
                                onClick={() => handleCategorySelect(category)}
                            >
                                {category}
                            </li>
                        ))}
                    </ul>
                    )}
                </div>
                
                <input
                    className={ `w-24 p-2 border rounded-xl shadow ${baseColor} ${borderColor} ${theme === 'dark' ? 'placeholder-dark' : 'placeholder-light'}`}
                    id="duration"
                    type="number"
                    value={duration}
                    onChange={handleDurationChange}
                    disabled={isRunning || !freshSession}
                    placeholder="duration (mins)"
                />
                
            </div>
            
            <div className="flex justify-between space-x-2 w-full font-bold">
                <button 
                    onClick={toggleTimer}
                    className={`flex-1 py-2 px-4 border rounded-xl shadow w-full ${baseColor} ${borderColor}`}
                > 
                    {isRunning ? 'pause' : 'start'}
                </button>
                <button 
                    onClick={stopTimer}
                    className={`flex-1 py-2 px-4 border rounded-xl shadow w-full ${baseColor} ${borderColor}`}
                >
                        stop
                </button>
                {isRecordable && (
                    <button 
                        onClick={recordSet}
                        className={`flex-1 py-2 px-4 border rounded-xl shadow w-full ${baseColor} ${borderColor}`}
                    >
                        record
                    </button>
                )}
            </div>

            <div className={`mt-4 p-4 w-full max-w-lg rounded-xl border shadow ${baseColor} ${borderColor}`}>
                <h2 className="text-lg font-semibold mb-4">sets: </h2>
                <ul className="space-y-1">
                    {sessions.map((set, index) => (
                        <li 
                            key={index}
                            className={`flex items-center space-x-2 border-b py-2 ${baseColor} ${borderColor}`}>
                            <CustomCheckbox
                                type="checkbox"
                                checked={true}
                                onChange={() => handleRemoveSet(index)}
                                theme={theme}
                            /> 
                            <span>
                                {formatTime(set.start)} -  {formatTime(set.end)} ({formatElapsedTime(set.elapsed)})
                                {set.task && `: ${set.task}`}
                            </span>
                            
                        </li>
                    ))}
                </ul>
                   
            </div>

            <audio ref={audioRef} src={haikyuuMelody}/>
        {/* closing parent div! */}
        </div>
    );
};

export default TimerComponent;

