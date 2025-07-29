import { useState, useEffect } from "react";

const useFetch = <T>(url: string, method = 'GET') => {
    
    const [data, setData] = useState<T | null>(null);    
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null)    
    
    useEffect(() => {  

        const abortCont = new AbortController();

            fetch(url, {method, signal: abortCont.signal})
                .then(res => {
                    if(!res.ok) {
                        throw Error('Blog not found');
                    }
                    return res.json();
                })
                .then((data: T) => {
                    setData(data);
                    setIsLoading(false);
                    setError(null);
                })
                .catch(err => {
                    if (err.name === 'AbortError') {
                    } else {
                        setIsLoading(false);
                        setError(err.message); 
                    }
                    
                })  

        return () => abortCont.abort();

    }, [url, method]);

    return {data, isLoading, error}
}

export default useFetch;