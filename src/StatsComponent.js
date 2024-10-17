import React, { useState, useMemo } from "react";

const StatsComponent = ( { sessions, theme } ) => {
    // converted to seconds, since elapsed is in seconds 
    const [goals, setGoals] = useState({}); // ie) {"task1": {value: 30, unit: "mins"}}
    const [totalGoal, setTotalGoal] = useState({ value: '', unit: 'mins' });

    const handleGoalChange = (task, field, newValue) => {
        setGoals(prevGoals => ({
            ...prevGoals,
            [task]: { ...prevGoals[task], [field]: newValue }
        }));
    }

    const handleTotalGoalChange = (field, newValue) => {
        setTotalGoal(prev => ({...prev, [field]: newValue }));
    }

    const convertToSeconds = (value, unit) => {
        return unit === 'hrs' ? value * 3600 : value * 60;
    }

    const calculateCompletion = (secondsElapsed, goal) => {
        if (!goal || !goal.value || goal.value <= 0) return 0;

        const goalInSeconds = convertToSeconds(Number(goal.value), goal.unit);

        return Math.min(100, parseFloat(((secondsElapsed / goalInSeconds) * 100).toFixed(1)));
    }

    // a session in a sessions array has these properties:
    // start: startTime,
    // end: endTimeDate,
    // elapsed: finalElapsedTime, in seconds
    // task: inputValue

    // takes the acc object returned by useMemo and extracts these 2 properties as separate variables
    // we are performing a calc, and immediately destructuring its result into variables so we can use in JSX
    const { cleanedSessions, totalTimeWorked } = useMemo(() => {
        // reduce - a method used to reduce an array to a single value
        // here, we turn sessions - array of session objs - into 1 obj that summarizes sessions by task
        // we extracted 'task' from each session object and use it as key for acc object
        // ie) acc object can look like this. object.key1 or object["key1"] to access it
            // { 
            //  cleanedSessions: {
            //      "write code": {"totalSeconds": 100, "count": 3},
            //      "test app": {"totalSeconds": 25,"count": 2}
            //  },
            //  totalTimeWorked: 30 
            // }
        // write code and test app r "keys" of acc. each key has a value thats an object
        // within these nested objects - totalSeconds and counts are keys(or properties)
        return sessions.reduce((acc, session) => {
            const taskCleaned = session.task.trim().toLowerCase();
            // if its not currently present, give it 0 initial values
            if (!acc.cleanedSessions[taskCleaned]) {
                acc.cleanedSessions[taskCleaned] = {totalSeconds: 0, count: 0}
               
            } 
            acc.cleanedSessions[taskCleaned].totalSeconds += session.elapsed;
            acc.cleanedSessions[taskCleaned].count += 1;
            acc.totalTimeWorked += session.elapsed;
            return acc;
        }, { cleanedSessions: {}, totalTimeWorked: 0 });
    }, [sessions]);

    const formatTime = (seconds) => {
        let result = [];
        const hours = Math.floor(seconds / 3600);
        const minutes = Math.floor(((seconds % 3600) / 3600) * 60);
        const remainingSeconds = seconds % 60;

        if (hours > 0) {
            result.push(`${hours} hr${hours > 1 ? 's': ''}`);
        }
        if (minutes > 0) {
            result.push(`${minutes} min${minutes > 1 ? 's': ''}`);
        }
        if (remainingSeconds > 0 && hours === 0 && minutes === 0) {
            result.push(`${remainingSeconds} sec${remainingSeconds > 1 ? 's' : ''}`);
        }
        return result.join('');
        
    }

    // styling
    const baseColor = theme === 'dark' ? 'bg-darkBlue text-customOrange' : 'bg-customOrange text-darkBlue';
    const borderColor = theme === 'dark' ? 'border-customOrange' : 'border-darkBlue';

    return (
        <div className={`font-mono flex flex-col items-center p-4 ${baseColor} ${borderColor}`}>
            <h2 className={`text-xl font-bold mb-4`}>today's gains</h2>

            <div className="w-full max-w-lg">
                {/* Object.entries(): convert object into an array of key-value pairs. ie) { a: 1, b: 2 } -> [['a', 1], ['b', 2]]
                ie) {
                        coding: {totalSeconds: 30, count: 2}, 
                        reading: {totalSeconds: 60, count: 2}
                    } 
                --> [ 
                        ['coding', '{totalSeconds: 30, count: 2}'], 
                        ['reading', '{totalSeconds: 60, count: 5}'] 
                    ]
                */}
                {/* map() => (...): iterates over this ^ array of arrays, destructs each array element into two variables
                where task gets first item (ie. 'coding'), sessionData gets second item (ie. {totalSeconds: 30, count: 2})
                and applies a function using these deconstructed variables */}
                {Object.entries(cleanedSessions).map(([task, taskData]) => (
                    <div key={task} className={`mb-4 p-4 rounded-xl shadow border ${baseColor} ${borderColor}`}>
                        <div className="flex justify-between">
                            <span className="font-bold">{task}</span>
                            <span>{formatTime(taskData.totalSeconds)}</span>
                        </div>

                        <div className="flex justify-between pb-1">
                            <span>goal:
                                <input 
                                    type="number"
                                    value={goals[task]?.value || ''}
                                    onChange={(e) => handleGoalChange(task, 'value', e.target.value)}
                                    className={`pl-1.5 w-14 ml-2 border rounded-xl ${baseColor} ${borderColor}`}
                                />
                                <select 
                                    value={goals[task]?.unit || 'mins'} 
                                    onChange={(e) => handleGoalChange(task, 'unit', e.target.value)}
                                    className="bg-transparent ml-2"
                                >
                                    <option value="mins">mins</option>
                                    <option value="hrs">hrs</option>
                                </select>
                            </span>
                            <span>{calculateCompletion(taskData.totalSeconds, goals[task])}% completed</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`w-full max-w-lg mb-4 p-4 rounded-xl shadow border ${baseColor} ${borderColor}`}>
                <div className="flex justify-between pb-1">
                        <span className="font-bold"> total time worked today: </span>
                        <span>{formatTime(totalTimeWorked)}</span>
                </div>

                <div className="flex justify-between">
                    <span>goal:
                        <input 
                            type="number"
                            value={totalGoal.value}
                            onChange={(e) => handleTotalGoalChange('value', e.target.value)}
                            className={`pl-1.5 border w-14 ml-2 rounded-xl ${baseColor} ${borderColor}`}
                        />
                        <select
                            value={totalGoal.unit} 
                            onChange={(e) => handleTotalGoalChange('unit', e.target.value)}
                            className="bg-transparent ml-2"
                        >
                            <option value="mins">mins</option>
                            <option value="hrs">hrs</option>
                        </select>
                    </span>

                    <span>{calculateCompletion(totalTimeWorked, totalGoal)}% completed</span>
                </div>
            </div>
        </div>
    )
}

export default StatsComponent;