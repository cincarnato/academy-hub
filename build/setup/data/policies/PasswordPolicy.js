const projectPasswordPolicy = {
    minLength: 6,
    maxLength: 32,
    requireUppercase: false,
    requireLowercase: false,
    requireNumber: false,
    requireSpecialChar: false,
    disallowSpaces: false,
    preventReuse: 3,
    expirationDays: null
};
export { projectPasswordPolicy };
