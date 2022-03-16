//more info: https://github.com/datastructures-js/priority-queue
const {PriorityQueue} = require('@datastructures-js/priority-queue');

// custom comparator for PriorityQueue
// based on total score of the run
const compareRuns = (run1, run2) => {
    return run2.totalScore - run1.totalScore;
}

// stores runs in an descending manner using a PriorityQueue
// upon insertion of a new Run, that run gets automatically sorted
const runs = new PriorityQueue( {
    compare: compareRuns
});

module.exports = runs;