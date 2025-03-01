
// Function to convert nested JSON to CSV format
function jsonToCsv(json) {
    const flattenObject = (obj, parent = '', res = {}) => {
        for (let key in obj) {
            const propName = parent ? parent + '_' + key : key;
            if (typeof obj[key] === 'object' && obj[key] !== null && !Array.isArray(obj[key])) {
                flattenObject(obj[key], propName, res);
            } else {
                res[propName] = obj[key];
            }
        }
        return res;
    };

    // Flatten each object in the JSON array
    const flattenedData = json.map(item => flattenObject(item));

    // Get CSV headers from flattened keys
    const headers = Object.keys(flattenedData.reduce((acc, curr) => ({ ...acc, ...curr }), {}));

    // Convert to CSV format
    const csv = [
        headers.join(','), // Header row
        ...flattenedData.map(row => headers.map(header => JSON.stringify(row[header] || "")).join(',')) // Data rows
    ].join('\n');

    return csv;
}

// Sample JSON data
const data = [
    {
        "name": "John Doe",
        "contact": {
            "email": "john@example.com",
            "phone": "555-1234"
        },
        "address": {
            "city": "New York",
            "zip": "10001"
        },
        "age": 28
    },
    {
        "name": "Jane Smith",
        "contact": {
            "email": "jane@example.com",
            "phone": null
        },
        "address": {
            "city": "Los Angeles",
            "zip": "90001"
        },
        "age": 32
    },
    {
        "name": "Bob Johnson",
        "contact": {
            "email": "bob@example.com",
            "phone": "555-5678"
        },
        "address": {},
        "age": 40
    }
];

// Convert JSON to CSV
const csvData = jsonToCsv(data);
console.log(csvData);
