/**
 * Example config file,
 * replace with your own
 * url configuration json object.
 */
// http://192.168.0.134:8000/api/v1/orders
// http://192.168.0.151:8000/api -> Eduardo PC
// http://192.168.1.105:8000/api -> Eduardo PC Asura Media 2.4G
export const configFile = {
    'protocol': 'http',
    'scheme': 'Bearer',
    'api': {
        'baseUrl': 'localhost:8000/api',
        'apiVersion': 'v1'
    },
    'urlConfig': {
        'auth': {
            'version': 'v1',
            'url': 'localhost:8000/api',
            'signup': 'signup',
            'loginEndpoint': 'auth/token',
            'logoutEndpoint': 'auth/logout',
            'refreshTokenEndpoint': 'auth/refresh'
        },
        'orders': {
            'getAllOrders': 'orders'
        },
        'products': {
            'getAllProducts': 'products'
        },
        'inventoryItems': {
            'getAllItems': 'inventory_items'
        },
        'catalogs':{
            'getAllWarehouses': 'warehouses',
            'getALlInventories': 'inventories',
            'getAllOnInventoryStatus': 'on-inventory-status',
            'getAllItemStatus': 'item-status'            
        }
    }
};

const {
    protocol,
    api: {
        baseUrl,
        apiVersion
    },
    urlConfig: {
        auth: { url, version, loginEndpoint },
        orders: { getAllOrders },
        products: { getAllProducts },
        inventoryItems: { getAllItems },
        catalogs: { getAllWarehouses, getALlInventories, getAllOnInventoryStatus,  getAllItemStatus}
    }
} = configFile;

export const urlConfig = {
    authUrl: `${protocol}://${baseUrl}/${apiVersion}/${loginEndpoint}`,
    getOrdersUrl: `${protocol}://${baseUrl}/${apiVersion}/${getAllOrders}`,
    getProductsUrl: `${protocol}://${baseUrl}/${apiVersion}/${getAllProducts}`,
    getAllItemsUrl: `${protocol}://${baseUrl}/${apiVersion}/${getAllItems}`,
    getCatalogWarehousesUrl: `${protocol}://${baseUrl}/${apiVersion}/${getAllWarehouses}`,
    getCatalogInventoriesUrl: `${protocol}://${baseUrl}/${apiVersion}/${getALlInventories}`,
    getCatalogOnInventoryStatusUrl: `${protocol}://${baseUrl}/${apiVersion}/${getAllOnInventoryStatus}`,
    getCatalogAllItemStatusUrl: `${protocol}://${baseUrl}/${apiVersion}/${getAllItemStatus}`
};

