/// <reference types="node" />
interface Images {
    filename: string;
    buffer: Buffer;
}
interface Url {
    filename: string;
    url: string;
}
type Files = string[] | string | Buffer[] | Buffer | Images[] | Images | Url[] | Url;
interface Result {
    ok: boolean;
    gallery_edit?: string;
    files?: any[];
    message?: string;
}
export declare function imgbox(images: Files): Promise<Result>;
export {};
