import configlib from 'config';
// import fs from 'fs';

// if(process.env.)

interface IConfig {
    hostname: string
    twitch: {
        client_id: string
        client_secret: string
    }
}

export function config() : IConfig {
    return configlib.util.toObject();
}