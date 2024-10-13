// project a
import React, { useState, useMemo } from "react";

const StatsComponent = ( { sessions, theme } ) => {
    const [goals, setGoals] = useState({});
    const [totalGoal, setTotalGoal] = useState(0);

    const handleGoalChange = (task, value) => {
        setGoals(prevGoals => ({
            ...prevGoals,
            [task]: value === '' ? '' :  Number(value)
        }))
    }

    const calculateCompletion = (minutes, goal) => {
        return goal > 0 ? parseFloat(((minutes / goal) * 100).toFixed(1)) : 0;
    }

    // a session in a sessions array has these properties:
    // start: startTime,
    // end: endTimeDate,
    // elapsed: finalElapsedTime,
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
            //      "write code": {"totalMinutes": 100, "count": 3},
            //      "test app": {"totalMinutes": 25,"count": 2}
            //  },
            //  totalTimeWorked: 30 
            // }
        // write code and test app r "keys" of acc. each key has a value thats an object
        // within these nested objects - totalMinutes and counts are keys(or properties)
        return sessions.reduce((acc, session) => {
            const taskCleaned = session.task.trim().toLowerCase();
            // if its not currently present, give it 0 initial values
            if (!acc.cleanedSessions[taskCleaned]) {
                acc.cleanedSessions[taskCleaned] = {totalMinutes: 0, count: 0}
               
            } 
            acc.cleanedSessions[taskCleaned].totalMinutes += session.elapsed;
            acc.cleanedSessions[taskCleaned].count += 1;
            acc.totalTimeWorked += session.elapsed;
            return acc;
        }, { cleanedSessions: {}, totalTimeWorked: 0 });
    }, [sessions]);

    // styling
    const baseColor = theme === 'dark' ? 'bg-darkBlue text-customOrange' : 'bg-customOrange text-darkBlue';
    const borderColor = theme === 'dark' ? 'border-customOrange' : 'border-darkBlue';

    return (
        <div className={`font-mono flex flex-col items-center p-4 ${baseColor} ${borderColor}`}>
            <h2 className={`text-xl font-bold mb-4`}>today's gains</h2>

            <div className="w-full max-w-lg">
                {/* Object.entries(): convert object into an array of key-value pairs. ie) { a: 1, b: 2 } -> [['a', 1], ['b', 2]]
                ie) {
                        coding: {totalMinutes: 30, count: 2}, 
                        reading: {totalMinutes: 60, count: 2}
                    } 
                --> [ 
                        ['coding', '{totalMinutes: 30, count: 2}'], 
                        ['reading', '{totalMinutes: 60, count: 5}'] 
                    ]
                */}
                {/* map() => (...): iterates over this ^ array of arrays, destructs each array element into two variables
                where task gets first item (ie. 'coding'), sessionData gets second item (ie. {totalMinutes: 30, count: 2})
                and applies a function using these deconstructed variables */}
                {Object.entries(cleanedSessions).map(([task, taskData]) => (
                    <div key={task} className={`mb-4 p-4 rounded-xl shadow border ${baseColor} ${borderColor}`}>
                        <div className="flex justify-between">
                            <span className="font-bold">{task}</span>
                            <span>{taskData.totalMinutes} mins </span>
                        </div>

                        <div className="flex justify-between pb-1">
                            <span>goal:
                                <input 
                                    type="number"
                                    value={goals[task] === undefined ? 0 : goals[task]}
                                    onChange={(e) => handleGoalChange(task, Number(e.target.value))}
                                    className={`pl-1.5 w-14 ml-2 border rounded-xl ${baseColor} ${borderColor}`}
                                /> mins
                            </span>
                            <span>{calculateCompletion(taskData.totalMinutes, goals[task])}% completed</span>
                        </div>
                    </div>
                ))}
            </div>

            <div className={`w-full max-w-lg mb-4 p-4 rounded-xl shadow border ${baseColor} ${borderColor}`}>
                <div className="flex justify-between pb-1">
                        <span className="font-bold"> total time worked today: </span>
                        <span>{totalTimeWorked} mins </span>
                </div>

                <div className="flex justify-between">
                    <span>goal:
                        <input 
                            type="number"
                            value={totalGoal}
                            onChange={(e) => setTotalGoal(e.target.value === '' ? '' : Number(e.target.value))}
                            className={`pl-1.5 border w-14 ml-2 rounded-xl ${baseColor} ${borderColor}`}
                        /> mins
                    </span>
                    <span>{calculateCompletion(totalTimeWorked, totalGoal)}% completed</span>
                </div>
            </div>
        </div>
    )
}

export default StatsComponent;