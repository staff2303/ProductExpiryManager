declare module 'react-native-sqlite-storage' {
  export interface SQLiteDatabase {
    executeSql(
      sqlStatement: string,
      args?: any[],
    ): Promise<[{
      rows: {
        length: number;
        item: (index: number) => any;
      };
    }]>;
  }

  export interface SQLiteStatic {
    openDatabase(options: {
      name: string;
      location?: string;
    }): Promise<SQLiteDatabase>;

    enablePromise(enabled: boolean): void;
  }

  const SQLite: SQLiteStatic;
  export default SQLite;
}