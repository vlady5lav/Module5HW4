import React, { ReactElement, ReactNode } from 'react';
import { Card, CardGroup, Spinner } from 'react-bootstrap';

interface ICardProps {
    keyId: number;
    children: ReactNode;
}

const CardsGroup = (props: ICardProps): ReactElement => (
    <CardGroup key={props.keyId}>
        {props.children}
    </CardGroup>
)

export interface ICardItemProps {
    id?: number | string;
    img?: string;
    title?: string;
    subtitle?: string;
    text?: string;
    cardHeader?: string;
    cardFooter?: string;
}

const CardItem = (props: ICardItemProps): ReactElement => (
    <Card key={props?.id ?? props?.title}>
        <Card.Header>
            {props?.cardHeader}
        </Card.Header>
        <Card.Body>
            {
                props?.img
                    ?
                    <Card.Img src={props?.img} className='avatar' />
                    :
                    <></>
            }
            {
                props?.title
                    ?
                    <Card.Title>
                        {props?.title}
                    </Card.Title>
                    :
                    <></>
            }
            {
                props?.subtitle
                    ?
                    <Card.Subtitle>
                        {props?.subtitle}
                    </Card.Subtitle>
                    :
                    <></>
            }
            {
                props?.text
                    ?
                    <Card.Text>
                        {props?.text}
                    </Card.Text>
                    :
                    <></>
            }
        </Card.Body>
        <Card.Footer>
            {props?.cardFooter}
        </Card.Footer>
    </Card>
);

export const LoadingGenerator = (): ReactElement => (
    <>
        <span>Loading...</span>
        <Spinner animation="border" role="status" />
    </>
);

const ListComponent = (props: ICardItemProps[]): ReactElement => {
    const child = props.map(
        prop => <CardItem key={Math.random() * 10000} img={prop?.img} text={prop?.text} title={prop?.title}
            subtitle={prop?.subtitle} id={prop?.id} cardHeader={prop?.cardHeader} cardFooter={prop?.cardFooter} />
    );

    return (
        <CardsGroup key={Math.random() * 10000} keyId={Math.random() * 10000} children={child} />
    );
}

export default ListComponent;
