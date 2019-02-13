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
        'baseUrl': '127.0.0.1:8000/api',
        'apiVersion': 'v1'
    },
    'urlConfig': {
        'auth': {
            'version': 'v1',
            'url': '127.0.0.1:8000/api',
            'signup': 'signup',
            'loginEndpoint': 'auth/token',
            'logoutEndpoint': 'auth/logout',
            'refreshTokenEndpoint': 'auth/refresh'
        },
        'orders': {
            'getAllOrders': 'orders'
        },
        'products': {
            'getAllProducts': 'products',
            'getFilteredProducts': 'products?'
        },
        'inventoryItems': {
            'getAllItems': 'inventory_items',
            'getFilteredItems': 'inventory_items?',
            'getInventoryitemHistory': 'inventory_item_history/'
        },
        'catalogs':{
            'getAllWarehouses': 'warehouses',
            'getALlInventories': 'inventories',
            'getAllOnInventoryStatus': 'on-inventory-status',
            'getAllItemStatus': 'item-status',
            'getAllManufacturer': 'manufacturers',
            'getAllProductsGroup': 'product-groups',
            'getAllOrderSubTypes': 'order-type'
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
        products: { getAllProducts, getFilteredProducts },
        inventoryItems: { getAllItems, getFilteredItems, getInventoryitemHistory },
        catalogs: {
            getAllWarehouses,
            getALlInventories,
            getAllOnInventoryStatus,
            getAllItemStatus,
            getAllManufacturer,
            getAllProductsGroup,
            getAllOrderSubTypes
        }
    }
} = configFile;

export const urlConfig = {
    authUrl: `${protocol}://${baseUrl}/${apiVersion}/${loginEndpoint}`,
    getOrdersUrl: `${protocol}://${baseUrl}/${apiVersion}/${getAllOrders}`,
    getProductsUrl: `${protocol}://${baseUrl}/${apiVersion}/${getAllProducts}`,
    getFilteredProductsUrl: `${protocol}://${baseUrl}/${apiVersion}/${getFilteredProducts}`,
    getAllItemsUrl: `${protocol}://${baseUrl}/${apiVersion}/${getAllItems}`,
    getFilteredItemsUrl: `${protocol}://${baseUrl}/${apiVersion}/${getFilteredItems}`,
    getCatalogWarehousesUrl: `${protocol}://${baseUrl}/${apiVersion}/${getAllWarehouses}`,
    getCatalogInventoriesUrl: `${protocol}://${baseUrl}/${apiVersion}/${getALlInventories}`,
    getCatalogOnInventoryStatusUrl: `${protocol}://${baseUrl}/${apiVersion}/${getAllOnInventoryStatus}`,
    getInventoryitemsHistory: `${protocol}://${baseUrl}/${apiVersion}/${getInventoryitemHistory}`,
    getCatalogAllItemStatusUrl: `${protocol}://${baseUrl}/${apiVersion}/${getAllItemStatus}`,
    getCatalogManufacturers: `${protocol}://${baseUrl}/${apiVersion}/${getAllManufacturer}`,
    getCatalogProductsGroup: `${protocol}://${baseUrl}/${apiVersion}/${getAllProductsGroup}`,
    getCatalogOrderSubTypes: `${protocol}://${baseUrl}/${apiVersion}/${getAllOrderSubTypes}`
};

