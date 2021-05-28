import { Queryable2 } from "@pnp/queryable";
import { HttpsProxyAgent } from "https-proxy-agent";

export function Proxy(proxyInit: string): (instance: Queryable2) => Queryable2;
// eslint-disable-next-line no-redeclare
export function Proxy(proxyInit: any): (instance: Queryable2) => Queryable2;
// eslint-disable-next-line no-redeclare
export function Proxy(proxyInit: any): (instance: Queryable2) => Queryable2 {

    const proxy = typeof proxyInit === "string" ? new HttpsProxyAgent(proxyInit) : proxyInit;

    return (instance: Queryable2) => {

        instance.on.pre(async (url, init, result) => {

            // we add the proxy to the request
            (<any>init).agent = proxy;

            return [url, init, result];
        });

        return instance;
    };
}
