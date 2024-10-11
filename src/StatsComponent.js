import React from "react";

const StatsComponent = ( {sets} ) => {
    return (
        <div>
            <h2>today's stats</h2>
            <p>total sets: {sets.length}</p>
        </div>
    )

}

export default StatsComponent;