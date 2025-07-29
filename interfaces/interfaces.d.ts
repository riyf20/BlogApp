interface Blog {
    id: number;
    title: string;
    body: string;
    author: string;
    created_at: string;
    updated_at: string;
}

interface Picture {
    blogid: number;
    author: string;
    image_blob: string;
    id: number;
    created_at: string;
    updated_at: string;
}