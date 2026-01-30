import "axios";

declare module "axios" {
    export interface AxiosRequestConfig {
        meta?: {
            ignore401?: boolean;
            suppress401Toast?: boolean;
        };
    }
}
