import { useState, useEffect } from 'react';
import { UserType } from './type/DataType';
import './App.css';

const App:React.FC = () => {
  const [ users, setUsers ] = useState<UserType[]>([]);
  const [ dragIndex, setDragIndex ] = useState<number | null>(null);
  const [isError, setIsError] = useState(false);

  useEffect(() => {
    const getUsers = async () => {
      try{
        const result = await fetch('https://jsonplaceholder.typicode.com/users');
        const allUsers = await result.json();
        if(!allUsers.length) throw new Error('データを取得できませんでした');
        setUsers(allUsers)
        setIsError(false);
      }catch(err){
        setIsError(true);
      }
    };
    getUsers();
  },[]);

  const dragStart = (index:number) => {
    setDragIndex(index)
  };

  const dragEnter = (index:number) => {
    setUsers(prev => {
      if(index === dragIndex) return prev;
      const newUsers = [...prev];
      const deleteElement = newUsers.splice(dragIndex!,1)[0];
      newUsers.splice(index,0,deleteElement);
      return newUsers;
    });
    setDragIndex(index);
  };

  const dragEnd = () => {
    setDragIndex(null)
  };

  return (
    <>
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>NAME</th>
            <th>USERNAME</th>
            <th>EMAIL</th>
          </tr>
        </thead>
        <tbody>
          {
            users.map((user,index) => {
              return (
              <tr 
                key={user.id}
                draggable='true'
                onDragStart={() => dragStart(index)}
                onDragEnter={() => dragEnter(index)}
                onDragOver={(e) => e.preventDefault()}
                onDragEnd={() => dragEnd()}
                className={index === dragIndex ? 'dragging' : ''}
              >
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.username}</td>
                <td>{user.email}</td>
              </tr>
              )
            })
          }
        </tbody>
      </table>
      { isError && <h3>データを取得できませんでした</h3>}
    </>
  );
}

export default App;
