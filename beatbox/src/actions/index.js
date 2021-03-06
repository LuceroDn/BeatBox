//import axios from 'axios';

import {TrackHandler, Client} from 'spotify-sdk';

let client = Client.instance;
client.settings = {
    clientId: "8e1cd8c67cb544d182e2b13b3f1be10c",
    secretId: "e58e0e3563ec461986a3707f5b53ffe2",
    scopes: ["user-follow-modify user-follow-read user-library-read user-top-read"],
    redirect_uri: "http://localhost:3000/"

}

export const checkSignIn = () => {
    return (dispatch, getState) => {
        if(sessionStorage.token){
            client.token = sessionStorage.token;
        }else if(window.location.hash.split('&')[0].split('=')[1]){
            sessionStorage.token = window.location.hash.split('&')[0].split('=')[1];
            client.token = sessionStorage.token;
        }else{
            client.login()
            .then(url => {
                window.location.href = url;
            });
        }
    }
}

const startFetch = () => { return { type: "IS_FETCHING", isFetching: true}};
const errorFetch = (err) => { return { type: "ERROR_FETCH", isFetching: false, err}};
const completeFetch = (data) => { return { type: "COMPLETE_FETCH", isFetching: false, payload: data}};

export const search = (trackName) => {
    return ( dispatch, getState) => {
        dispatch(startFetch());
        let track = new TrackHandler();
        track.search(trackName, {limit: 5})
        .then (trackCollection => {
            dispatch(completeFetch(trackCollection));
        })
        .catch(err => {
            dispatch(errorFetch(err));
        })
    }
}