export function logError (operation: string, error: any): void {
    console.error('Error occursed in ' + operation);
    console.log(error);
}
