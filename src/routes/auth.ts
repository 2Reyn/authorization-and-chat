import { Router, Request } from 'express';
import { config } from '../config';
import fetch from 'node-fetch';
import handle from '../utils/errorHandler.utils';
import { UserModel, UserSchema } from '../models/user';

const router = new Router()

const oauth2redirect = (req: Request) => {
    if(req.get('host')?.split(':')[0] == config().hostname) return 'https://' + config().hostname + '/auth/handle';

    const origin = req.get('origin') || ('http://' + req.get('host')) || 'http://localhost';
    const domain = ['http', 'https'].includes(origin.split(':')[0]) ? origin.slice(origin.split(':')[0].length).split('/')[2] : origin;
    const handle = (['localhost', '127.0.0.1'].includes(domain.split(':')[0]) ? (origin == 'http://localhost' ? ('https://' + domain) : ('http://' + domain)) : 'https://' + config().hostname) + '/auth/handle';
    return handle;
}

router.get('/init', (req, res) => {
    res.redirect(`https://id.twitch.tv/oauth2/authorize?client_id=${config().twitch.client_id}&redirect_uri=${encodeURI(oauth2redirect(req))}&response_type=code&scope=user:read:email`);
})

router.get('/handle', handle(async (req, res) => {
    const code: string | undefined = req.query.code;
    if(!code) return res.type('text').send('Ярiк блять бачок потiк!');
    const token: any = await (await fetch(`https://id.twitch.tv/oauth2/token`, {
        headers: {
            'content-type': 'application/json'
        },
        method: 'POST',
        body: JSON.stringify({
            client_id: config().twitch.client_id,
            client_secret: config().twitch.client_secret,
            code,
            grant_type: 'authorization_code',
            redirect_uri: oauth2redirect(req)
        })
    })).json();
    const userInfo = await (await fetch(`https://id.twitch.tv/oauth2/validate`, {
        headers: {
            'authorization': 'OAuth ' + token.access_token
        },
    })).json();
    // if(!token.access_token || !token.email) throw new Error('No important token data');
    const userProfile: any = (await (await fetch(`https://api.twitch.tv/helix/users?id=${userInfo.user_id}`, {
        headers: {
            'authorization': 'Bearer ' + token.access_token,
            'client-id': config().twitch.client_id
        },
    })).json()).data[0];
    return res.json({token, userProfile});

    let user = await UserModel.findOne({ id: userInfo.user_id });
    if(!user) {
        user = await new User({
            id: userInfo.user_id,
            name: userProfile.display_name || userProfile.login,
            roles: ['user'],
            twitchUser: {
                login: userProfile.login,
                displayName: userProfile.display_name,
                type: userProfile.type,
                broadcasterType: userProfile.broadcaster_type,
                createdAt: new Date(userProfile.created_at).getTime(),
                description: userProfile.description,
                email: userProfile.email,
                offlineImageUrl: userProfile.offline_image_url,
                profileImageUrl: userProfile.profile_image_url,
                viewCount: userProfile.view_count
            },
            oauth: {
                accessToken: token.access_token,
                refreshToken: token.refresh_token,
                expiryDate: Date.now() + (token.expires_in * 1000)
            }
        }).save();
    }
    else {
        user?.twitchUser = {
            login: userProfile.login,
            displayName: userProfile.display_name,
            type: userProfile.type,
            broadcasterType: userProfile.broadcaster_type,
            createdAt: new Date(userProfile.created_at).getTime(),
            description: userProfile.description,
            email: userProfile.email,
            offlineImageUrl: userProfile.offline_image_url,
            profileImageUrl: userProfile.profile_image_url,
            viewCount: userProfile.view_count
        };
        user?.oauth = {
            accessToken: token.access_token,
            refreshToken: token.refresh_token,
            expiryDate: Date.now() + (token.expires_in * 1000)
        };
        await user?.save();
    }
    
    // if(!userProfile.response || !userProfile.response[0] || !userProfile.response[0].first_name || !userProfile.response[0].last_name) throw new Error('No important user data');
    // return { email: token.email, profile: token.user_id + '', name: `${userProfile.response[0].first_name} ${userProfile.response[0].last_name}` };
}))

module.exports = router;