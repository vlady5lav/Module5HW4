import React, { ReactElement, useEffect, useState } from 'react';
import ListComponent, { LoadingGenerator, CardItemProps } from './ListComponent'
import { getResponse, HttpRequestMethod } from './ApiService';
import Resource from '../models/Resource';
import ResourceDTO from '../dtos/ResourceDTO';
import ResponseDTO from '../dtos/ResponseDTO';

const getResourceById = async (id: number, delay = 0): Promise<Resource> => {
    const response = await (
        await getResponse<undefined, ResponseDTO<ResourceDTO>>(
            { requestUrl: delay == 0 ? `unknown/${id}` : `unknown/${id}?delay=${delay}`, method: HttpRequestMethod.GET })
    ).data;
    return response;
}

const getResourcesByPage = async (page: number, delay = 0): Promise<Resource[]> => {
    const response = await (
        await getResponse<undefined, ResponseDTO<ResourceDTO[]>>(
            { requestUrl: delay == 0 ? `unknown?page=${page}` : `unknown?page=${page}?delay=${delay}`, method: HttpRequestMethod.GET })
    ).data;
    return response;
}

const createResource = async (resource: ResourceDTO): Promise<Resource> => {
    const response = await getResponse<ResourceDTO, ResourceDTO>(
        { requestUrl: 'unknown', method: HttpRequestMethod.POST, payload: resource });
    return response;
}

const updatePatchResourceById = async (id: number, resource: ResourceDTO): Promise<Resource> => {
    const response = await getResponse<ResourceDTO, ResourceDTO>(
        { requestUrl: `unknown/${id}`, method: HttpRequestMethod.PATCH, payload: resource });
    return response;
}

const updatePutResourceById = async (id: number, resource: ResourceDTO): Promise<Resource> => {
    const response = await getResponse<ResourceDTO, ResourceDTO>(
        { requestUrl: `unknown/${id}`, method: HttpRequestMethod.PUT, payload: resource });
    return response;
}

/*
const deleteResourceById = async (id: number): Promise<unknown> => {
    const response = await getResponse<unknown, unknown>(
        { requestUrl: `unknown/${id}`, method: HttpRequestMethod.DELETE });
    return response;
}
*/

const ResourceComponent = (): ReactElement => {
    const [loading, setLoading] = useState(true);

    const [resource, setResource] = useState<Resource | null>(null);
    const [resources, setResources] = useState<Resource[] | null>(null);
    const [unavaibleResource, setUnavaibleResource] = useState<Resource | null>(null);

    const [createdResource, setCreatedResource] = useState<Resource | null>(null);
    const [updatedPatchedResource, setUpdatedPatchedResource] = useState<Resource | null>(null);
    const [updatedPutResource, setUpdatedPutResource] = useState<Resource | null>(null);

    // const [deletedResource, setDeletedResource] = React.useState<unknown | null>(null);

    const getResult = async (): Promise<void> => {
        const resultGetResource = await getResourceById(2);
        const resultGetResources = await getResourcesByPage(2);
        const resultGetUnavaibleResource = await getResourceById(17);

        const createdResource: ResourceDTO = { id: "20", color: "colored", name: "trinity", pantone_value: "morpheus", year: 1990 };
        const resultCreateResource = await createResource(createdResource);

        const resource: ResourceDTO = { id: "2", color: "colored", name: "morpheus", pantone_value: "trinity", year: 1995 };
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

    const getResourceProps = (resource: Resource): CardItemProps => {
        if (resource == null) {
            throw Error('Resource is null or undefined!');
        }

        return { cardHeader: 'ID: ' + resource?.id, title: 'Name: ' + resource?.name, subtitle: 'Year: ' + resource?.year, cardFooter: 'Pantone Value: ' + resource?.pantone_value };
    }

    const getResourcesProps = (resources: Resource[]): CardItemProps[] => {
        if (resources == null) {
            throw Error('Resources are null or undefined!');
        }

        const cardItemProps: CardItemProps[] = [];

        for (const resource of resources) {
            if (resource != null) {
                const props = getResourceProps(resource);
                cardItemProps.push(props);
            }
        }

        return cardItemProps;
    }

    const getCreatedResourceProps = (resource: Resource): CardItemProps => {
        if (resource == null) {
            throw Error('Resource is null or undefinded!');
        }

        return { cardHeader: 'Resource created successfully!', title: 'Name: ' + resource?.name, subtitle: 'Year: ' + resource?.year, text: 'Pantone Value: ' + resource?.pantone_value, cardFooter: 'ID: ' + resource?.id };
    }

    const getUpdatedResourceProps = (resource: Resource): CardItemProps => {
        if (resource == null) {
            throw Error('Resource is null or undefinded!');
        }

        return { cardHeader: 'Resource updated successfully!', title: 'Name: ' + resource?.name, subtitle: 'Year: ' + resource?.year, text: 'Pantone Value: ' + resource?.pantone_value, cardFooter: 'ID: ' + resource?.id };
    }

    const resourceProps: CardItemProps[] = resource ? Array.of(getResourceProps(resource)) : [];
    const resourcesProps: CardItemProps[] = resources ? getResourcesProps(resources) : [];
    const unavaibleResourceProps: CardItemProps[] = unavaibleResource ? Array.of(getResourceProps(unavaibleResource)) : [];
    const createdResourceProps: CardItemProps[] = createdResource ? Array.of(getCreatedResourceProps(createdResource)) : [];
    const updatedPatchedResourceProps: CardItemProps[] = updatedPatchedResource ? Array.of(getUpdatedResourceProps(updatedPatchedResource)) : [];
    const updatedPutResourceProps: CardItemProps[] = updatedPutResource ? Array.of(getUpdatedResourceProps(updatedPutResource)) : [];

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
