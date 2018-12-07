/**
 * Example config file,
 * replace with your own
 * url configuration json object.
 */
//http://192.168.0.134:8000/api/v1/orders
var configFile = {
    "protocol": "http",
    "scheme": "Bearer",
    "api": {
        "baseUrl": "192.168.0.134:8000/api",
        "apiVersion": "v1"
    },
    "urlConfig": {
        "auth": {
            "version": "v1",
            "url": "localhost:8000/api",
            "signup": "signup",
            "loginEndpoint": "auth/token",
            "logoutEndpoint": "auth/logout",
            "refreshTokenEndpoint": "auth/refresh"
        },
        "orders": {
            "getAllOrders": "orders"
        },
        "products": {
            "getAllProducts": "products"
        }
    }
};
var protocol = configFile.protocol, _a = configFile.api, baseUrl = _a.baseUrl, apiVersion = _a.apiVersion, _b = configFile.urlConfig, _c = _b.auth, url = _c.url, version = _c.version, loginEndpoint = _c.loginEndpoint, getAllOrders = _b.orders.getAllOrders, getAllProducts = _b.products.getAllProducts;
export var urlConfig = {
    getOrdersUrl: protocol + "://" + baseUrl + "/" + apiVersion + "/" + getAllOrders,
    getProductsUrl: protocol + "://" + baseUrl + "/" + apiVersion + "/" + getAllProducts
};
//# sourceMappingURL=config.js.map