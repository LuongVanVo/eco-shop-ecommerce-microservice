export const logger = {
    info: (message: string) => console.log(`INFO: ${message}`),
    error: (message: string, error?: unknown) => console.log(`ERROR: ${message}`, error)
}