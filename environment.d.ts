declare global {
    namespace NodeJS {
        interface ProcessEnv {
            OPENAI_API_KEY: string;
        }
    }

    //Like Omit, but causes a type error if the key is not present in the object
    type OmitMod<Obj, Key extends keyof Obj> = {
        [K in keyof Obj as K extends Key ? never : K]: Obj[K];
    };
}

export {};
