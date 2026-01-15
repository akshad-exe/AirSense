// Type declarations for bun:sqlite
declare module 'bun:sqlite' {
    export interface DatabaseOptions {
        create?: boolean;
        readonly?: boolean;
        readwrite?: boolean;
    }

    export interface RunResult {
        changes: number;
        lastInsertRowid: number | bigint;
    }

    export class Statement {
        run(...params: any[]): RunResult;
        get(...params: any[]): any;
        all(...params: any[]): any[];
        finalize(): void;
    }

    export class Database {
        constructor(filename: string, options?: DatabaseOptions);

        prepare(sql: string): Statement;
        exec(sql: string): void;
        close(): void;

        query(sql: string): Statement;
        run(sql: string, ...params: any[]): RunResult;
    }

    export default Database;
}
