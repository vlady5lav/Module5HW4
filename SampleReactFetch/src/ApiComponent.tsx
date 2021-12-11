const apiUrl = 'https://reqres.in/api';

export const getResponse = async <Tin, Tout>({ requestUrl, method, payload }: IRequestOptions<Tin>): Promise<Tout> => {
    const requestOptions = {
        method: `${HttpRequestMethod[method]}`,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload) ?? undefined,
    };

    return await responseHandler<Tout>(await fetch(`${apiUrl}${requestUrl}`, requestOptions));
}

const responseHandler = async <Tout,>(response: Response): Promise<Tout> => {
    if (response?.ok) {
        return await response?.json();
    }
    else {
        console.log(`[ERROR] responseHandler: status: "${response?.status} ${response?.statusText}", url: "${response?.url}"`);
        return await response?.json();
    }
}

export enum HttpRequestMethod { DELETE, GET, PATCH, POST, PUT }

interface IRequestOptions<T> {
    requestUrl: string,
    method: HttpRequestMethod,
    payload?: T,
}
