var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
import { OrderDto, OrderDetailDto } from "./order.dto";
export var OrderDetailModel = (function (_super) {
    __extends(OrderDetailModel, _super);
    function OrderDetailModel() {
        _super.apply(this, arguments);
    }
    return OrderDetailModel;
}(OrderDetailDto));
export var OrderProductsModel = (function () {
    function OrderProductsModel() {
    }
    return OrderProductsModel;
}());
var OrderModel = (function (_super) {
    __extends(OrderModel, _super);
    function OrderModel(dto) {
        _super.call(this);
    }
    return OrderModel;
}(OrderDto));
export default OrderModel;
//# sourceMappingURL=order.model.js.map