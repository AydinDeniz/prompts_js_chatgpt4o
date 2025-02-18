
// Function to evaluate user-defined formulas dynamically

function evaluateFormula(formula, variables) {
    try {
        // Validate formula to prevent security risks
        if (!/^[0-9+\-*/().a-zA-Z\s]+$/.test(formula)) {
            throw new Error("Invalid characters in formula.");
        }

        // Replace variables with actual values
        for (const [key, value] of Object.entries(variables)) {
            const regex = new RegExp(`\\b${key}\\b`, "g");
            formula = formula.replace(regex, value);
        }

        // Use Function constructor to safely evaluate expression
        return new Function(`return ${formula};`)();
    } catch (error) {
        return `Error: ${error.message}`;
    }
}

// Example usage
const formula = "income - expenses + (bonus * 2)";
const variables = {
    income: 5000,
    expenses: 2000,
    bonus: 500,
};

const result = evaluateFormula(formula, variables);
console.log("Calculated Result:", result);
