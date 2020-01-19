import getConfig from 'next/config.js';
const {publicRuntimeConfig} = getConfig();

export const API = publicRuntimeConfig.PRODUCTION
    ? publicRuntimeConfig.API_PRODUCTION
    : publicRuntimeConfig.API_DEVELOPMENT;     //we check if the production enviroment is true then we use the production url or localhost

export const APP_NAME = publicRuntimeConfig.APP_NAME;
 
export const DOMAIN = publicRuntimeConfig.PRODUCTION 
? publicRuntimeConfig.DOMAIN_PRODUCTION 
: publicRuntimeConfig.DOMAIN_DEVELOPMENT;   //WE pass this APP_NAME to our header so we can show it on our appbar

export const FB_APP_ID = publicRuntimeConfig.FB_APP_ID;
export const DISQUS_SHORTNAME = publicRuntimeConfig.DISQUS_SHORTNAME;
export const GOOGLE_CLIENT_ID = publicRuntimeConfig.GOOGLE_CLIENT_ID;