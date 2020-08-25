
const uiPort = 3000;
const servicePort = 8080;

const app = {
    uiEndPoint: `http://3.17.204.147:${uiPort}/`
    // uiEndPoint: `http://localhost:${uiPort}/`
    , serviceEndPoint: `http://3.20.222.19:${servicePort}/`
    //, serviceEndPoint: `http://localhost:${servicePort}/`
}

export default app;