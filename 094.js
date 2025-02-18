
// JavaScript Sanitization Library for XSS, SQL Injection, and Input Validation

const he = require("he");
const sanitizeHtml = require("sanitize-html");

const tenantRules = {};

// Register custom sanitization rules per tenant
function registerTenant(tenantId, rules) {
    tenantRules[tenantId] = rules;
}

// Context-aware XSS prevention
function sanitizeXSS(input, tenantId) {
    const rules = tenantRules[tenantId] || {};
    return sanitizeHtml(input, {
        allowedTags: rules.allowedTags || [],
        allowedAttributes: rules.allowedAttributes || {},
    });
}

// Prevent SQL Injection by escaping dangerous characters
function sanitizeSQL(input) {
    return input.replace(/['";]/g, "").trim();
}

// General input validation and encoding handling
function validateInput(input, encoding = "utf-8") {
    if (encoding !== "utf-8") {
        return he.encode(input, { useNamedReferences: true });
    }
    return input.trim();
}

// Multi-tenant sanitization function
function sanitizeInput(input, tenantId, encoding = "utf-8") {
    let sanitized = validateInput(input, encoding);
    sanitized = sanitizeSQL(sanitized);
    sanitized = sanitizeXSS(sanitized, tenantId);
    return sanitized;
}

// Example usage
registerTenant("tenantA", { allowedTags: ["b", "i"], allowedAttributes: {} });
console.log(sanitizeInput("<script>alert('XSS')</script>", "tenantA"));
