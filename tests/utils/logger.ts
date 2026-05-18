export function logStep(message: string) {
    console.log(`\n🔹 ${message}`);
}

export function logSuccess(message: string): void {
    console.log(`✅ ${message}`);
}

export function logError(message: string): void {
    console.log(`❌ ${message}`);
}