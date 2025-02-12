// these tests are meant to simulate basic functionality in SPFx through node so we can validate we aren't breaking core library
// functionality in SPFx added after #2347
import { expect } from "chai";
import "@pnp/sp/webs";
import "@pnp/sp/lists/web";
import { ISPFXContext, SPFI, spfi, SPFx } from "@pnp/sp";
import { NodeFetchWithRetry } from "@pnp/nodejs";
import { isArray } from "@pnp/core";
import { Queryable } from "@pnp/queryable";

describe("SPFx", function () {

    let spfxSP: SPFI;

    before(function () {

        if (!this.pnp.settings.enableWebTests) {
            this.skip();
        }

        const SPFxContext: ISPFXContext = {

            pageContext: {
                web: {
                    absoluteUrl: this.pnp.settings.sp.testWebUrl,
                },
                legacyPageContext: null,
            },
        };

        spfxSP = spfi().using(SPFx(SPFxContext), NodeFetchWithRetry({ replace: true }));

        const auth = this.pnp.sp.web.on.auth.toArray();

        spfxSP.using(function (instance: Queryable) {

            for (let i = 0; i < auth.length; i++) {
                instance.on.auth(auth[i]);
            }
        });
    });

    it("get web", async function () {

        const webInfo = await spfxSP.web();
        return expect(webInfo).to.haveOwnProperty("Title");
    });

    it("get lists", async function () {

        const listsInfo = await spfxSP.web.lists();

        // eslint-disable-next-line @typescript-eslint/no-unused-expressions
        expect(isArray(listsInfo)).to.be.true;
        return expect(listsInfo).property("length").to.be.greaterThan(0);
    });
});


