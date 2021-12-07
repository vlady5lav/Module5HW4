import React, { useState, useEffect } from 'react';

import Container from 'react-bootstrap/Container';
import ListGroup from 'react-bootstrap/ListGroup';
import Badge from 'react-bootstrap/Badge';
import Spinner from 'react-bootstrap/Spinner';

interface IListItemProps {
  title: string;
  description: string;
  count: number;
}

const ListItem = (props: IListItemProps) => (
          <ListGroup.Item as="li"
                          className="d-flex justify-content-between align-items-start">
                            <div className="ms-2 me-auto">
                              <div className="fw-bold">{props.title}</div>
                              {props.description}
                            </div>
                          <Badge bg="primary" pill>
                              {props.count}
                          </Badge>
          </ListGroup.Item>
  );

interface IListProps {
    children: React.ReactNode;
}

const List = (props: IListProps) => (
  <ListGroup as="ol" numbered>
    {props.children}
  </ListGroup>
)

function App() {
  const [loading, setLoading] = useState(true);
  const [header, setHeader] = useState('');

  function sleep(ms : number) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async function longOperation() : Promise<string> {
    const text = "Custom list";
    await sleep(2000);
    return text;
  }

  // Similar to componentDidMount and componentDidUpdate:
  useEffect(() => {

    async function init() {
      const result = await longOperation();
      setHeader(result);
      setLoading(false);
    }

    init();
  });

  return (
    <Container className="p-3">
      <Container className="pb-1 p-5 mb-4 bg-light rounded-3">
        {loading && <span>Loading...</span>
        }
        {loading 
                ? <Spinner animation="border" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </Spinner>
                :
                <>
                  <h1 className="header">{header}</h1>
                  <List>
                    <ListItem title="bla bla" description="moo noo loo" count={4}  />
                    <ListItem title="bla bla" description="moo noo loo" count={4}  />
                    <ListItem title="bla bla" description="moo noo loo" count={4}  />
                    <ListItem title="bla bla" description="moo noo loo" count={4}  />
                    <ListItem title="bla bla" description="moo noo loo" count={4}  />
                    <ListItem title="bla bla" description="moo noo loo" count={4}  />
                    <ListItem title="bla bla" description="moo noo loo" count={4}  />
                  </List>
                </>
        }
        
      </Container>
    </Container>
  );
}

interface IEmployee {
  name: string;
  job: string;
  id: number;
  createdAt: string;
  updatedAt: string;
}
interface IUserData {
  data: IUser;
}
interface IUser {
  email: string;
  first_name: string;
  id: number;
  last_name: string;
  url_avatar: string;
}

async function get() : Promise<IUserData> {
  const response = await fetch('https://reqres.in/api/users/2');
  return await response.json();
}

async function post() : Promise<IEmployee> {
  const requestOptions = {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: 'morpheus', job: 'leader' })
  };
  const response = await fetch('https://reqres.in/api/users', requestOptions);
  return await response.json();
}

export function UserComponent() {

  const [createdUser, setCreatedUser] = React.useState<IUser[]>([]);

  const [emploee, setEmploee] = React.useState<IEmployee[]>([]);

  useEffect(() => {

    async function init() {
        const resultGet = await get();
        setCreatedUser([resultGet.data]);
        const resultPost = await post();
        setEmploee([resultPost]);
    }

     init();
  }, []);

  return(<>
            {createdUser.map(item => (
                    <ListItem key={item.id} title={item.email} description={item.first_name + ' ' + item.last_name} count={item.id}  />
                  ))}
            {emploee.map(item => (
                    <ListItem key={item.id} title={item.job} description={item.name} count={item.id}  />
                  ))}
          </>);
}

export default App;
