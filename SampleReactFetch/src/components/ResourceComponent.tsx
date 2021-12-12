import React, { ReactElement, useEffect, useState } from 'react';
import ListComponent, { LoadingGenerator, ICardItemProps } from './ListComponent'
import { getResponse, HttpRequestMethod } from './ApiComponent';
import IResource from '../models/Resource';
import IResourceDTO from '../dto/ResourceDTO';
import IResponseDTO from '../dto/ResponseDTO';

const getResourceById = async (id: number, delay = 0): Promise<IResource> => {
    const response = await (
        await getResponse<undefined, IResponseDTO<IResourceDTO>>(
            { requestUrl: delay == 0 ? `unknown/${id}` : `unknown/${id}?delay=${delay}`, method: HttpRequestMethod.GET })
    ).data;
    return response;
}

const getResourcesByPage = async (page: number, delay = 0): Promise<IResource[]> => {
    const response = await (
        await getResponse<undefined, IResponseDTO<IResourceDTO[]>>(
            { requestUrl: delay == 0 ? `unknown?page=${page}` : `unknown?page=${page}?delay=${delay}`, method: HttpRequestMethod.GET })
    ).data;
    return response;
}

const createResource = async (resource: IResourceDTO): Promise<IResource> => {
    const response = await getResponse<IResourceDTO, IResourceDTO>(
        { requestUrl: 'unknown', method: HttpRequestMethod.POST, payload: resource });
    return response;
}

const updatePatchResourceById = async (id: number, resource: IResourceDTO): Promise<IResource> => {
    const response = await getResponse<IResourceDTO, IResourceDTO>(
        { requestUrl: `unknown/${id}`, method: HttpRequestMethod.PATCH, payload: resource });
    return response;
}

const updatePutResourceById = async (id: number, resource: IResourceDTO): Promise<IResource> => {
    const response = await getResponse<IResourceDTO, IResourceDTO>(
        { requestUrl: `unknown/${id}`, method: HttpRequestMethod.PUT, payload: resource });
    return response;
}

/*
const deleteResourceById = async (id: number): Promise<any> => {
    const response = await getResponse<any, any>(
        { requestUrl: `unknown/${id}`, method: HttpRequestMethod.DELETE });
    return response;
}
*/

const ResourceComponent = (): ReactElement => {
    const [loading, setLoading] = useState(true);

    const [resource, setResource] = useState<IResource | null>(null);
    const [resources, setResources] = useState<IResource[] | null>(null);
    const [unavaibleResource, setUnavaibleResource] = useState<IResource | null>(null);

    const [createdResource, setCreatedResource] = useState<IResource | null>(null);
    const [updatedPatchedResource, setUpdatedPatchedResource] = useState<IResource | null>(null);
    const [updatedPutResource, setUpdatedPutResource] = useState<IResource | null>(null);

    // const [deletedResource, setDeletedResource] = React.useState<any | null>(null);

    const getResult = async (): Promise<void> => {
        const resultGetResource = await getResourceById(2);
        const resultGetResources = await getResourcesByPage(2);
        const resultGetUnavaibleResource = await getResourceById(17);

        const createdResource: IResourceDTO = { id: "20", color: "colored", name: "trinity", pantone_value: "morpheus", year: 1990 };
        const resultCreateResource = await createResource(createdResource);

        const resource: IResourceDTO = { id: "2", color: "colored", name: "morpheus", pantone_value: "trinity", year: 1995 };
        const resultUpdatePatchResource = await updatePatchResourceById(2, resource);
        const resultUpdatePutResource = await updatePutResourceById(2, resource);

        // const resultDeleteUser = await deleteUserById(2);

        setResource(resultGetResource);
        setResources(resultGetResources);
        setUnavaibleResource(resultGetUnavaibleResource);

        setCreatedResource(resultCreateResource);
        setUpdatedPatchedResource(resultUpdatePatchResource);
        setUpdatedPutResource(resultUpdatePutResource);

        // setDeletedResource(resultDeleteResource);

        setLoading(false);
    }

    useEffect(() => {
        getResult();
    }, []);

    const getResourceProps = (resource: IResource): ICardItemProps => {
        if (resource == null) {
            throw Error('Resource is null or undefined!');
        }

        return { cardHeader: 'ID: ' + resource?.id, title: 'Name: ' + resource?.name, subtitle: 'Year: ' + resource?.year, cardFooter: 'Pantone Value: ' + resource?.pantone_value };
    }

    const getResourcesProps = (resources: IResource[]): ICardItemProps[] => {
        if (resources == null) {
            throw Error('Resources are null or undefined!');
        }

        const cardItemProps: ICardItemProps[] = [];

        for (const resource of resources) {
            if (resource != null) {
                const props = getResourceProps(resource);
                cardItemProps.push(props);
            }
        }

        return cardItemProps;
    }

    const getCreatedResourceProps = (resource: IResource): ICardItemProps => {
        if (resource == null) {
            throw Error('Resource is null or undefinded!');
        }

        return { cardHeader: 'Resource created successfully!', title: 'Name: ' + resource?.name, subtitle: 'Year: ' + resource?.year, text: 'Pantone Value: ' + resource?.pantone_value, cardFooter: 'ID: ' + resource?.id };
    }

    const getUpdatedResourceProps = (resource: IResource): ICardItemProps => {
        if (resource == null) {
            throw Error('Resource is null or undefinded!');
        }

        return { cardHeader: 'Resource updated successfully!', title: 'Name: ' + resource?.name, subtitle: 'Year: ' + resource?.year, text: 'Pantone Value: ' + resource?.pantone_value, cardFooter: 'ID: ' + resource?.id };
    }

    const resourceProps: ICardItemProps[] = resource ? Array.of(getResourceProps(resource)) : [];
    const resourcesProps: ICardItemProps[] = resources ? getResourcesProps(resources) : [];
    const unavaibleResourceProps: ICardItemProps[] = unavaibleResource ? Array.of(getResourceProps(unavaibleResource)) : [];
    const createdResourceProps: ICardItemProps[] = createdResource ? Array.of(getCreatedResourceProps(createdResource)) : [];
    const updatedPatchedResourceProps: ICardItemProps[] = updatedPatchedResource ? Array.of(getUpdatedResourceProps(updatedPatchedResource)) : [];
    const updatedPutResourceProps: ICardItemProps[] = updatedPutResource ? Array.of(getUpdatedResourceProps(updatedPutResource)) : [];

    return (
        <>
            {
                loading
                    ?
                    <LoadingGenerator />
                    :
                    <>
                        {ListComponent(resourceProps)}
                        {ListComponent(resourcesProps)}
                        {ListComponent(unavaibleResourceProps)}
                        {ListComponent(createdResourceProps)}
                        {ListComponent(updatedPatchedResourceProps)}
                        {ListComponent(updatedPutResourceProps)}
                    </>
            }
        </>
    );
}

export default ResourceComponent;
