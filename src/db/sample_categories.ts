const sample_categories = [
    "Login Issues",
    "Performance",
    "Billing",
    "Feature Request",
    "Bug Report",
    "Account Issues",
    "Data Issues",
    "Security",
    "Technical Support",
    "Integration",
] as const;

export const categoryTable = Object.fromEntries(
    sample_categories.map((category) => [category, category])
);

export default sample_categories;
