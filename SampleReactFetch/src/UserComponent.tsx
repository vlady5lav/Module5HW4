import React, { ReactElement, useEffect, useState } from 'react';
import ListComponent, { LoadingGenerator, ICardItemProps } from './ListComponent'
import { getResponse, HttpRequestMethod } from './ApiComponent';
import ICreateEmployeeResponse from './DTO/CreateEmployeeResponse';
import IEmployee from './Models/Employee';
import IEmployeeDTO from './DTO/EmployeeDTO';
import IResponseDTO from './DTO/ResponseDTO';
import IUpdateEmployeeResponse from './DTO/UpdateEmployeeResponse';
import IUser from './Models/User';
import IUserDTO from './DTO/UserDTO';

const getUserById = async (id: number, delay = 0): Promise<IUser> => {
    const response = await (
        await getResponse<undefined, IResponseDTO<IUserDTO>>(
            { requestUrl: delay == 0 ? `/users/${id}` : `/users/${id}?delay=${delay}`, method: HttpRequestMethod.GET })
    ).data;
    return response;
}

const getUsersByPage = async (page: number, delay = 0): Promise<IUser[]> => {
    const response = await (
        await getResponse<undefined, IResponseDTO<IUserDTO[]>>(
            { requestUrl: delay == 0 ? `/users?page=${page}` : `/users?page=${page}?delay=${delay}`, method: HttpRequestMethod.GET })
    ).data;
    return response;
}

const createUser = async (employee: IEmployeeDTO): Promise<IEmployee> => {
    const response = await getResponse<IEmployeeDTO, ICreateEmployeeResponse>(
        { requestUrl: '/users', method: HttpRequestMethod.POST, payload: employee });
    return response;
}

const updatePatchUserById = async (id: number, employee: IEmployeeDTO): Promise<IEmployee> => {
    const response = await getResponse<IEmployeeDTO, IUpdateEmployeeResponse>(
        { requestUrl: `/users/${id}`, method: HttpRequestMethod.PATCH, payload: employee });
    return response;
}

const updatePutUserById = async (id: number, employee: IEmployeeDTO): Promise<IEmployee> => {
    const response = await getResponse<IEmployeeDTO, IUpdateEmployeeResponse>(
        { requestUrl: `/users/${id}`, method: HttpRequestMethod.PUT, payload: employee });
    return response;
}

/*
const deleteUserById = async (id: number): Promise<any> => {
    const response = await getResponse<any, any>(
        { requestUrl: `/users/${id}`, method: HttpRequestMethod.DELETE });
    return response;
}
*/

const UserComponent = (): ReactElement => {
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState<IUser | null>(null);
    const [users, setUsers] = useState<IUser[] | null>(null);
    const [unavaibleUser, setUnavaibleUser] = useState<IUser | null>(null);

    const [createdUser, setCreatedUser] = useState<IEmployee | null>(null);
    const [updatedPatchedUser, setUpdatedPatchedUser] = useState<IEmployee | null>(null);
    const [updatedPutUser, setUpdatedPutUser] = useState<IEmployee | null>(null);

    // const [deletedUser, setDeletedUser] = React.useState<any | null>(null);

    const getResult = async (): Promise<void> => {
        const resultGetUser = await getUserById(2);
        const resultGetUsers = await getUsersByPage(2);
        const resultGetUnavaibleUser = await getUserById(17);

        const createdUser: IEmployeeDTO = { name: 'morpheus', job: 'leader' };
        const resultCreateUser = await createUser(createdUser);

        const employee: IEmployeeDTO = { name: 'morpheus', job: 'zion resident' };
        const resultUpdatePatchUser = await updatePatchUserById(2, employee);
        const resultUpdatePutUser = await updatePutUserById(2, employee);

        // const resultDeleteUser = await deleteUserById(2);

        setUser(resultGetUser);
        setUsers(resultGetUsers);
        setUnavaibleUser(resultGetUnavaibleUser);

        setCreatedUser(resultCreateUser);
        setUpdatedPatchedUser(resultUpdatePatchUser);
        setUpdatedPutUser(resultUpdatePutUser);

        // setDeletedUser(resultDeleteUser);

        setLoading(false);
    }

    useEffect(() => {
        getResult();
    }, []);

    const getUserProps = (user: IUser): ICardItemProps => {
        if (user == null) {
            throw Error('User is null or undefined!');
        }

        return { id: user?.id, img: user?.avatar, title: `${user?.first_name} ${user?.last_name}`, subtitle: user?.email, cardHeader: `ID: ${user?.id}` };
    }

    const getUsersProps = (users: IUser[]): ICardItemProps[] => {
        if (user == null) {
            throw Error('Users are null or undefined!');
        }

        const cardItemProps: ICardItemProps[] = [];

        for (const user of users) {
            if (user != null) {
                const props = getUserProps(user);
                cardItemProps.push(props);
            }
        }

        return cardItemProps;
    }

    const dateTimeOptions: Intl.DateTimeFormatOptions = { dateStyle: "long", timeStyle: "long", hour12: false };

    const getCreatedUserProps = (employee: IEmployee): ICardItemProps => {
        if (employee == null) {
            throw Error('Employee is null or undefined!');
        }

        const rawDate = employee?.createdAt ? new Date(employee?.createdAt) : undefined;
        const localeDate = rawDate?.toLocaleString("en-US", dateTimeOptions);

        return { title: 'Name: ' + employee?.name, subtitle: 'Job: ' + employee?.job, cardFooter: `Created: ${localeDate}` };
    }

    const getUpdatedUserProps = (employee: IEmployee): ICardItemProps => {
        if (employee == null) {
            throw Error('Employee is null or undefined!');
        }

        const rawDate = employee?.updatedAt ? new Date(employee?.updatedAt) : undefined;
        const localeDate = rawDate?.toLocaleString("en-US", dateTimeOptions);

        return { title: 'Name: ' + employee?.name, subtitle: 'Job: ' + employee?.job, cardFooter: `Updated: ${localeDate}` };
    }

    const userProps: ICardItemProps[] = user ? Array.of(getUserProps(user)) : [];
    const usersProps: ICardItemProps[] = users ? getUsersProps(users) : [];
    const unavaibleUserProps: ICardItemProps[] = unavaibleUser ? Array.of(getUserProps(unavaibleUser)) : [];
    const createdUserProps: ICardItemProps[] = createdUser ? Array.of(getCreatedUserProps(createdUser)) : [];
    const updatedPatchedUserProps: ICardItemProps[] = updatedPatchedUser ? Array.of(getUpdatedUserProps(updatedPatchedUser)) : [];
    const updatedPutUserProps: ICardItemProps[] = updatedPutUser ? Array.of(getUpdatedUserProps(updatedPutUser)) : [];

    return (
        <>
            {
                loading
                    ?
                    <LoadingGenerator />
                    :
                    <>
                        {ListComponent(userProps)}
                        {ListComponent(usersProps)}
                        {ListComponent(unavaibleUserProps)}
                        {ListComponent(createdUserProps)}
                        {ListComponent(updatedPatchedUserProps)}
                        {ListComponent(updatedPutUserProps)}
                    </>
            }
        </>
    );
}

export default UserComponent;
