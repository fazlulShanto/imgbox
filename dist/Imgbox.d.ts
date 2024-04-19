/// <reference types="node" />
import { AxiosInstance } from 'axios';
interface FinalResult {
    ok: boolean;
    message?: string;
    gellery_edit?: string;
    files?: any[];
}
interface Images {
    filename: string;
    buffer: Buffer;
}
declare class Imgbox {
    token: {
        token_id: number;
        token_secret: string;
        gallery_id: string;
        gallery_secret: string;
    };
    client: AxiosInstance;
    csrf: string;
    cookie: string;
    config: {
        headers: {
            'X-CSRF-Token': string;
            Cookie: string;
        };
    };
    constructor();
    setConfig: (csrf: string, cookie: string) => void;
    getToken: () => Promise<void>;
    getAuthenticityToken: () => Promise<void>;
    upload: (images: Images[]) => Promise<FinalResult>;
    init: () => Promise<Function>;
}
export default Imgbox;
