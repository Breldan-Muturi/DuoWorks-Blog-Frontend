import fetch from 'isomorphic-fetch';
import {API} from '../config';
import { handleResponse } from './auth';

export const create = (tag, token) => {
    return fetch (`${API}/tag`, {
        method: 'POST',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`           
        }, //With JSON stringify any Javascript object becomes a JSON object
        body: JSON.stringify(tag)
    })
    .then(response => {
        handleResponse(response);
        return response.json();
    })
    .catch(err => console.log(err));
};

export const getTags = () => {
    return fetch (`${API}/tags`, {
        method: 'GET',
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

export const singleTag = (slug) => {  //Based on the slug we will find that particular tag in our backend
    return fetch (`${API}/tag/${slug}`, {
        method: 'GET',
    })
    .then(response => {
        return response.json();
    })
    .catch(err => console.log(err));
};

export const removeTag = (slug, token) => {
    return fetch (`${API}/tag/${slug}`, {
        method: 'DELETE',
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`           
        }
    })
    .then(response => {
        handleResponse(response);
        return response.json();
    })
    .catch(err => console.log(err));
};