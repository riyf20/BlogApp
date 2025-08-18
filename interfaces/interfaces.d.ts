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
    fileUrl: string;
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
}

interface usersBlog {
    author: string;
    body: string;
    created_at: string;
    id: number; 
    title: string;
    updated_at: string;
}

interface usersComment {
    author: string;
    body: string;
    created_at: string;
    id: number; 
    postid: number; 
    updated_at: string;
}

interface ImageItem {
    fileUri: string;
    base64: string;
}

interface InfoModal {
    showModal: boolean;
    setShowModal: (boolean) => void;
    heading: string;
    body: string;
    buttonText: string;
    parent: string;
    confirmFunction: () => void;
    imgUri?: string;
}

interface ProfileInputProps {
    title: string;
    disabled: boolean;
    userInput: string;
    setInput: (arg0: string) => void;
    valid: boolean;
    setValid: (arg0: boolean) => void;
    error: string;
}

interface BottomProps {
    images?: ImageItem[];
    setImages?: (args0: any) => void;
    parent:string,
    comments?: usersComment[]
    keyboard?: Boolean
    fetchComments?: () => void;
}

interface BottomSheetHandle {
    open: () => void;
    commentUp: () => void;
    commentDown: () => void;
    close: () => void;
}

interface FormInputProps {
    invalid: boolean;
    placeholder: string;
    value: string;
    parentInvalid: boolean;
    setValue: (arg0: string) => void;
    setValueInvalid: (arg0: boolean) => void;
    setParentInvalid: (arg0: boolean) => void;
    error: string;
    textarea?: boolean;
    parent?:string;
}

interface ImageCardProps {
    uri: string;
    onPress: (args0: number) => void;
    onLongPress: (args0: number) => void;
    index: number;
    parent: string;
}

interface ImageUploaderProps {
    images: ImageItem[];
    setImages: (args0: any) => void;
    setClose: () => void;
}


interface ToastNotifProps {
    title:string
    message:string
    show:boolean
    setShow: (boolean) => void;
}

interface CommentSectionProps extends usersComment {
    index: number;
    fetchComments?: () => void;
}

interface BlogCardProps extends Blog {
    index: number;
    edit: boolean;
    setIndex?: (number:any) => void;
    type?: (type:string) => void;    
}

interface CommentCardProps extends usersComment {
    index: number;
    edit: boolean;
    setIndex?: (number:any) => void;
    type?: (type:string) => void;        
}