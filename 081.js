
// Deep Merge Utility Function for JSON Objects

function deepMerge(obj1, obj2) {
    if (typeof obj1 !== "object" || typeof obj2 !== "object" || obj1 === null || obj2 === null) {
        return obj2; // Non-object values override
    }

    if (Array.isArray(obj1) && Array.isArray(obj2)) {
        return [...new Set([...obj1, ...obj2])]; // Merge arrays without duplicates
    }

    const merged = { ...obj1 };

    for (const key in obj2) {
        if (obj2.hasOwnProperty(key)) {
            merged[key] = deepMerge(obj1[key], obj2[key]);
        }
    }

    return merged;
}

// Example usage
const obj1 = {
    name: "Alice",
    details: {
        age: 30,
        hobbies: ["reading", "hiking"],
    },
    preferences: {
        theme: "dark",
    },
};

const obj2 = {
    details: {
        age: 31,
        hobbies: ["cycling", "hiking"],
    },
    preferences: {
        language: "English",
    },
};

const mergedObject = deepMerge(obj1, obj2);
console.log(mergedObject);
