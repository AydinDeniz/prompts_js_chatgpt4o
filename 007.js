
// Asynchronous Task Queue with Limited Concurrency
class AsyncTaskQueue {
    constructor(concurrencyLimit) {
        this.queue = [];
        this.activeTasks = 0;
        this.concurrencyLimit = concurrencyLimit;
    }

    // Function to add tasks to the queue
    addTask(task) {
        return new Promise((resolve, reject) => {
            this.queue.push(() => task().then(resolve).catch(reject));
            this.runNextTask();
        });
    }

    // Run the next task in the queue if below concurrency limit
    runNextTask() {
        if (this.activeTasks < this.concurrencyLimit && this.queue.length > 0) {
            this.activeTasks++;
            const nextTask = this.queue.shift();
            nextTask().finally(() => {
                this.activeTasks--;
                this.runNextTask();
            });
        }
    }
}

// Example usage of AsyncTaskQueue
const sleep = (time) => new Promise((resolve) => setTimeout(resolve, time));

const queue = new AsyncTaskQueue(3); // Limit of 3 concurrent tasks

// Sample tasks with varying execution times
const tasks = [
    () => sleep(1000).then(() => console.log("Task 1 completed")),
    () => sleep(2000).then(() => console.log("Task 2 completed")),
    () => sleep(500).then(() => console.log("Task 3 completed")),
    () => sleep(1200).then(() => console.log("Task 4 completed")),
    () => sleep(300).then(() => console.log("Task 5 completed"))
];

// Adding tasks to the queue
tasks.forEach(task => queue.addTask(task));
