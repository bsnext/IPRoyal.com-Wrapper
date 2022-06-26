const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

////////////////

class IPRoyalSubUsersList {
    constructor(parent, pageSize = 20, list = 1) {
        this.parent = parent;
        this.list = list;
        this.pageSize = pageSize;
    };

    async getList(self) {
        if (!self) {
            self = this;
        };

        let result = await self.parent.fetch(
            `https://dashboard.iproyal.com/api/residential/royal/reseller/sub-users?page=${self.list}&pageSize=${self.pageSize}`
        );

        result.next = async function () {
            self.list++;
            return await self.getList(self);
        };

        return result;
    }
}

class IPRoyal {
    constructor(token) {
        if (!token) {
            throw new Error(`Constuctor token is invalid`);
        };

        this.token = token;

        this.fetchHeaders = {
            'Content-Type': 'application/json',
            'X-Access-Token': `Bearer ${this.token}`
        },

            this.fetch = async function (fetchURL, fetchMethod = 'GET', fetchBody) {
                let result = await fetch(fetchURL,
                    {
                        method: fetchMethod,
                        headers: this.fetchHeaders,
                        body: fetchBody ? JSON.stringify(fetchBody) : null
                    }
                );

                try {
                    let resultJSON = await result.json();

                    if (typeof (resultJSON) == `string`) {
                        throw new Error(resultJSON);
                    };

                    return resultJSON;
                } catch (e) {
                    throw new Error(e);
                };
            }
    }

    async getInfo() {
        let result = await this.fetch(`https://dashboard.iproyal.com/api/residential/royal/reseller/my-info`);
        return result;
    }

    async getSubUsers(pageSize = 20, list = 1) {
        if ((!pageSize) || (!list)) {
            throw new Error(`"getSubUsers" method arguments is invalid`);
        };

        let usersList = new IPRoyalSubUsersList(this, pageSize, list);
        let result = await usersList.getList();

        return result;
    }

    async createSubUser(username, password, traffic = 0) {
        if ((!username) || (!password) || (!traffic == undefined)) {
            throw new Error(`"createSubUser" method arguments is invalid`);
        };

        let result = await this.fetch(
            `https://dashboard.iproyal.com/api/residential/royal/reseller/sub-users`, `POST`,
            { username, password, traffic }
        );

        return result;
    }

    async getSubUserInfo(id) {
        if (id == undefined) {
            throw new Error(`"getSubUserInfo" method arguments is invalid`);
        };

        let result = await this.fetch(`https://dashboard.iproyal.com/api/residential/royal/reseller/sub-users/${id}`);

        return result;
    }

    async updateSubUserInfo(id, username, password) {
        if ((id == undefined) || (!username) || (!password)) {
            throw new Error(`"updateSubUserInfo" method arguments is invalid`);
        };

        let result = await this.fetch(
            `https://dashboard.iproyal.com/api/residential/royal/reseller/sub-users/${id}`, `PATCH`,
            { username, password }
        );

        return result;
    }

    async addSubUserTraffic(id, amount = 1, type = "gb") {
        amount = Math.max(Math.floor(amount || 0), 0);

        if ((id == undefined) || (!amount) || (!type) || ((type != "gb") && (type != "tb"))) {
            throw new Error(`"addSubUserTraffic" method arguments is invalid`);
        };

        if (type == `tb`) {
            amount = amount * 1024;
        };

        let result = await this.fetch(
            `https://dashboard.iproyal.com/api/residential/royal/reseller/sub-users/${id}/give-traffic`, `POST`,
            { amount }
        );

        return result;
    }

    async takeSubUserTraffic(id, amount = 1, type = "gb") {
        amount = Math.max(Math.floor(amount || 0), 0);

        if ((id == undefined) || (!amount) || (!type) || ((type != "gb") && (type != "tb"))) {
            throw new Error(`"addSubUserTraffic" method arguments is invalid`);
        };

        if (type == `tb`) {
            amount = amount * 1024;
        };

        let result = await this.fetch(
            `https://dashboard.iproyal.com/api/residential/royal/reseller/sub-users/${id}/take-traffic`, `POST`,
            { amount }
        );

        return result;
    }

    async getAvailableCountries() {
        let result = await this.fetch(`https://dashboard.iproyal.com/api/residential/royal/reseller/access/countries`);

        return result;
    }

    async getAvailableCountrySets() {
        let result = await this.fetch(`https://dashboard.iproyal.com/api/residential/royal/reseller/access/country-sets`);

        return result;
    }

    async getAvailableRegions() {
        let result = await this.fetch(`https://dashboard.iproyal.com/api/residential/royal/reseller/access/regions`);

        return result;
    }

    async getProxyHostNames() {
        let result = await this.fetch(`https://dashboard.iproyal.com/api/residential/royal/reseller/access/hostnames`);

        return result;
    }

    async generateUserProxyList(subUserId, proxyCount = 1, otherParameters = {}) {
        if ((subUserId == undefined) || (!proxyCount) || (!otherParameters)) {
            throw new Error(`"generateUserProxyList" method arguments is invalid`);
        };

        let result = await this.fetch(
            `https://dashboard.iproyal.com/api/residential/royal/reseller/access/generate-proxy-list`, `POST`,
            Object.assign({ subUserId, proxyCount }, otherParameters)
        );

        return result;

    }
};

////////////////

module.exports = IPRoyal;