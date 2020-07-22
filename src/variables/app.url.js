
const uiPort = 3000;
const servicePort = 8080;

const app = {
    uiEndPoint: `http://52.15.225.84:${uiPort}/`
    // uiEndPoint: `http://localhost:${uiPort}/`
    , serviceEndPoint: `http://3.20.222.19:${servicePort}/`
    //, serviceEndPoint: `http://localhost:${servicePort}/`
}

export default app;