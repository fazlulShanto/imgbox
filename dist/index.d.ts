/// <reference types="node" />
interface Images {
    filename: string;
    buffer: Buffer;
}
interface Url {
    filename: string;
    url: string;
}
export type Files = string[] | string | Buffer[] | Buffer | Images[] | Images | Url[] | Url;
export interface Result {
    ok: boolean;
    gallery_edit: string;
    files?: UploadedFile[];
    message?: string;
}
export interface UploadedFile {
    id: string;
    slug: string;
    name: string;
    name_html_escaped: string;
    created_at: Date;
    created_at_human: string;
    updated_at: Date;
    gallery_id: string;
    url: string;
    original_url: string;
    thumbnail_url: string;
    square_url: string;
    selected: boolean;
    comments_enabled: number;
    comments_count: number;
}
export declare const Uploader: (images: Files) => Promise<Result>;
export default Uploader;
