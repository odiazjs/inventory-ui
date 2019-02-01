import { map } from 'rxjs/operators';
export var QueryOptions = (function () {
    function QueryOptions() {
    }
    QueryOptions.toQueryString = function (paramsObject) {
        return Object
            .keys(paramsObject)
            .map(function (key) { return (encodeURIComponent(key) + "=" + encodeURIComponent(paramsObject[key])); })
            .join('&');
    };
    return QueryOptions;
}());
export var ResourceService = (function () {
    function ResourceService(httpClient, baseUrl, serializer) {
        this.httpClient = httpClient;
        this.baseUrl = baseUrl;
        this.serializer = serializer;
    }
    ResourceService.prototype.create = function (item) {
        return this.httpClient
            .post("" + this.baseUrl, item)
            .pipe(map(this.serializer));
    };
    ResourceService.prototype.update = function (item) {
        return this.httpClient
            .put(this.baseUrl + "/" + item.id, item)
            .pipe(map(this.serializer));
    };
    ResourceService.prototype.getById = function (id) {
        return this.httpClient
            .get(this.baseUrl + "/" + id)
            .pipe(map(this.serializer));
    };
    ResourceService.prototype.getList = function (paramsObject) {
        if (paramsObject === void 0) { paramsObject = {}; }
        return this.httpClient
            .get("" + this.baseUrl)
            .pipe(map(function (httpResponse) {
            return httpResponse;
        }));
    };
    ResourceService.prototype.deleteById = function (id) {
        return this.httpClient
            .delete(this.baseUrl + "/" + id);
    };
    return ResourceService;
}());
//# sourceMappingURL=resource.service.js.map