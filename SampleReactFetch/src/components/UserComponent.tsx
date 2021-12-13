import React, { ReactElement, useEffect, useState } from 'react';
import ListComponent, { LoadingGenerator, CardItemProps } from './ListComponent'
import { getResponse, HttpRequestMethod } from './ApiService';
import CreateEmployeeResponse from '../dtos/CreateEmployeeResponse';
import Employee from '../models/Employee';
import EmployeeDTO from '../dtos/EmployeeDTO';
import ResponseDTO from '../dtos/ResponseDTO';
import UpdateEmployeeResponse from '../dtos/UpdateEmployeeResponse';
import User from '../models/User';
import UserDTO from '../dtos/UserDTO';

const getUserById = async (id: number, delay = 0): Promise<User> => {
    const response = await (
        await getResponse<undefined, ResponseDTO<UserDTO>>(
            { requestUrl: delay == 0 ? `users/${id}` : `users/${id}?delay=${delay}`, method: HttpRequestMethod.GET })
    ).data;
    return response;
}

const getUsersByPage = async (page: number, delay = 0): Promise<User[]> => {
    const response = await (
        await getResponse<undefined, ResponseDTO<UserDTO[]>>(
            { requestUrl: delay == 0 ? `users?page=${page}` : `users?page=${page}?delay=${delay}`, method: HttpRequestMethod.GET })
    ).data;
    return response;
}

const createUser = async (employee: EmployeeDTO): Promise<Employee> => {
    const response = await getResponse<EmployeeDTO, CreateEmployeeResponse>(
        { requestUrl: 'users', method: HttpRequestMethod.POST, payload: employee });
    return response;
}

const updatePatchUserById = async (id: number, employee: EmployeeDTO): Promise<Employee> => {
    const response = await getResponse<EmployeeDTO, UpdateEmployeeResponse>(
        { requestUrl: `users/${id}`, method: HttpRequestMethod.PATCH, payload: employee });
    return response;
}

const updatePutUserById = async (id: number, employee: EmployeeDTO): Promise<Employee> => {
    const response = await getResponse<EmployeeDTO, UpdateEmployeeResponse>(
        { requestUrl: `users/${id}`, method: HttpRequestMethod.PUT, payload: employee });
    return response;
}

/*
const deleteUserById = async (id: number): Promise<unknown> => {
    const response = await getResponse<unknown, unknown>(
        { requestUrl: `users/${id}`, method: HttpRequestMethod.DELETE });
    return response;
}
*/

const UserComponent = (): ReactElement => {
    const [loading, setLoading] = useState(true);

    const [user, setUser] = useState<User | null>(null);
    const [users, setUsers] = useState<User[] | null>(null);
    const [unavaibleUser, setUnavaibleUser] = useState<User | null>(null);

    const [createdUser, setCreatedUser] = useState<Employee | null>(null);
    const [updatedPatchedUser, setUpdatedPatchedUser] = useState<Employee | null>(null);
    const [updatedPutUser, setUpdatedPutUser] = useState<Employee | null>(null);

    // const [deletedUser, setDeletedUser] = React.useState<unknown | null>(null);

    const getResult = async (): Promise<void> => {
        const resultGetUser = await getUserById(2);
        const resultGetUsers = await getUsersByPage(2);
        const resultGetUnavaibleUser = await getUserById(17);

        const createdUser: EmployeeDTO = { name: 'morpheus', job: 'leader' };
        const resultCreateUser = await createUser(createdUser);

        const employee: EmployeeDTO = { name: 'morpheus', job: 'zion resident' };
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

    const getUserProps = (user: User): CardItemProps => {
        if (user == null) {
            throw Error('User is null or undefined!');
        }

        return { id: user?.id, img: user?.avatar, title: `${user?.first_name} ${user?.last_name}`, subtitle: user?.email, cardHeader: `ID: ${user?.id}` };
    }

    const getUsersProps = (users: User[]): CardItemProps[] => {
        if (user == null) {
            throw Error('Users are null or undefined!');
        }

        const cardItemProps: CardItemProps[] = [];

        for (const user of users) {
            if (user != null) {
                const props = getUserProps(user);
                cardItemProps.push(props);
            }
        }

        return cardItemProps;
    }

    const dateTimeOptions: Intl.DateTimeFormatOptions = { dateStyle: "long", timeStyle: "long", hour12: false };

    const getCreatedUserProps = (employee: Employee): CardItemProps => {
        if (employee == null) {
            throw Error('Employee is null or undefined!');
        }

        const rawDate = employee?.createdAt ? new Date(employee?.createdAt) : undefined;
        const localeDate = rawDate?.toLocaleString("en-US", dateTimeOptions);

        return { title: 'Name: ' + employee?.name, subtitle: 'Job: ' + employee?.job, cardFooter: `Created: ${localeDate}`, cardHeader: 'User created successfully!' };
    }

    const getUpdatedUserProps = (employee: Employee): CardItemProps => {
        if (employee == null) {
            throw Error('Employee is null or undefined!');
        }

        const rawDate = employee?.updatedAt ? new Date(employee?.updatedAt) : undefined;
        const localeDate = rawDate?.toLocaleString("en-US", dateTimeOptions);

        return { title: 'Name: ' + employee?.name, subtitle: 'Job: ' + employee?.job, cardFooter: `Updated: ${localeDate}`, cardHeader: 'User updated successfully!'  };
    }

    const userProps: CardItemProps[] = user ? Array.of(getUserProps(user)) : [];
    const usersProps: CardItemProps[] = users ? getUsersProps(users) : [];
    const unavaibleUserProps: CardItemProps[] = unavaibleUser ? Array.of(getUserProps(unavaibleUser)) : [];
    const createdUserProps: CardItemProps[] = createdUser ? Array.of(getCreatedUserProps(createdUser)) : [];
    const updatedPatchedUserProps: CardItemProps[] = updatedPatchedUser ? Array.of(getUpdatedUserProps(updatedPatchedUser)) : [];
    const updatedPutUserProps: CardItemProps[] = updatedPutUser ? Array.of(getUpdatedUserProps(updatedPutUser)) : [];

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
