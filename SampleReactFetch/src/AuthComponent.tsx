import React, { ReactElement, useEffect, useState } from "react";
import ListComponent, { LoadingGenerator, ICardItemProps } from './ListComponent'
import { getResponse, HttpRequestMethod } from './ApiComponent';
import IAuthDTO from './DTO/AuthDTO';
import IError from './Models/Error';
import IErrorDTO from './DTO/ErrorDTO';
import ILoginResponse from './DTO/LoginResponse';
import ILoginResult from './Models/LoginResult';
import IRegisterResponse from './DTO/RegisterResponse';
import IRegisterResult from './Models/RegisterResult';

const registerRequest = async (credentials: IAuthDTO): Promise<IRegisterResult | IError> => {
    const response = await getResponse<IAuthDTO, IRegisterResponse | IErrorDTO>(
        { requestUrl: '/register', method: HttpRequestMethod.POST, payload: credentials });
    return response;
}

const loginRequest = async (credentials: IAuthDTO): Promise<ILoginResult | IError> => {
    const response = await getResponse<IAuthDTO, ILoginResponse | IErrorDTO>(
        { requestUrl: '/login', method: HttpRequestMethod.POST, payload: credentials });
    return response;
}

const AuthComponent = (): ReactElement => {
    const [loading, setLoading] = useState(true);

    const [registerOk, setRegisterOk] = useState<IRegisterResult | IError | null>(null);
    const [registerFail, setRegisterFail] = useState<IRegisterResult | IError | null>(null);
    const [loginOk, setLoginOk] = useState<ILoginResult | IError | null>(null);
    const [loginFail, setLoginFail] = useState<ILoginResult | IError | null>(null);

    const getResult = async (): Promise<void> => {

        const registerCredentialsOk: IAuthDTO = { email: "eve.holt@reqres.in", password: "pistol" };
        const registerCredentialsFail: IAuthDTO = { email: "sydney@fife" };
        const loginCredentialsOk: IAuthDTO = { email: "eve.holt@reqres.in", password: "cityslicka" };
        const loginCredentialsFail: IAuthDTO = { email: "peter@klaven" };

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

    const getAuthProps = (auth: IRegisterResult | ILoginResult | IError): ICardItemProps => {
        if (auth == null) {
            throw Error('Auth is null!');
        }

        const authProps: ICardItemProps = {};
        
        if (Object.prototype.hasOwnProperty.call(auth, "error")) {
            authProps.title = `Error: ${(auth as IError)?.error}`;
            authProps.cardFooter = 'Auth failed!';
        }

        if (Object.prototype.hasOwnProperty.call(auth, "id")) {
            authProps.title = `ID: ${(auth as IRegisterResult)?.id}`;
            authProps.subtitle = `Token: ${(auth as IRegisterResult)?.token}`;
            authProps.cardFooter = 'Register successful!';
        }

        if (Object.prototype.hasOwnProperty.call(auth, "token")) {
            authProps.title = `Token: ${(auth as ILoginResult)?.token}`;
            authProps.cardFooter = 'Login successful!';
        }

        authProps.cardHeader = 'Auth Data';

        return authProps;
    }

    const registerOkProps: ICardItemProps[] = registerOk ? Array.of(getAuthProps(registerOk)) : [];
    const registerFailProps: ICardItemProps[] = registerFail ? Array.of(getAuthProps(registerFail)) : [];
    const loginOkProps: ICardItemProps[] = loginOk ? Array.of(getAuthProps(loginOk)) : [];
    const loginFailProps: ICardItemProps[] = loginFail ? Array.of(getAuthProps(loginFail)) : [];

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
