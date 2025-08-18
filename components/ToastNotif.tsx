import { Button, ButtonText, Divider, useToast, Toast, ToastTitle, Icon, ToastDescription } from '@gluestack-ui/themed';
import { Flag, Send } from "lucide-react-native"
import { useEffect } from 'react';

const ToastNotif = ({title, message, show, setShow}:ToastNotifProps) => {
  
    const toast = useToast();

    useEffect(() => {
        if(show) {
            toast.show({
                duration: 2000,
                placement:"top",
                render: ({ id }) => {
                const toastId = "toast-" + id;
                return (
                    <Toast
                        nativeID={toastId}
                        className="px-5 py-3 gap-4 shadow-soft-1 items-center flex-row"
                    >
                    <Icon
                        as={Flag}
                        size="xl"
                        className="fill-typography-100 stroke-none"
                    />
                    <Divider
                        orientation="vertical"
                        className="h-[30px] bg-outline-200"
                    />
                    <ToastTitle size="sm">{title}</ToastTitle>
                    <ToastDescription>{message}</ToastDescription>
                    </Toast>
                );
                },
            });
            
            const timer = setTimeout(() => {
                setShow(false)
            }, 50)

            return () => clearTimeout(timer)
        }
    }, [show])
    

    return (null);
}

export default ToastNotif
