"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = require("react");
var react_dom_1 = require("react-dom");
var util_1 = require("./util");
var ArrowContainer_1 = require("./ArrowContainer");
exports.ArrowContainer = ArrowContainer_1.ArrowContainer;
var Popover = /** @class */ (function (_super) {
    __extends(Popover, _super);
    function Popover(props) {
        var _this = _super.call(this, props) || this;
        _this.target = null;
        _this.targetRect = null;
        _this.targetPositionIntervalHandler = null;
        _this.popoverDiv = null;
        _this.positionOrder = null;
        _this.willUnmount = false;
        _this.willMount = false;
        _this.onResize = function (e) {
            _this.renderPopover();
        };
        _this.onClick = function (e) {
            var _a = _this.props, onClickOutside = _a.onClickOutside, isOpen = _a.isOpen;
            if (!_this.willUnmount && !_this.willMount && !_this.popoverDiv.contains(e.target) && !_this.target.contains(e.target) && onClickOutside && isOpen) {
                onClickOutside(e);
            }
        };
        _this.willUnmount = false;
        _this.willMount = true;
        return _this;
    }
    Popover.prototype.componentDidMount = function () {
        var _this = this;
        window.setTimeout(function () { return _this.willMount = false; });
        var _a = this.props, position = _a.position, isOpen = _a.isOpen;
        this.target = react_dom_1.findDOMNode(this);
        this.positionOrder = this.getPositionPriorityOrder(position);
        this.updatePopover(isOpen);
    };
    Popover.prototype.componentDidUpdate = function (prevProps) {
        if (this.target == null) {
            this.target = react_dom_1.findDOMNode(this);
        }
        var prevIsOpen = prevProps.isOpen, prevPosition = prevProps.position, prevBody = prevProps.content;
        var _a = this.props, isOpen = _a.isOpen, content = _a.content, position = _a.position;
        this.positionOrder = this.getPositionPriorityOrder(this.props.position);
        var hasNewDestination = prevProps.contentDestination !== this.props.contentDestination;
        if (prevIsOpen !== isOpen ||
            prevBody !== content ||
            prevPosition !== position ||
            hasNewDestination) {
            if (hasNewDestination) {
                this.removePopover();
                this.popoverDiv && this.popoverDiv.remove();
            }
            this.updatePopover(isOpen);
        }
    };
    Popover.prototype.componentWillUnmount = function () {
        this.willUnmount = true;
        this.removePopover();
    };
    Popover.prototype.render = function () {
        return this.props.children;
    };
    Popover.prototype.updatePopover = function (isOpen) {
        if (isOpen && this.target != null) {
            if (!this.popoverDiv || !this.popoverDiv.parentNode) {
                var transitionDuration = this.props.transitionDuration;
                this.popoverDiv = this.createContainer();
                this.popoverDiv.style.opacity = '0';
                this.popoverDiv.style.transition = "opacity " + (transitionDuration || util_1.Constants.FADE_TRANSITION) + "s";
                (this.props.contentDestination || window.document.body).appendChild(this.popoverDiv);
                window.addEventListener('resize', this.onResize);
                window.addEventListener('click', this.onClick);
            }
            this.renderPopover();
        }
        else if (this.popoverDiv && this.popoverDiv.parentNode) {
            this.removePopover();
        }
    };
    Popover.prototype.renderPopover = function (positionIndex) {
        var _this = this;
        if (positionIndex === void 0) { positionIndex = 0; }
        if (positionIndex >= this.positionOrder.length) {
            this.removePopover();
            return;
        }
        this.renderWithPosition({ position: this.positionOrder[positionIndex], targetRect: this.target.getBoundingClientRect() }, function (violation, rect) {
            var _a;
            var _b = _this.props, disableReposition = _b.disableReposition, contentLocation = _b.contentLocation;
            if (violation && !disableReposition && !(typeof contentLocation === 'object')) {
                _this.renderPopover(positionIndex + 1);
            }
            else {
                var _c = _this.props, contentLocation_1 = _c.contentLocation, align = _c.align;
                var _d = _this.getNudgedPopoverPosition(rect), nudgedTop = _d.top, nudgedLeft = _d.left;
                var rectTop = rect.top, rectLeft = rect.left;
                var position = _this.positionOrder[positionIndex];
                var _e = disableReposition ? { top: rectTop, left: rectLeft } : { top: nudgedTop, left: nudgedLeft }, top_1 = _e.top, left = _e.left;
                if (contentLocation_1) {
                    var targetRect = _this.target.getBoundingClientRect();
                    var popoverRect = _this.popoverDiv.getBoundingClientRect();
                    (_a = typeof contentLocation_1 === 'function' ? contentLocation_1({ targetRect: targetRect, popoverRect: popoverRect, position: position, align: align, nudgedLeft: nudgedLeft, nudgedTop: nudgedTop }) : contentLocation_1, top_1 = _a.top, left = _a.left);
                    _this.popoverDiv.style.left = left.toFixed() + "px";
                    _this.popoverDiv.style.top = top_1.toFixed() + "px";
                }
                else {
                    var destinationTopOffset = 0;
                    var destinationLeftOffset = 0;
                    if (_this.props.contentDestination) {
                        var destRect = _this.props.contentDestination.getBoundingClientRect();
                        destinationTopOffset = -destRect.top;
                        destinationLeftOffset = -destRect.left;
                    }
                    var _f = [top_1 + window.pageYOffset, left + window.pageXOffset], absoluteTop = _f[0], absoluteLeft = _f[1];
                    var finalLeft = absoluteLeft + destinationTopOffset;
                    var finalTop = absoluteTop + destinationLeftOffset;
                    _this.popoverDiv.style.left = finalLeft.toFixed() + "px";
                    _this.popoverDiv.style.top = finalTop.toFixed() + "px";
                }
                _this.popoverDiv.style.width = null;
                _this.popoverDiv.style.height = null;
                _this.renderWithPosition({
                    position: position,
                    nudgedTop: nudgedTop - rect.top,
                    nudgedLeft: nudgedLeft - rect.left,
                    targetRect: _this.target.getBoundingClientRect(),
                    popoverRect: _this.popoverDiv.getBoundingClientRect(),
                }, function () {
                    _this.startTargetPositionListener(10);
                    if (_this.popoverDiv.style.opacity !== '1') {
                        _this.popoverDiv.style.opacity = '1';
                    }
                });
            }
        });
    };
    Popover.prototype.startTargetPositionListener = function (checkInterval) {
        var _this = this;
        if (this.targetPositionIntervalHandler === null) {
            this.targetPositionIntervalHandler = window.setInterval(function () {
                var newTargetRect = _this.target.getBoundingClientRect();
                if (_this.targetPositionHasChanged(_this.targetRect, newTargetRect)) {
                    _this.renderPopover();
                }
                _this.targetRect = newTargetRect;
            }, checkInterval);
        }
    };
    Popover.prototype.renderWithPosition = function (_a, callback) {
        var _this = this;
        var position = _a.position, _b = _a.nudgedLeft, nudgedLeft = _b === void 0 ? 0 : _b, _c = _a.nudgedTop, nudgedTop = _c === void 0 ? 0 : _c, _d = _a.targetRect, targetRect = _d === void 0 ? util_1.Constants.EMPTY_CLIENT_RECT : _d, _e = _a.popoverRect, popoverRect = _e === void 0 ? util_1.Constants.EMPTY_CLIENT_RECT : _e;
        var _f = this.props, padding = _f.windowBorderPadding, content = _f.content, align = _f.align;
        var getContent = function (args) {
            return typeof content === 'function'
                ? content(args)
                : content;
        };
        react_dom_1.unstable_renderSubtreeIntoContainer(this, getContent({ position: position, nudgedLeft: nudgedLeft, nudgedTop: nudgedTop, targetRect: targetRect, popoverRect: popoverRect, align: align }), this.popoverDiv, function () {
            if (_this.willUnmount) {
                return;
            }
            var targetRect = _this.target.getBoundingClientRect();
            var popoverRect = _this.popoverDiv.getBoundingClientRect();
            var _a = _this.getLocationForPosition(position, targetRect, popoverRect), top = _a.top, left = _a.left;
            callback(position === 'top' && top < padding ||
                position === 'left' && left < padding ||
                position === 'right' && left + popoverRect.width > window.innerWidth - padding ||
                position === 'bottom' && top + popoverRect.height > window.innerHeight - padding, { width: popoverRect.width, height: popoverRect.height, top: top, left: left });
        });
    };
    Popover.prototype.getNudgedPopoverPosition = function (_a) {
        var top = _a.top, left = _a.left, width = _a.width, height = _a.height;
        var padding = this.props.windowBorderPadding;
        top = top < padding ? padding : top;
        top = top + height > window.innerHeight - padding ? window.innerHeight - padding - height : top;
        left = left < padding ? padding : left;
        left = left + width > window.innerWidth - padding ? window.innerWidth - padding - width : left;
        return { top: top, left: left };
    };
    Popover.prototype.removePopover = function () {
        var _this = this;
        if (this.popoverDiv) {
            var transitionDuration = this.props.transitionDuration;
            this.popoverDiv.style.opacity = '0';
            var remove = function () {
                if (_this.willUnmount || !_this.props.isOpen || !_this.popoverDiv.parentNode) {
                    window.clearInterval(_this.targetPositionIntervalHandler);
                    window.removeEventListener('resize', _this.onResize);
                    window.removeEventListener('click', _this.onClick);
                    _this.targetPositionIntervalHandler = null;
                    if (_this.popoverDiv.parentNode) {
                        _this.popoverDiv.parentNode.removeChild(_this.popoverDiv);
                    }
                }
            };
            if (!this.willUnmount) {
                window.setTimeout(remove, (transitionDuration || util_1.Constants.FADE_TRANSITION) * 1000);
            }
            else {
                remove();
            }
        }
    };
    Popover.prototype.getPositionPriorityOrder = function (position) {
        if (position && typeof position !== 'string') {
            if (util_1.Constants.DEFAULT_POSITIONS.every(function (defaultPosition) { return position.find(function (p) { return p === defaultPosition; }) !== undefined; })) {
                return util_1.arrayUnique(position);
            }
            else {
                var remainingPositions = util_1.Constants.DEFAULT_POSITIONS.filter(function (defaultPosition) { return position.find(function (p) { return p === defaultPosition; }) === undefined; });
                return util_1.arrayUnique(position.concat(remainingPositions));
            }
        }
        else if (position && typeof position === 'string') {
            var remainingPositions = util_1.Constants.DEFAULT_POSITIONS.filter(function (defaultPosition) { return defaultPosition !== position; });
            return util_1.arrayUnique([position].concat(remainingPositions));
        }
    };
    Popover.prototype.createContainer = function () {
        var _a = this.props, containerStyle = _a.containerStyle, containerClassName = _a.containerClassName;
        var container = window.document.createElement('div');
        container.style.overflow = 'hidden';
        if (containerStyle) {
            Object.keys(containerStyle).forEach(function (key) { return container.style[key] = containerStyle[key]; });
        }
        container.className = containerClassName;
        container.style.position = 'absolute';
        container.style.top = '0';
        container.style.left = '0';
        return container;
    };
    Popover.prototype.getLocationForPosition = function (position, newTargetRect, popoverRect) {
        var _a = this.props, padding = _a.padding, align = _a.align;
        var targetMidX = newTargetRect.left + (newTargetRect.width / 2);
        var targetMidY = newTargetRect.top + (newTargetRect.height / 2);
        var top;
        var left;
        switch (position) {
            case 'top':
                top = newTargetRect.top - popoverRect.height - padding;
                left = targetMidX - (popoverRect.width / 2);
                if (align === 'start') {
                    left = newTargetRect.left;
                }
                if (align === 'end') {
                    left = newTargetRect.right - popoverRect.width;
                }
                break;
            case 'left':
                top = targetMidY - (popoverRect.height / 2);
                left = newTargetRect.left - padding - popoverRect.width;
                if (align === 'start') {
                    top = newTargetRect.top;
                }
                if (align === 'end') {
                    top = newTargetRect.bottom - popoverRect.height;
                }
                break;
            case 'bottom':
                top = newTargetRect.bottom + padding;
                left = targetMidX - (popoverRect.width / 2);
                if (align === 'start') {
                    left = newTargetRect.left;
                }
                if (align === 'end') {
                    left = newTargetRect.right - popoverRect.width;
                }
                break;
            case 'right':
                top = targetMidY - (popoverRect.height / 2);
                left = newTargetRect.right + padding;
                if (align === 'start') {
                    top = newTargetRect.top;
                }
                if (align === 'end') {
                    top = newTargetRect.bottom - popoverRect.height;
                }
                break;
        }
        return { top: top, left: left };
    };
    Popover.prototype.targetPositionHasChanged = function (oldTargetRect, newTargetRect) {
        return oldTargetRect === null
            || oldTargetRect.left !== newTargetRect.left
            || oldTargetRect.top !== newTargetRect.top
            || oldTargetRect.width !== newTargetRect.width
            || oldTargetRect.height !== newTargetRect.height;
    };
    Popover.defaultProps = {
        padding: util_1.Constants.DEFAULT_PADDING,
        windowBorderPadding: util_1.Constants.DEFAULT_WINDOW_PADDING,
        position: ['top', 'right', 'left', 'bottom'],
        align: 'center',
        containerClassName: util_1.Constants.POPOVER_CONTAINER_CLASS_NAME,
    };
    return Popover;
}(React.Component));
exports.default = Popover;
//# sourceMappingURL=Popover.js.map