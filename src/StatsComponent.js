import React, { useState, useMemo } from "react";

const StatsComponent = ( {sessions} ) => {
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

    return (
        <div>
            <h3>today's gains</h3>
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
                <div key={task}>
                    <p>{task}: {taskData.totalMinutes} secs, {taskData.count} times </p>
                    <label>
                        goal: 
                        <input 
                            type="number"
                            value={goals[task] === undefined ? 0 : goals[task]}
                            onChange={(e) => handleGoalChange(task, Number(e.target.value))}
                        />
                    </label>
                    <p> completed {calculateCompletion(taskData.totalMinutes, goals[task])}%</p>
                </div>
            ))}

            <div>
                <p> total time worked today: {totalTimeWorked} seconds</p>
                <label> 
                    goal:
                    <input
                        type="number"
                        value={totalGoal}
                        onChange={(e) => setTotalGoal(e.target.value === '' ? '' : Number(e.target.value))}
                    />
                </label>
                <p> completed {calculateCompletion(totalTimeWorked, totalGoal)}% </p>
            </div>
        </div>


    )
}

export default StatsComponent;