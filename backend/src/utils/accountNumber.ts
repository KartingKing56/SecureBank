export function generateAccountNumber(): string {
    let account = '';
    for (let i = 0; i < 10; i++) {
        account += Math.floor(Math.random() * 10);
    }
    return account;
}