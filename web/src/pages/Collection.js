import React, { 
    useEffect,
} from 'react';

function Collection() {
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [user, setUser] = React.useState({});

    useEffect(() => {
        fetch("http://localhost:5000/user/1/")
        .then(res => res.json())
        .then((result) => {
            setIsLoaded(true);
            if (result.code !== 200) {
                setError(result.content);
            } else {
                setUser(result.content);
            }
        }, (error) => {
            setIsLoaded(true);
            setError(error);
        });
    }, []);

    if (error) {
        return <div>Error: {error.message}</div>;
    }

    if (!isLoaded) {
        return <div>Loading...</div>;
    } 

    return (
        <div>
            <h1>{user.first_name}'s Collection</h1>
        </div>
    )
}

export default Collection;