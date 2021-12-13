import React, { ReactElement, useEffect, useState } from "react";
import ListComponent, { LoadingGenerator, CardItemProps } from './ListComponent'
import { getResponse, HttpRequestMethod } from './ApiService';
import AuthDTO from '../dtos/AuthDTO';
import ErrorMessage from '../models/ErrorMessage';
import ErrorMessageDTO from '../dtos/ErrorMessageDTO';
import LoginResponse from '../dtos/LoginResponse';
import LoginResult from '../models/LoginResult';
import RegisterResponse from '../dtos/RegisterResponse';
import RegisterResult from '../models/RegisterResult';

const registerRequest = async (credentials: AuthDTO): Promise<RegisterResult | ErrorMessage> => {
    const response = await getResponse<AuthDTO, RegisterResponse | ErrorMessageDTO>(
        { requestUrl: 'register', method: HttpRequestMethod.POST, payload: credentials });
    return response;
}

const loginRequest = async (credentials: AuthDTO): Promise<LoginResult | ErrorMessage> => {
    const response = await getResponse<AuthDTO, LoginResponse | ErrorMessageDTO>(
        { requestUrl: 'login', method: HttpRequestMethod.POST, payload: credentials });
    return response;
}

const AuthComponent = (): ReactElement => {
    const [loading, setLoading] = useState(true);

    const [registerOk, setRegisterOk] = useState<RegisterResult | ErrorMessage | null>(null);
    const [registerFail, setRegisterFail] = useState<RegisterResult | ErrorMessage | null>(null);
    const [loginOk, setLoginOk] = useState<LoginResult | ErrorMessage | null>(null);
    const [loginFail, setLoginFail] = useState<LoginResult | ErrorMessage | null>(null);

    const getResult = async (): Promise<void> => {

        const registerCredentialsOk: AuthDTO = { email: "eve.holt@reqres.in", password: "pistol" };
        const registerCredentialsFail: AuthDTO = { email: "sydney@fife" };
        const loginCredentialsOk: AuthDTO = { email: "eve.holt@reqres.in", password: "cityslicka" };
        const loginCredentialsFail: AuthDTO = { email: "peter@klaven" };

        const resultRegisterOk = await registerRequest(registerCredentialsOk);
        const resultRegisterFail = await registerRequest(registerCredentialsFail);
        const resultLoginOk = await loginRequest(loginCredentialsOk);
        const resultLoginFail = await loginRequest(loginCredentialsFail);

        setRegisterOk(resultRegisterOk);
        setRegisterFail(resultRegisterFail);
        setLoginOk(resultLoginOk);
        setLoginFail(resultLoginFail);

        setLoading(false);
    }

    useEffect(() => {
        getResult();
    }, []);

    const getAuthProps = (auth: RegisterResult | LoginResult | ErrorMessage): CardItemProps => {
        if (auth == null) {
            throw Error('Auth is null!');
        }

        const authProps: CardItemProps = {};
        
        if (Object.prototype.hasOwnProperty.call(auth, "error")) {
            authProps.title = `Error: ${(auth as ErrorMessage)?.error}`;
            authProps.cardFooter = 'Auth failed!';
        }

        if (Object.prototype.hasOwnProperty.call(auth, "id")) {
            authProps.title = `ID: ${(auth as RegisterResult)?.id}`;
            authProps.subtitle = `Token: ${(auth as RegisterResult)?.token}`;
            authProps.cardFooter = 'Register successful!';
        }

        if (Object.prototype.hasOwnProperty.call(auth, "token")) {
            authProps.title = `Token: ${(auth as LoginResult)?.token}`;
            authProps.cardFooter = 'Login successful!';
        }

        authProps.cardHeader = 'Auth Data';

        return authProps;
    }

    const registerOkProps: CardItemProps[] = registerOk ? Array.of(getAuthProps(registerOk)) : [];
    const registerFailProps: CardItemProps[] = registerFail ? Array.of(getAuthProps(registerFail)) : [];
    const loginOkProps: CardItemProps[] = loginOk ? Array.of(getAuthProps(loginOk)) : [];
    const loginFailProps: CardItemProps[] = loginFail ? Array.of(getAuthProps(loginFail)) : [];

    return (
        <>
            {
                loading
                    ?
                    <LoadingGenerator />
                    :
                    <>
                        {ListComponent(registerOkProps)}
                        {ListComponent(registerFailProps)}
                        {ListComponent(loginOkProps)}
                        {ListComponent(loginFailProps)}
                    </>
            }
        </>
    );
}

export default AuthComponent;
