import React, { 
    useEffect,
} from 'react';

function Users() {
    const [error, setError] = React.useState(null);
    const [isLoaded, setIsLoaded] = React.useState(false);
    const [users, setUsers] = React.useState([]);

    useEffect(() => {
        fetch("http://localhost:5000/users?p=1&n=20")
        .then(res => res.json())
        .then((result) => {
            setIsLoaded(true);
            if (result.code !== 200) {
                setError(result.content);
            } else {
                setUsers(result.content);
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
            <h1>Users</h1>
           {users.map(user => (
               <p key={user.id}>{user.id} - {user.last_name}, {user.first_name}</p>
           ))}
        </div>
    )
}

export default Users;