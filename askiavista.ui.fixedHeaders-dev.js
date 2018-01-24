(function fixHeaders() {
    "use strict";


    /**
     * Helper object
     * @ignore
     * @private
     */
    var helpers = {

        /**
         * Insert node after
         * @param {HTMLElement} el
         * @param {HTMLElement} newEl
         * @ignore
         */
        insertAfter :  function insertAfter(el, newEl) {
            el.parentNode.insertBefore(newEl, el.nextSibling);
        },

        /**
         * Return the size of the specified border
         * @param {HTMLElement} el Element to extract the border on
         * @param {String} position Border position (left, right, top, bottom)
         * @return {Number} Size of the border
         * @ignore
         */
        getBorderSize        : function getBorderSize(el, position) {
            return parseFloat(getComputedStyle(el).getPropertyValue('border-' + position + '-width'));
        },

        /**
         * Returns the first-non visible background-color on the element hierarchy
         * If not found return white color
         * @param {HTMLElement} el
         * @return {string} color
         * @ignore
         */
        getVisibleBackgroundColor : function getVisibleBackgroundColor(el) {
            var parent = el,
                color;
            while(parent.tagName.toLocaleLowerCase() !== 'body') {
                color = getComputedStyle(parent).getPropertyValue('background-color');
                if (!this.isTransparent(color)) {
                    return color;
                }
                parent = parent.parentNode;
            }
            return '#ffffff';
        },

        /**
         * Indicates if a color is transparent
         * @param {String} bgcolor
         * @returns {boolean}
         * @ignore
         */
        isTransparent : function isTransparent(bgcolor) {
            if (!bgcolor  || bgcolor === 'transparent') {
                return true;
            }
            var match =/rgba\s*\(\s*[0-9]+\s*,\s*[0-9]+\s*,\s*[0-9]+\s*,\s*(.*?)\s*\)/gi.exec(bgcolor),
                alpha;
            if (match && match.length > 1) {
                alpha = parseFloat(match[1]);
                if (!isNaN(alpha) && alpha < 1) {
                    return true;
                }
            }
            return false;
        },

        /**
         * Retrieve the browser scrollbar size
         *
         * From FixedHeadersTable http://www.fixedheadertable.com/
         * Github:  https://github.com/markmalek/Fixed-Header-Table/blob/master/jquery.fixedheadertable.js
         * @returns {number}
         * @ignore
         */
        getScrollbarSize : function getScrollbarSize() {
            // Cache
            if (this.scrollbarSize) {
                return this.scrollbarSize;
            }

            this.scrollbarSize = 0;

            var inner = document.createElement('p');
            inner.style.width = "100%";
            inner.style.height = "200px";

            var outer = document.createElement('div');
            outer.style.position = "absolute";
            outer.style.top = "0px";
            outer.style.left = "0px";
            outer.style.visibility = "hidden";
            outer.style.width = "200px";
            outer.style.height = "150px";
            outer.style.overflow = "hidden";
            outer.appendChild (inner);

            document.body.appendChild (outer);
            var w1 = inner.offsetWidth;
            outer.style.overflow = 'scroll';
            var w2 = inner.offsetWidth;
            if (w1 === w2)
            {
                w2 = outer.clientWidth;
            }

            document.body.removeChild(outer);
            this.scrollbarSize = (w1 - w2);

            return this.scrollbarSize;
        },

        /**
         * Indicates if the element has horizontal scrollbar
         * @param {HTMLElement} el
         * @returns {boolean}
         * @ignore
         */
        hasHScrollbar    : function hasHScrollbar(el) {
            return el.clientWidth !== el.scrollWidth;
        },

        /**
         * Indicates if the element has vertical scrollbar
         * @param {HTMLElement} el
         * @returns {boolean}
         * @ignore
         */
        hasVScrollbar    : function hasVScrollbar(el) {
            return el.clientHeight !== el.scrollHeight;
        },

        /**
         * Create style sheet
         * @param {String} id Id of the element
         * @param {String} cssRules CSS Rules as string
         * @ignore
         */
        createStyleSheet : function createStyleSheet(id, cssRules) {
            var style, textNode;

            // Already created
            if (document.getElementById(id)) {
                return;
            }

            style = document.createElement('style');
            style.setAttribute('type', 'text/css');
            style.id = id;
            if (!style.styleSheet) { // Not IE
                textNode = document.createTextNode(cssRules);
                style.appendChild(textNode);
            } else {
                style.styleSheet.cssText = cssRules;
            }
            document.getElementsByTagName("head")[0].appendChild(style);
        },

        /**
         * Remove the CSS class on the element
         * @param {HTMLElement} el Element
         * @param {String} className Class to remove
         * @ignore
         */
        removeClass: function removeClass(el, className) {
            if (el.classList) {
                el.classList.remove(className);
            }
            else {
                el.className = el.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
            }
        }
    };

    /**
     * @class FixHeaders
     * @ignore
     */
    /**
     * Creates a new instance of table fix headers
     *
     * @param {HTMLElement} table Table element
     * @param {TableFixHeaders} table.fixHeaders
     * @param {Object} [options] Options
     * @param {Function} [options.beforeCreate] Call-back before creation. Return false to prevent the creation
     * @constructor
     * @ignore
     */
    function FixHeaders(table, options) {
        if (table.fixHeaders) {
            table.fixHeaders.inner.options = options;
            return table.fixHeaders.refresh();
        }

        if (options && typeof options.beforeCreate === 'function') {
            var value = options.beforeCreate(table, options);
            if (typeof value === 'boolean' && value === false) {
                return this;
            }
        }

        this.table = table;
        this.inner = new TableFixHeaders(table, options);
        table.fixHeaders = this;
        return this;
    }

    /**
     * Destroy the fix header
     * @chainable
     */
    FixHeaders.prototype.destroy = function destroy() {
        this.inner.destroy();
        return this;
    };

    /**
     * Refresh the table fix header
     * @chainable
     */
    FixHeaders.prototype.refresh = function refresh() {
        this.inner.refresh();
        return this;
    };

    /**
     * Creates a new instance of table fix headers
     * @static
     * @param {HTMLElement} table Table element
     * @param {TableFixHeaders} table.fixHeaders
     * @param {Object} [options] Options
     * @param {Function} [options.beforeCreate] Call-back before creation. Return false to prevent the creation
     * @return {FixHeaders} New instance of fix headers
     */
    FixHeaders.create = function (table, options) {
        return new FixHeaders(table, options);
    };

    /**
     * Validate the table to make sure the fixed headers will be applied correctly
     *
     * @param {HTMLElement} table Table to vlaidate
     * @return {Boolean} Return true when the table has correct formatting
     */
    FixHeaders.isValidTable = function isValidTable(table) {
        // Invalid table
        if (!table || !table.querySelector) {
            return false;
        }

        var tbody    = table.querySelector('tbody'),
            colgroup = table.querySelector('colgroup'),
            cols, rows, colNumber, cells, i, l, foundRowsWithAllCells = false;

        // No <tbody /> or <colgroup />
        if (!tbody || !colgroup) {
            return false;
        }

        // No <col />
        cols = colgroup.querySelectorAll('col');
        if (!cols || !cols.length) {
            return false;
        }

        colNumber = cols.length;

        // No <tr /> in <tbody />
        rows     = tbody.querySelectorAll('tr');
        if (!rows || !rows.length) {
            return false;
        }

        for (i = 0, l = rows.length; i < l; i++) {
            cells = rows[i].querySelectorAll('td, th');
            if (colNumber === cells.length) {
                foundRowsWithAllCells = true;
                break;
            }
        }

        // Not the same number of columns and cells
        if (!foundRowsWithAllCells) {
            return false;
        }

        // Everything seems to be fine!
        return true;
    };


    /**
     * @class TableFixHeaders
     * @ignore
     */
    /**
     * Private class to create a new instance of table with fix headers
     *
     * @param {HTMLElement} table Table element
     * @param {Object} [options] Options
     * @param {Function} [options.skipCreation] Return true to skip the creation
     * @param {Function} [options.onScroll] Callback method to execute during the scroll
     * @constructor
     * @ignore
     * @private
     */
    function TableFixHeaders(table, options) {
        this.table = table;
        this.options = options;
        this.create();
    }

    /**
     * Create the table fix headers
     * @chainable
     */
    TableFixHeaders.prototype.create = function initTableFixHeaders() {
        this.destroyed  = false;
        this.colgroup   = this.table.querySelector('colgroup');
        this.caption    = this.table.querySelector('caption');
        this.head       = this.table.querySelector('thead');
        this.body       = this.table.querySelector('tbody');
        this.foot       = this.table.querySelector('tfoot');
        this.footnote   = this.table.querySelector('tfoot tr.footnote');
        this.bgcolor    =  helpers.getVisibleBackgroundColor(this.table);


        this.cache      = {};
        this.wrapper = {
            decorator       : this.createWrapper('fix-headers fix-headers-decorator'),
            main            : this.createWrapper('fix-headers-wrapper'),
            caption         : this.caption && this.createWrapper('fix-headers fix-headers-caption'),
            headIntersect   : this.createWrapper('fix-headers fix-headers-intersects'),
            columns         : this.createWrapper('fix-headers fix-headers-dimensions'),
            rows            : this.createWrapper('fix-headers fix-headers-dimensions'),
            body            : this.createWrapper('fix-headers-body'),
            footIntersect   : this.foot && this.createWrapper('fix-headers fix-headers-intersects'),
            foot            : this.foot && this.createWrapper('fix-headers fix-headers-dimensions'),
            footnote        : this.footnote && this.createWrapper('fix-headers fix-headers-caption')
        };

        var tableEl = this.table.cloneNode(false);
        tableEl.removeAttribute('id');

        // Specific for askiaVista, remove that classes
        // to discriminate the original table and the clone
        helpers.removeClass(tableEl, 'askia-crosstab');
        helpers.removeClass(tableEl, 'askia-rawdata');


        this.tables = {
            headIntersect : null,
            footIntersect : null,
            caption       : this.caption && tableEl.cloneNode(),
            columns       : tableEl.cloneNode(),
            rows          : tableEl.cloneNode(),
            foot          : this.foot && tableEl.cloneNode(),
            footnote      : this.footnote && tableEl.cloneNode()
        };

        // Special management for footnote
        if (this.foot && this.footnote) {
            var originalFoot = this.foot,
                footnote;

            this.foot = originalFoot.cloneNode(true);
            footnote = this.foot.querySelector('tr.footnote');
            this.foot.removeChild(footnote);

            this.footnote = originalFoot.cloneNode(true);
            this.footnote.innerHTML = '';
            this.footnote.appendChild(footnote);
        }



        // IMPORTANT: Keep the below methods call order
        this.setupWrappers()
            .fixBorders()            // Must be call before cloning
            .createCaption()
            .createColumns()
            .createRows()
            .createHeadIntersect()   // Must be call after columns and rows computation
            .createFoot()
            .createFootnote()
            .createFootIntersect()   // Must be call at the end
            .fixPositions()
            .resize()
            .bindScroll();


        return this;
    };

    /**
     * Create a div element with specified class name
     * @param {String} className CSS Class Name
     * @returns {HTMLElement}
     */
    TableFixHeaders.prototype.createWrapper = function createWrapper(className) {
        var el = document.createElement('div');
        el.className = className;
        el.style.background = this.bgcolor;
        return el;
    };

    /**
     * Setup all wrappers
     * @chainable
     */
    TableFixHeaders.prototype.setupWrappers = function setupWrappers() {
        var wrapper = this.wrapper,
            main    = wrapper.main,
            body    = wrapper.body,
            table   = this.table,
            width,  key, el;

        helpers.insertAfter(table, main);
        main.appendChild(wrapper.decorator);
        if (wrapper.caption) {
            main.appendChild(wrapper.caption);
        }
        main.appendChild(wrapper.headIntersect);
        main.appendChild(wrapper.columns);
        main.appendChild(wrapper.rows);
        body.appendChild(table);
        main.appendChild(wrapper.body);
        if (wrapper.foot) {
            main.appendChild(wrapper.footIntersect);
            main.appendChild(wrapper.foot);
        }
        if (wrapper.footnote) {
            main.appendChild(wrapper.footnote);
        }

        // Set the size of tables
        this.freezeOriginalTable();
        width = table.clientWidth;

        for (key in this.tables) {
            if (this.tables.hasOwnProperty(key) && this.tables[key]) {
                el = this.tables[key];
                el.style.width = width + 'px';
            }
        }
        return this;
    };

    /**
     * Freeze the size of the original table
     *
     * @chainable
     */
    TableFixHeaders.prototype.freezeOriginalTable = function freezeOriginalTable() {
        var table         = this.table,
            width         = table.clientWidth,
            cells         = this.getFirstCellRowWithAllColumns(),
            cols          = this.colgroup.querySelectorAll('col'),
            i, l;

        // Fix the width
        for (i = 0, l = cells.length; i < l; i++) {
            cols[i].style.width = cells[i].offsetWidth + 'px';
        }
        table.style.width = width + 'px'; // Enforce the table width

        return this;
    };

    /**
     * Unfreeze the size of the original table let it get it's natural size
     * @chainable
     */
    TableFixHeaders.prototype.unfreezeOriginalTable = function unfreezeOriginalTable() {
        var table         = this.table,
            cols          = this.colgroup.querySelectorAll('col'),
            i, l;

        // Fix the width
        for (i = 0, l = cols.length; i < l; i++) {
            cols[i].style.width = '';
        }
        table.style.width = '';
        return this;
    };

    /**
     * Fix all borders
     * @chainable
     */
    TableFixHeaders.prototype.fixBorders = function fixBorders() {
        this.wrapper.decorator.style.border         = getComputedStyle(this.table).getPropertyValue('border');
        this.wrapper.decorator.style.borderTop      = 'none';

        if (this.tables.caption) {
            this.tables.caption.style.borderTop         = 'none';
            this.tables.caption.style.borderBottom      = 'none';
        }
        this.tables.columns.style.borderBottom          = 'none';
        if (this.tables.foot) {
            this.tables.foot.style.borderTop            = 'none';
        }
        if (this.tables.footnote) {
            if (this.tables.foot) {
                this.tables.foot.style.borderBottom     = 'none';
            }
        }
        return this;
    };

    /**
     * Fix the size of the body wrapper
     * @chainable
     */
    TableFixHeaders.prototype.fixBodyWrapper = function fixBodyWrapper() {
        var wrapper             = this.wrapper,
            borderRightSize     = helpers.getBorderSize(this.table, 'right'),
            maxTableHeight      = this.getMaxTableHeight(),
            top  = wrapper.columns.clientHeight,
            left = wrapper.rows.clientWidth;

        wrapper.body.style.width    =  (wrapper.main.clientWidth - borderRightSize - left) + 'px';
        wrapper.body.style.height   =  (maxTableHeight - top) + 'px';
        return this;
    };

    /**
     * Return the maximum table height according to the size of the table and the size
     * of the main container
     * @return {Number}
     */
    TableFixHeaders.prototype.getMaxTableHeight = function getMaxTableHeight() {
        var scrollbarSize    = helpers.getScrollbarSize(),
            rect             = typeof this.table.getBoundingClientRect == 'function' && this.table.getBoundingClientRect(),
            tableHeight      = this.table.clientHeight + helpers.getBorderSize(this.table, 'bottom'),
            tableHeightWithScrollbar = tableHeight + scrollbarSize,
            containerHeight  = this.wrapper.main.clientHeight;

        // Fix for Firefox which don't provide a right clientHeight
        if (rect) {
            tableHeight = rect.height;
            tableHeightWithScrollbar = rect.height + scrollbarSize;
        }

        if (tableHeight > containerHeight) {
            return containerHeight;
        } else if (tableHeightWithScrollbar > containerHeight) {
            return containerHeight;
        } else {
            return tableHeightWithScrollbar;
        }
    };

    /**
     * Returns an object with all proportions
     */
    TableFixHeaders.prototype.getProportions = function getProportions() {
        var wrapper             = this.wrapper,
            props               = this.cache.props,
            maxTableHeight      = this.getMaxTableHeight();

        if (!props) {
            // Main cached proportions (will not be reset anymore)
            props = {
                scrollbarSize         : helpers.getScrollbarSize(),
                borderLeftSize        : helpers.getBorderSize(this.table, 'left'),
                borderRightSize       : helpers.getBorderSize(this.table, 'right'),
                borderBottomSize      : helpers.getBorderSize(this.table, 'bottom')
            };
            props.horizontalBorderSize = props.borderLeftSize + props.borderRightSize;
        }

        // Top/Left position
        props.top            = wrapper.columns.clientHeight;
        props.left           = wrapper.rows.clientWidth;

        // Reset the body right now to detect if there is a scrollbar
        wrapper.body.style.width    =  (wrapper.main.clientWidth - props.borderRightSize - props.left) + 'px';
        wrapper.body.style.height   =  (maxTableHeight - props.top) + 'px';

        // Defined H/V scroll bars size
        props.horizontalScrollSize  =  helpers.hasHScrollbar(wrapper.body) ? props.scrollbarSize : 0;
        props.verticalScrollSize    =  helpers.hasVScrollbar(wrapper.body) ? props.scrollbarSize : 0;

        props.minHeight             = maxTableHeight - props.horizontalScrollSize;
        // Fix height according to the scrollbar
        if (!props.horizontalScrollSize && !props.verticalScrollSize) {
            props.minHeight -= props.scrollbarSize;
        }
        props.minWidth              = wrapper.main.clientWidth - props.verticalScrollSize;
        props.maxWidth              = props.minWidth + props.verticalScrollSize;
        // Fix the width according to the scrollbar
        if (!props.verticalScrollSize) {
            props.maxWidth -= props.borderRightSize;
        }

        if (this.caption) {
            props.caption        = {
                width : props.minWidth
            };
        }
        if (this.footnote) {
            props.footnote      = {
                width   : props.minWidth - props.borderRightSize,
                height  : wrapper.footnote.clientHeight,
                top     : props.minHeight - wrapper.footnote.clientHeight
            };
        }
        if (this.foot) {
            var top = props.minHeight - wrapper.foot.clientHeight;
            if (props.footnote && props.footnote.height) {
                top -= props.footnote.height;
            }
            props.foot           = {
                width  : props.minWidth  - props.borderRightSize,
                height : wrapper.foot.clientHeight,
                top    : top
            };
        }

        props.rows           = {
            width : wrapper.rows.clientWidth
        };
        props.columns        = {
            width : props.minWidth
        };
        props.decorator      = {
            width  : props.maxWidth - props.horizontalBorderSize,
            // Height must be recalculated
            getHeight : function getDecoratorHeight() {
                var captionHeight    = wrapper.caption ? wrapper.caption.clientHeight : 0,
                    borderBottomSize = props.horizontalScrollSize ?  0 : props.borderBottomSize;
                return ((props.minHeight + props.horizontalScrollSize)  - captionHeight - borderBottomSize);
            }
        };
        this.cache.props = props;
        return this.cache.props;
    };

    /**
     * Resize the table
     * @chainable
     */
    TableFixHeaders.prototype.resize = function resize() {
        if (this.destroyed) {
            return this;
        }
        var wrapper             = this.wrapper,
            props               = this.getProportions();

        if (this.caption) {
            wrapper.caption.style.width = props.caption.width + 'px';
        }

        wrapper.columns.style.width = props.columns.width  + 'px';
        wrapper.rows.style.height   = props.minHeight - props.borderBottomSize  + 'px';
        wrapper.headIntersect.style.width = props.rows.width + 'px';

        if (this.foot) {
            wrapper.foot.style.top      = props.foot.top + 'px';
            wrapper.foot.style.width    = props.foot.width + 'px';

            wrapper.footIntersect.style.top = props.foot.top + 'px';
            wrapper.footIntersect.style.width = props.rows.width + 'px';
        }

        if (this.footnote) {
            wrapper.footnote.style.top   = props.footnote.top + 'px';
            wrapper.footnote.style.width = props.footnote.width + 'px';
        }

        // Search the height after the width reset
        wrapper.decorator.style.top    = (this.caption) ? wrapper.caption.clientHeight + 'px' : '0px';
        wrapper.decorator.style.width  = props.decorator.width + 'px';
        wrapper.decorator.style.height = props.decorator.getHeight() + 'px';

        // this.fixTablesSize();
        return this;
    };

    /**
     * Fix the positions
     * @chainable
     */
    TableFixHeaders.prototype.fixPositions = function fixPositions() {
        var wrapper        = this.wrapper,
            top            = wrapper.columns.clientHeight,
            left           = wrapper.rows.clientWidth;

        this.table.style.marginTop  = -(top) + 'px';
        this.table.style.marginLeft = -(left) + 'px';

        wrapper.body.style.top     = top + 'px';
        wrapper.body.style.left    = left + 'px';
        return this;
    };

    /**
     * Retrieve the rows which has all columns
     */
    TableFixHeaders.prototype.getFirstCellRowWithAllColumns = function getFirstCellRowWithAllColumns() {
        if (!this.body) {
            return [];
        }
        var colNumber = this.colgroup.querySelectorAll('col').length,
            rows     = this.body.querySelectorAll('tr'),
            cells, i, l;

        for (i = 0, l = rows.length; i < l; i++) {
            cells = rows[i].querySelectorAll('td, th');
            if (colNumber === cells.length) {
                return cells;
            }
        }

        return [];
    };


    /**
     * Return a clone of colgroup with the right size
     */
    TableFixHeaders.prototype.getColgroupClone = function getColgroupClone() {
        return this.colgroup.cloneNode(true);
    };

    /**
     * Create the caption
     * @chainable
     */
    TableFixHeaders.prototype.createCaption = function createCaption() {
        if (!this.caption) {
            return this;
        }
        this.updateCaption();
        this.wrapper.caption.appendChild(this.tables.caption);
        return this;
    };

    /**
     * Create the caption
     * @chainable
     */
    TableFixHeaders.prototype.updateCaption = function updateCaption() {
        if (!this.caption) {
            return this;
        }
        var oldCaption = this.tables.caption.querySelector('caption'),
            newCaption = this.caption.cloneNode(true);
        if (!oldCaption) {
            this.tables.caption.appendChild(newCaption);
        } else {
            this.tables.caption.replaceChild(newCaption, oldCaption);
        }
        return this;
    };

    /**
     * Create columns headers
     * @chainable
     */
    TableFixHeaders.prototype.createColumns = function createColumns() {
        var cloneColgroup = this.getColgroupClone(),
            columns       = this.tables.columns,
            columnsWrapper = this.wrapper.columns;

        this.updateColumnsCaption();
        columns.appendChild(cloneColgroup);
        this.updateColumnsHead();

        columnsWrapper.appendChild(columns);
        return this;
    };

    /**
     * Update columns headers
     * @chainable
     */
    TableFixHeaders.prototype.updateColumns = function updateColumns() {
        this.updateColumnsCaption()
            .updateColumnsHead();
        return this;
    };

    /**
     * Update caption of columns headers
     * @chainable
     */
    TableFixHeaders.prototype.updateColumnsCaption = function updateColumnsCaption() {
        if (!this.caption) {
            return this;
        }
        var columns     = this.tables.columns,
            oldCaption    = columns.querySelector('caption'),
            newCaption    = this.caption.cloneNode(true);

        if (!oldCaption) {
            columns.appendChild(newCaption);
        } else {
            columns.replaceChild(newCaption, oldCaption);
        }

        return this;
    };

    /**
     * Update THead of columns headers
     * @chainable
     */
    TableFixHeaders.prototype.updateColumnsHead = function updateColumnsHead() {
        var columns     = this.tables.columns,
            oldTHead    = columns.querySelector('thead'),
            newTHead    = this.head.cloneNode(true);

        if (!oldTHead) {
            columns.appendChild(newTHead);
        } else {
            columns.replaceChild(newTHead, oldTHead);
        }

        return this;
    };

    /**
     * Create rows headers
     * @chainable
     */
    TableFixHeaders.prototype.createRows = function createRows() {
        var cloneColgroup = this.getColgroupClone(),
            tableRows     = this.tables.rows,
            wrapperRows   = this.wrapper.rows;

        this.updateRowsCaption();
        tableRows.appendChild(cloneColgroup);
        this.updateRowsHead();
        this.updateRowsBody();
        wrapperRows.appendChild(tableRows);

        return this;
    };

    /**
     * Update rows headers table
     * @chainable
     */
    TableFixHeaders.prototype.updateRows = function updateRows() {
        this.updateRowsCaption()
            .updateRowsHead()
            .updateRowsBody();
        return this;
    };

    /**
     * Update TBody of rows headers table
     * @chainable
     */
    TableFixHeaders.prototype.updateRowsBody = function updateRowsBody() {
        var rows          = (this.body && this.body.querySelectorAll('tr')) || [],
            maxWidth      = 0,
            tableRows     = this.tables.rows,
            wrapperRows   = this.wrapper.rows,
            oldTBody      = tableRows.querySelector('tbody'),
            newTBody      = this.body && this.body.cloneNode(false),
            i, l, j, k,
            row, cells, tr, currentWidth, initialWidth,
            cell, cloneTh, rowspan, colspan;

        initialWidth  =  helpers.getBorderSize(this.table, 'left') ;

        this.cache.cellsWithColspan = [];

        for (i = 0, l = rows.length; i < l; i += 1) {
            row   = rows[i];
            cells = row.querySelectorAll('th, td');
            tr    = row.cloneNode(false);
            currentWidth = initialWidth;
            cell    = cells[0];
            j       = 0;
            k       = cells.length;

            // Only take the first ths
            while(cell && cell.tagName.toLocaleLowerCase() === 'th') {
                cloneTh = cell.cloneNode(true);
                rowspan = cloneTh.getAttribute('rowspan');
                if (!rowspan || parseInt(rowspan, 10) === 1) {
                    cloneTh.style.height = parseInt(getComputedStyle(cell).getPropertyValue('height'), 10) + 'px';
                }
                colspan = cloneTh.getAttribute('colspan');
                if (!colspan || parseInt(colspan, 10) === 1) {
                    currentWidth += cell.offsetWidth;
                } else {
                    this.cache.cellsWithColspan.push(cell);
                }
                tr.appendChild(cloneTh);
                j++;
                cell = (j < k) ? cells[j] : null;
            }

            tr.style.height = row.clientHeight + 'px';
            newTBody.appendChild(tr);
            if (currentWidth > maxWidth ) {
                maxWidth = currentWidth;
            }
        }

        if (oldTBody) {
            tableRows.replaceChild(newTBody, oldTBody);
        } else if (newTBody) {
            tableRows.appendChild(newTBody);
        }

        wrapperRows.style.width =  maxWidth + 'px';
        return this;
    };

    /**
     * Update caption of rows headers table
     * @chainable
     */
    TableFixHeaders.prototype.updateRowsCaption = function updateRowsCaption() {
        if (!this.caption) {
            return this;
        }
        var caption     = this.tables.rows,
            newCaption  = this.caption.cloneNode(true),
            oldCaption  = caption.querySelector('caption');
        if (!oldCaption) {
            caption.appendChild(newCaption);
        } else {
            caption.replaceChild(newCaption, oldCaption);
        }
        return this;
    };

    /**
     * Update THead of rows headers table
     * @chainable
     */
    TableFixHeaders.prototype.updateRowsHead = function updateRowsHead() {
        var caption     = this.tables.rows,
            newThead    = this.head.cloneNode(true),
            oldThead    = caption.querySelector('thead');
        if (!oldThead) {
            caption.appendChild(newThead);
        } else {
            caption.replaceChild(newThead, oldThead);
        }
        return this;
    };

    /**
     * Create rows/columns headers intersection
     * @chainable
     */
    TableFixHeaders.prototype.createHeadIntersect = function createHeadIntersect() {
        this.updateHeadIntersect();
        return this;
    };

    /**
     * Update rows/columns headers intersection
     * @chainable
     */
    TableFixHeaders.prototype.updateHeadIntersect = function updateHeadIntersect() {
        // Use columns header because it's already built
        // and should be less cumbersome than the rows header
        var wrapperHeadIntersect  = this.wrapper.headIntersect;
        this.tables.headIntersect = this.tables.columns.cloneNode(true);
        this.tables.headIntersect.style.marginLeft = '';
        var oldEl = wrapperHeadIntersect.querySelector('table');
        if (!oldEl) {
            wrapperHeadIntersect.appendChild(this.tables.headIntersect);
        } else {
            wrapperHeadIntersect.replaceChild(this.tables.headIntersect, oldEl);
        }
        return this;
    };

    /**
     * Create footer
     * @chainable
     */
    TableFixHeaders.prototype.createFoot = function createFoot() {
        if (!this.foot) {
            return this;
        }
        var cloneColgroup = this.getColgroupClone(),
            tableFoot    = this.tables.foot,
            wrapperFoot  = this.wrapper.foot;

        tableFoot.appendChild(cloneColgroup);
        this.updateFoot();
        wrapperFoot.appendChild(tableFoot);

        return this;
    };

    /**
     * Update footer table
     * @chainable
     */
    TableFixHeaders.prototype.updateFoot = function updateFoot() {
        if (!this.foot) {
            return this;
        }
        var tableFoot    = this.tables.foot,
            newTFoot    = this.foot.cloneNode(true),
            oldTFoot    = tableFoot.querySelector('tfoot');

        if (!oldTFoot) {
            tableFoot.appendChild(newTFoot);
        } else {
            tableFoot.replaceChild(newTFoot, oldTFoot);
        }

        return this;
    };

    /**
     * Create rows/columns footers intersection
     * @chainable
     */
    TableFixHeaders.prototype.createFootIntersect = function createFootIntersect() {
        if (!this.foot) {
            return this;
        }
        this.updateFootIntersect();
        return this;
    };

    /**
     * Update rows/columns footers intersection table
     * @chainable
     */
    TableFixHeaders.prototype.updateFootIntersect = function updateFootIntersect() {
        if (!this.foot) {
            return this;
        }
        // Use columns footer because it's already built
        var wrapperFootIntersect = this.wrapper.footIntersect;
        this.tables.footIntersect = this.tables.foot.cloneNode(true);
        this.tables.footIntersect.style.marginLeft = '';
        var oldEl = wrapperFootIntersect.querySelector('table');
        if (!oldEl) {
            wrapperFootIntersect.appendChild(this.tables.footIntersect);
        } else {
            wrapperFootIntersect.replaceChild(this.tables.footIntersect, oldEl);
        }
        return this;
    };

    /**
     * Create footnote
     * @chainable
     */
    TableFixHeaders.prototype.createFootnote = function createFootnote() {
        if (!this.footnote) {
            return this;
        }
        var tableFootnote    = this.tables.footnote,
            wrapperFootnote  = this.wrapper.footnote;

        this.updateFootnote();
        wrapperFootnote.appendChild(tableFootnote);

        return this;
    };

    /**
     * Update footnote
     * @chainable
     */
    TableFixHeaders.prototype.updateFootnote = function updateFootnote() {
        if (!this.footnote) {
            return this;
        }
        var tableFootnote    = this.tables.footnote,
            newTFootnote    = this.footnote.cloneNode(true),
            oldTFootnote    = tableFootnote.querySelector('tfoot');

        if (!oldTFootnote) {
            tableFootnote.appendChild(newTFootnote);
        } else {
            tableFootnote.replaceChild(newTFootnote, oldTFootnote);
        }

        return this;
    };

    /**
     * Bind the scroll
     * @chainable
     */
    TableFixHeaders.prototype.bindScroll = function bindScroll() {
        var self = this,
            elementsToBind = [
                'caption',
                'columns',
                'headIntersect',
                'rows',
                'footIntersect',
                'foot',
                'footnote'
            ], i, l;

        this.wrapper.body.addEventListener('scroll', function onScroll(e) {
            self.tables.columns.style.marginLeft    = -this.scrollLeft + 'px';
            if (self.tables.foot) {
                self.tables.foot.style.marginLeft   = -this.scrollLeft + 'px';
            }
            /*if (self.tables.caption) {
             self.tables.caption.style.marginLeft = -this.scrollLeft + 'px';
             }
             if (self.tables.footnote) {
             self.tables.footnote.style.marginLeft = -this.scrollLeft + 'px';
             }      */
            self.tables.rows.style.marginTop        = -this.scrollTop + 'px';

            // Manage cells in the table rows with colspan > 1
            if (self.cache.cellsWithColspan && self.cache.cellsWithColspan.length) {
                var i, l;
                for (i = 0, l = self.cache.cellsWithColspan.length; i < l; i++) {
                    self.cache.cellsWithColspan[i].childNodes[0].style.marginLeft = this.scrollLeft + 'px';
                }
            }
            if (self.options && typeof self.options.onScroll === 'function') {
                self.options.onScroll.call(this, e, self.table.fixHeaders);
            }
        });

        // Do scroll using all other wrapper
        function doScroll(e) {
            self.wrapper.body.scrollLeft += e.deltaX;
            self.wrapper.body.scrollTop += e.deltaY;
        }

        for (i = 0, l = elementsToBind.length; i < l; i++) {
            if (!this.wrapper[elementsToBind[i]]){
                return;
            }
            this.wrapper[elementsToBind[i]].addEventListener('wheel', doScroll);
        }

        return this;
    };

    /**
     * Fix the size of tables
     * @chainable
     */
    TableFixHeaders.prototype.fixTablesSize = function updateTablesSize() {
        this.freezeOriginalTable();

        var width = this.table.clientWidth,
            key, el, colgroup, colgroupClone;

        for (key in this.tables) {
            if (this.tables.hasOwnProperty(key) && this.tables[key]) {
                el = this.tables[key];
                el.style.width = width + 'px';
                colgroup = el.querySelector('colgroup');
                if (colgroup) {
                    colgroupClone = this.getColgroupClone();
                    el.replaceChild(colgroupClone, colgroup);
                }
            }
        }

        return this;
    };

    /**
     * Refresh the table
     * @chainable
     */
    TableFixHeaders.prototype.refresh = function refresh() {
        if (this.destroyed) {
            return this.create();
        }
        // Empty the cache
        this.cache = {};

        // Reset the width of the table to obtain the natural width
        this.unfreezeOriginalTable();
        this.wrapper.body.style.width = '';

        this.fixTablesSize()
            .fixBodyWrapper()
            .updateCaption()
            .updateColumns()
            .updateRows()
            .updateHeadIntersect()
            .updateFoot()
            .updateFootnote()
            .updateFootIntersect()
            .fixPositions()
            .resize();
        return this;
    };

    /**
     * Destroy the instance of the fix headers
     * @chainable
     */
    TableFixHeaders.prototype.destroy = function destroy() {
        var main     = this.wrapper.main,
            table    = this.table, i, l;

        this.unfreezeOriginalTable();
        table.style.marginTop  = '';
        table.style.marginLeft = '';

        if (this.cache.cellsWithColspan && this.cache.cellsWithColspan.length) {
            for (i = 0, l = this.cache.cellsWithColspan.length; i < l; i++) {
                this.cache.cellsWithColspan[i].childNodes[0].style.marginLeft = '';
            }
        }

        helpers.insertAfter(main, table);
        main.parentNode.removeChild(main);

        this.destroyed = true;
        return this;
    };

    // Make it public
    window.FixHeaders = FixHeaders;

    // Append style sheet
    document.addEventListener("DOMContentLoaded", function domReady() {
        var css = [];
        css.push('.fix-headers-wrapper    { position : relative; width : 100%; height : 100%; }');
        css.push('.fix-headers            { position : absolute; top : 0; left : 0; overflow: hidden; }');
        css.push('.fix-headers-decorator  { background-color: rgba(0,0,0,0.1); }');
        css.push('.fix-headers-caption    { z-index : 4; }');
        css.push('.fix-headers-intersects { z-index : 3; }');
        css.push('.fix-headers-dimensions { z-index : 2; }');
        css.push('.fix-headers-body       { position : relative; border : 0; padding : 0; margin : 0; overflow : auto; }');
        helpers.createStyleSheet('fixHeaders', css.join(''));
    });


    /*
     * Build the askiaVista plugin
     * @param {Object} askiaVista
     */
    function buildAskiaVistaPlugin(askiaVista) {
        var plugin = {
            name         : "UI-TableFixHeaders",
            description  : "This plugin creates fix headers on table.",
            category     : "ui",
            version      : "1.1.0",
            date         : "26-MAY-2015",
            author       : "Askia",
            website      : "http://www.askia.com",
            helpUrl      : "https://dev.askia.com/projects/askiavista-sdk/wiki/AskiaVista_AJAX_Plugins_UI_TableFixHeaders",
            dependencies : [
                {
                    name    : "askiaVista",
                    version : ">2.2.2"
                }
            ]
        };
        plugin.afterDisplayResult = function afterDisplayResult(data, query) {
            if (!query || !query.action || !query.containerId || !query.fixHeaders) {
                return;
            }
            var container, tables, table, i, l,
                options = (typeof query.fixHeaders === 'object') ? query.fixHeaders : null;

            if (query.action === askiaVista.action.getPages || query.action === askiaVista.action.display) {
                container = document.getElementById(query.containerId);
                tables    = container.querySelectorAll('table.askiatable.askia-crosstab');

                for (i = 0, l = tables.length; i < l;  i++) {
                    FixHeaders.create(tables[0], options);
                }

            }
            if (query.action === askiaVista.action.getInterviews || query.action === askiaVista.action.getActivity) {
                container = document.getElementById(query.containerId);
                table     = container.querySelector('table.askiatable.askia-rawdata');
                FixHeaders.create(table, options);
            }
        };
        askiaVista.addPlugin(plugin);
        askiaVista.extend({
            FixHeaders  : FixHeaders
        });
    }

    // AskiaVista plugin part
    if (window.askiaVista) {
        buildAskiaVistaPlugin(window.askiaVista);
    }
}());
