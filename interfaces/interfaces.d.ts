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

interface User {
    id: number;
    isGuest: boolean;
    role: string;
    username: string;
}

interface UserProfile {
    email: string;
    first_name: string;
    id: number;
    last_name: string;
    password_txt: string;
    username: string;
};

interface InfoModal {
    showModal: boolean,
    setShowModal: (boolean) => void,
    heading: string,
    body: string,
    buttonText: string,
    parent: string,
    confirmFunction: () => void,
}

interface ProfileInputProps {
    title: string, 
    disabled: boolean, 
    userInput: string, 
    setInput: (arg0: string) => void;
    valid: boolean
    setValid: (arg0: boolean) => void;
    error: string,
}

interface usersBlog {
    author: string,
    body: string,
    created_at: string,
    id: number, 
    title: string,
    updated_at: string,
}
interface usersComment {
    author: string,
    body: string,
    created_at: string,
    id: number, 
    postid: number, 
    updated_at: string,
}