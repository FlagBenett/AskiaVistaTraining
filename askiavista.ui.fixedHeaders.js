(function fixHeaders(){"use strict";function FixHeaders(e,t){if(e.fixHeaders)return e.fixHeaders.inner.options=t,e.fixHeaders.refresh();if(t&&typeof t.beforeCreate=="function"){var n=t.beforeCreate(e,t);if(typeof n=="boolean"&&n===!1)return this}return this.table=e,this.inner=new TableFixHeaders(e,t),e.fixHeaders=this,this}function TableFixHeaders(e,t){this.table=e,this.options=t,this.create()}function buildAskiaVistaPlugin(e){var t={name:"UI-TableFixHeaders",description:"This plugin creates fix headers on table.",category:"ui",version:"1.1.0",date:"26-MAY-2015",author:"Askia",website:"http://www.askia.com",helpUrl:"https://dev.askia.com/projects/askiavista-sdk/wiki/AskiaVista_AJAX_Plugins_UI_TableFixHeaders",dependencies:[{name:"askiaVista",version:">2.2.2"}]};t.afterDisplayResult=function afterDisplayResult(t,n){if(!n||!n.action||!n.containerId||!n.fixHeaders)return;var r,i,s,o,u,a=typeof n.fixHeaders=="object"?n.fixHeaders:null;if(n.action===e.action.getPages||n.action===e.action.display){r=document.getElementById(n.containerId),i=r.querySelectorAll("table.askiatable.askia-crosstab");for(o=0,u=i.length;o<u;o++)FixHeaders.create(i[0],a)}if(n.action===e.action.getInterviews||n.action===e.action.getActivity)r=document.getElementById(n.containerId),s=r.querySelector("table.askiatable.askia-rawdata"),FixHeaders.create(s,a)},e.addPlugin(t),e.extend({FixHeaders:FixHeaders})}var e={insertAfter:function insertAfter(e,t){e.parentNode.insertBefore(t,e.nextSibling)},getBorderSize:function getBorderSize(e,t){return parseFloat(getComputedStyle(e).getPropertyValue("border-"+t+"-width"))},getVisibleBackgroundColor:function getVisibleBackgroundColor(e){var t=e,n;while(t.tagName.toLocaleLowerCase()!=="body"){n=getComputedStyle(t).getPropertyValue("background-color");if(!this.isTransparent(n))return n;t=t.parentNode}return"#ffffff"},isTransparent:function isTransparent(e){if(!e||e==="transparent")return!0;var t=/rgba\s*\(\s*[0-9]+\s*,\s*[0-9]+\s*,\s*[0-9]+\s*,\s*(.*?)\s*\)/gi.exec(e),n;if(t&&t.length>1){n=parseFloat(t[1]);if(!isNaN(n)&&n<1)return!0}return!1},getScrollbarSize:function getScrollbarSize(){if(this.scrollbarSize)return this.scrollbarSize;this.scrollbarSize=0;var e=document.createElement("p");e.style.width="100%",e.style.height="200px";var t=document.createElement("div");t.style.position="absolute",t.style.top="0px",t.style.left="0px",t.style.visibility="hidden",t.style.width="200px",t.style.height="150px",t.style.overflow="hidden",t.appendChild(e),document.body.appendChild(t);var n=e.offsetWidth;t.style.overflow="scroll";var r=e.offsetWidth;return n===r&&(r=t.clientWidth),document.body.removeChild(t),this.scrollbarSize=n-r,this.scrollbarSize},hasHScrollbar:function hasHScrollbar(e){return e.clientWidth!==e.scrollWidth},hasVScrollbar:function hasVScrollbar(e){return e.clientHeight!==e.scrollHeight},createStyleSheet:function createStyleSheet(e,t){var n,r;if(document.getElementById(e))return;n=document.createElement("style"),n.setAttribute("type","text/css"),n.id=e,n.styleSheet?n.styleSheet.cssText=t:(r=document.createTextNode(t),n.appendChild(r)),document.getElementsByTagName("head")[0].appendChild(n)},removeClass:function removeClass(e,t){e.classList?e.classList.remove(t):e.className=e.className.replace(new RegExp("(^|\\b)"+t.split(" ").join("|")+"(\\b|$)","gi")," ")}};FixHeaders.prototype.destroy=function destroy(){return this.inner.destroy(),this},FixHeaders.prototype.refresh=function refresh(){return this.inner.refresh(),this},FixHeaders.create=function(e,t){return new FixHeaders(e,t)},FixHeaders.isValidTable=function isValidTable(e){if(!e||!e.querySelector)return!1;var t=e.querySelector("tbody"),n=e.querySelector("colgroup"),r,i,s,o,u,a,f=!1;if(!t||!n)return!1;r=n.querySelectorAll("col");if(!r||!r.length)return!1;s=r.length,i=t.querySelectorAll("tr");if(!i||!i.length)return!1;for(u=0,a=i.length;u<a;u++){o=i[u].querySelectorAll("td, th");if(s===o.length){f=!0;break}}return f?!0:!1},TableFixHeaders.prototype.create=function initTableFixHeaders(){this.destroyed=!1,this.colgroup=this.table.querySelector("colgroup"),this.caption=this.table.querySelector("caption"),this.head=this.table.querySelector("thead"),this.body=this.table.querySelector("tbody"),this.foot=this.table.querySelector("tfoot"),this.footnote=this.table.querySelector("tfoot tr.footnote"),this.bgcolor=e.getVisibleBackgroundColor(this.table),this.cache={},this.wrapper={decorator:this.createWrapper("fix-headers fix-headers-decorator"),main:this.createWrapper("fix-headers-wrapper"),caption:this.caption&&this.createWrapper("fix-headers fix-headers-caption"),headIntersect:this.createWrapper("fix-headers fix-headers-intersects"),columns:this.createWrapper("fix-headers fix-headers-dimensions"),rows:this.createWrapper("fix-headers fix-headers-dimensions"),body:this.createWrapper("fix-headers-body"),footIntersect:this.foot&&this.createWrapper("fix-headers fix-headers-intersects"),foot:this.foot&&this.createWrapper("fix-headers fix-headers-dimensions"),footnote:this.footnote&&this.createWrapper("fix-headers fix-headers-caption")};var t=this.table.cloneNode(!1);t.removeAttribute("id"),e.removeClass(t,"askia-crosstab"),e.removeClass(t,"askia-rawdata"),this.tables={headIntersect:null,footIntersect:null,caption:this.caption&&t.cloneNode(),columns:t.cloneNode(),rows:t.cloneNode(),foot:this.foot&&t.cloneNode(),footnote:this.footnote&&t.cloneNode()};if(this.foot&&this.footnote){var n=this.foot,r;this.foot=n.cloneNode(!0),r=this.foot.querySelector("tr.footnote"),this.foot.removeChild(r),this.footnote=n.cloneNode(!0),this.footnote.innerHTML="",this.footnote.appendChild(r)}return this.setupWrappers().fixBorders().createCaption().createColumns().createRows().createHeadIntersect().createFoot().createFootnote().createFootIntersect().fixPositions().resize().bindScroll(),this},TableFixHeaders.prototype.createWrapper=function createWrapper(e){var t=document.createElement("div");return t.className=e,t.style.background=this.bgcolor,t},TableFixHeaders.prototype.setupWrappers=function setupWrappers(){var t=this.wrapper,n=t.main,r=t.body,i=this.table,s,o,u;e.insertAfter(i,n),n.appendChild(t.decorator),t.caption&&n.appendChild(t.caption),n.appendChild(t.headIntersect),n.appendChild(t.columns),n.appendChild(t.rows),r.appendChild(i),n.appendChild(t.body),t.foot&&(n.appendChild(t.footIntersect),n.appendChild(t.foot)),t.footnote&&n.appendChild(t.footnote),this.freezeOriginalTable(),s=i.clientWidth;for(o in this.tables)this.tables.hasOwnProperty(o)&&this.tables[o]&&(u=this.tables[o],u.style.width=s+"px");return this},TableFixHeaders.prototype.freezeOriginalTable=function freezeOriginalTable(){var e=this.table,t=e.clientWidth,n=this.getFirstCellRowWithAllColumns(),r=this.colgroup.querySelectorAll("col"),i,s;for(i=0,s=n.length;i<s;i++)r[i].style.width=n[i].offsetWidth+"px";return e.style.width=t+"px",this},TableFixHeaders.prototype.unfreezeOriginalTable=function unfreezeOriginalTable(){var e=this.table,t=this.colgroup.querySelectorAll("col"),n,r;for(n=0,r=t.length;n<r;n++)t[n].style.width="";return e.style.width="",this},TableFixHeaders.prototype.fixBorders=function fixBorders(){return this.wrapper.decorator.style.border=getComputedStyle(this.table).getPropertyValue("border"),this.wrapper.decorator.style.borderTop="none",this.tables.caption&&(this.tables.caption.style.borderTop="none",this.tables.caption.style.borderBottom="none"),this.tables.columns.style.borderBottom="none",this.tables.foot&&(this.tables.foot.style.borderTop="none"),this.tables.footnote&&this.tables.foot&&(this.tables.foot.style.borderBottom="none"),this},TableFixHeaders.prototype.fixBodyWrapper=function fixBodyWrapper(){var t=this.wrapper,n=e.getBorderSize(this.table,"right"),r=this.getMaxTableHeight(),i=t.columns.clientHeight,s=t.rows.clientWidth;return t.body.style.width=t.main.clientWidth-n-s+"px",t.body.style.height=r-i+"px",this},TableFixHeaders.prototype.getMaxTableHeight=function getMaxTableHeight(){var t=e.getScrollbarSize(),n=typeof this.table.getBoundingClientRect=="function"&&this.table.getBoundingClientRect(),r=this.table.clientHeight+e.getBorderSize(this.table,"bottom"),i=r+t,s=this.wrapper.main.clientHeight;return n&&(r=n.height,i=n.height+t),r>s?s:i>s?s:i},TableFixHeaders.prototype.getProportions=function getProportions(){var t=this.wrapper,n=this.cache.props,r=this.getMaxTableHeight();n||(n={scrollbarSize:e.getScrollbarSize(),borderLeftSize:e.getBorderSize(this.table,"left"),borderRightSize:e.getBorderSize(this.table,"right"),borderBottomSize:e.getBorderSize(this.table,"bottom")},n.horizontalBorderSize=n.borderLeftSize+n.borderRightSize),n.top=t.columns.clientHeight,n.left=t.rows.clientWidth,t.body.style.width=t.main.clientWidth-n.borderRightSize-n.left+"px",t.body.style.height=r-n.top+"px",n.horizontalScrollSize=e.hasHScrollbar(t.body)?n.scrollbarSize:0,n.verticalScrollSize=e.hasVScrollbar(t.body)?n.scrollbarSize:0,n.minHeight=r-n.horizontalScrollSize,!n.horizontalScrollSize&&!n.verticalScrollSize&&(n.minHeight-=n.scrollbarSize),n.minWidth=t.main.clientWidth-n.verticalScrollSize,n.maxWidth=n.minWidth+n.verticalScrollSize,n.verticalScrollSize||(n.maxWidth-=n.borderRightSize),this.caption&&(n.caption={width:n.minWidth}),this.footnote&&(n.footnote={width:n.minWidth-n.borderRightSize,height:t.footnote.clientHeight,top:n.minHeight-t.footnote.clientHeight});if(this.foot){var i=n.minHeight-t.foot.clientHeight;n.footnote&&n.footnote.height&&(i-=n.footnote.height),n.foot={width:n.minWidth-n.borderRightSize,height:t.foot.clientHeight,top:i}}return n.rows={width:t.rows.clientWidth},n.columns={width:n.minWidth},n.decorator={width:n.maxWidth-n.horizontalBorderSize,getHeight:function getDecoratorHeight(){var e=t.caption?t.caption.clientHeight:0,r=n.horizontalScrollSize?0:n.borderBottomSize;return n.minHeight+n.horizontalScrollSize-e-r}},this.cache.props=n,this.cache.props},TableFixHeaders.prototype.resize=function resize(){if(this.destroyed)return this;var e=this.wrapper,t=this.getProportions();return this.caption&&(e.caption.style.width=t.caption.width+"px"),e.columns.style.width=t.columns.width+"px",e.rows.style.height=t.minHeight-t.borderBottomSize+"px",e.headIntersect.style.width=t.rows.width+"px",this.foot&&(e.foot.style.top=t.foot.top+"px",e.foot.style.width=t.foot.width+"px",e.footIntersect.style.top=t.foot.top+"px",e.footIntersect.style.width=t.rows.width+"px"),this.footnote&&(e.footnote.style.top=t.footnote.top+"px",e.footnote.style.width=t.footnote.width+"px"),e.decorator.style.top=this.caption?e.caption.clientHeight+"px":"0px",e.decorator.style.width=t.decorator.width+"px",e.decorator.style.height=t.decorator.getHeight()+"px",this},TableFixHeaders.prototype.fixPositions=function fixPositions(){var e=this.wrapper,t=e.columns.clientHeight,n=e.rows.clientWidth;return this.table.style.marginTop=-t+"px",this.table.style.marginLeft=-n+"px",e.body.style.top=t+"px",e.body.style.left=n+"px",this},TableFixHeaders.prototype.getFirstCellRowWithAllColumns=function getFirstCellRowWithAllColumns(){if(!this.body)return[];var e=this.colgroup.querySelectorAll("col").length,t=this.body.querySelectorAll("tr"),n,r,i;for(r=0,i=t.length;r<i;r++){n=t[r].querySelectorAll("td, th");if(e===n.length)return n}return[]},TableFixHeaders.prototype.getColgroupClone=function getColgroupClone(){return this.colgroup.cloneNode(!0)},TableFixHeaders.prototype.createCaption=function createCaption(){return this.caption?(this.updateCaption(),this.wrapper.caption.appendChild(this.tables.caption),this):this},TableFixHeaders.prototype.updateCaption=function updateCaption(){if(!this.caption)return this;var e=this.tables.caption.querySelector("caption"),t=this.caption.cloneNode(!0);return e?this.tables.caption.replaceChild(t,e):this.tables.caption.appendChild(t),this},TableFixHeaders.prototype.createColumns=function createColumns(){var e=this.getColgroupClone(),t=this.tables.columns,n=this.wrapper.columns;return this.updateColumnsCaption(),t.appendChild(e),this.updateColumnsHead(),n.appendChild(t),this},TableFixHeaders.prototype.updateColumns=function updateColumns(){return this.updateColumnsCaption().updateColumnsHead(),this},TableFixHeaders.prototype.updateColumnsCaption=function updateColumnsCaption(){if(!this.caption)return this;var e=this.tables.columns,t=e.querySelector("caption"),n=this.caption.cloneNode(!0);return t?e.replaceChild(n,t):e.appendChild(n),this},TableFixHeaders.prototype.updateColumnsHead=function updateColumnsHead(){var e=this.tables.columns,t=e.querySelector("thead"),n=this.head.cloneNode(!0);return t?e.replaceChild(n,t):e.appendChild(n),this},TableFixHeaders.prototype.createRows=function createRows(){var e=this.getColgroupClone(),t=this.tables.rows,n=this.wrapper.rows;return this.updateRowsCaption(),t.appendChild(e),this.updateRowsHead(),this.updateRowsBody(),n.appendChild(t),this},TableFixHeaders.prototype.updateRows=function updateRows(){return this.updateRowsCaption().updateRowsHead().updateRowsBody(),this},TableFixHeaders.prototype.updateRowsBody=function updateRowsBody(){var t=this.body&&this.body.querySelectorAll("tr")||[],n=0,r=this.tables.rows,i=this.wrapper.rows,s=r.querySelector("tbody"),o=this.body&&this.body.cloneNode(!1),u,a,f,l,c,h,p,d,v,m,g,y,b;v=e.getBorderSize(this.table,"left"),this.cache.cellsWithColspan=[];for(u=0,a=t.length;u<a;u+=1){c=t[u],h=c.querySelectorAll("th, td"),p=c.cloneNode(!1),d=v,m=h[0],f=0,l=h.length;while(m&&m.tagName.toLocaleLowerCase()==="th"){g=m.cloneNode(!0),y=g.getAttribute("rowspan");if(!y||parseInt(y,10)===1)g.style.height=parseInt(getComputedStyle(m).getPropertyValue("height"),10)+"px";b=g.getAttribute("colspan"),!b||parseInt(b,10)===1?d+=m.offsetWidth:this.cache.cellsWithColspan.push(m),p.appendChild(g),f++,m=f<l?h[f]:null}p.style.height=c.clientHeight+"px",o.appendChild(p),d>n&&(n=d)}return s?r.replaceChild(o,s):o&&r.appendChild(o),i.style.width=n+"px",this},TableFixHeaders.prototype.updateRowsCaption=function updateRowsCaption(){if(!this.caption)return this;var e=this.tables.rows,t=this.caption.cloneNode(!0),n=e.querySelector("caption");return n?e.replaceChild(t,n):e.appendChild(t),this},TableFixHeaders.prototype.updateRowsHead=function updateRowsHead(){var e=this.tables.rows,t=this.head.cloneNode(!0),n=e.querySelector("thead");return n?e.replaceChild(t,n):e.appendChild(t),this},TableFixHeaders.prototype.createHeadIntersect=function createHeadIntersect(){return this.updateHeadIntersect(),this},TableFixHeaders.prototype.updateHeadIntersect=function updateHeadIntersect(){var e=this.wrapper.headIntersect;this.tables.headIntersect=this.tables.columns.cloneNode(!0),this.tables.headIntersect.style.marginLeft="";var t=e.querySelector("table");return t?e.replaceChild(this.tables.headIntersect,t):e.appendChild(this.tables.headIntersect),this},TableFixHeaders.prototype.createFoot=function createFoot(){if(!this.foot)return this;var e=this.getColgroupClone(),t=this.tables.foot,n=this.wrapper.foot;return t.appendChild(e),this.updateFoot(),n.appendChild(t),this},TableFixHeaders.prototype.updateFoot=function updateFoot(){if(!this.foot)return this;var e=this.tables.foot,t=this.foot.cloneNode(!0),n=e.querySelector("tfoot");return n?e.replaceChild(t,n):e.appendChild(t),this},TableFixHeaders.prototype.createFootIntersect=function createFootIntersect(){return this.foot?(this.updateFootIntersect(),this):this},TableFixHeaders.prototype.updateFootIntersect=function updateFootIntersect(){if(!this.foot)return this;var e=this.wrapper.footIntersect;this.tables.footIntersect=this.tables.foot.cloneNode(!0),this.tables.footIntersect.style.marginLeft="";var t=e.querySelector("table");return t?e.replaceChild(this.tables.footIntersect,t):e.appendChild(this.tables.footIntersect),this},TableFixHeaders.prototype.createFootnote=function createFootnote(){if(!this.footnote)return this;var e=this.tables.footnote,t=this.wrapper.footnote;return this.updateFootnote(),t.appendChild(e),this},TableFixHeaders.prototype.updateFootnote=function updateFootnote(){if(!this.footnote)return this;var e=this.tables.footnote,t=this.footnote.cloneNode(!0),n=e.querySelector("tfoot");return n?e.replaceChild(t,n):e.appendChild(t),this},TableFixHeaders.prototype.bindScroll=function bindScroll(){function doScroll(t){e.wrapper.body.scrollLeft+=t.deltaX,e.wrapper.body.scrollTop+=t.deltaY}var e=this,t=["caption","columns","headIntersect","rows","footIntersect","foot","footnote"],n,r;this.wrapper.body.addEventListener("scroll",function onScroll(t){e.tables.columns.style.marginLeft=-this.scrollLeft+"px",e.tables.foot&&(e.tables.foot.style.marginLeft=-this.scrollLeft+"px"),e.tables.rows.style.marginTop=-this.scrollTop+"px";if(e.cache.cellsWithColspan&&e.cache.cellsWithColspan.length){var n,r;for(n=0,r=e.cache.cellsWithColspan.length;n<r;n++)e.cache.cellsWithColspan[n].childNodes[0].style.marginLeft=this.scrollLeft+"px"}e.options&&typeof e.options.onScroll=="function"&&e.options.onScroll.call(this,t,e.table.fixHeaders)});for(n=0,r=t.length;n<r;n++){if(!this.wrapper[t[n]])return;this.wrapper[t[n]].addEventListener("wheel",doScroll)}return this},TableFixHeaders.prototype.fixTablesSize=function updateTablesSize(){this.freezeOriginalTable();var e=this.table.clientWidth,t,n,r,i;for(t in this.tables)this.tables.hasOwnProperty(t)&&this.tables[t]&&(n=this.tables[t],n.style.width=e+"px",r=n.querySelector("colgroup"),r&&(i=this.getColgroupClone(),n.replaceChild(i,r)));return this},TableFixHeaders.prototype.refresh=function refresh(){return this.destroyed?this.create():(this.cache={},this.unfreezeOriginalTable(),this.wrapper.body.style.width="",this.fixTablesSize().fixBodyWrapper().updateCaption().updateColumns().updateRows().updateHeadIntersect().updateFoot().updateFootnote().updateFootIntersect().fixPositions().resize(),this)},TableFixHeaders.prototype.destroy=function destroy(){var t=this.wrapper.main,n=this.table,r,i;this.unfreezeOriginalTable(),n.style.marginTop="",n.style.marginLeft="";if(this.cache.cellsWithColspan&&this.cache.cellsWithColspan.length)for(r=0,i=this.cache.cellsWithColspan.length;r<i;r++)this.cache.cellsWithColspan[r].childNodes[0].style.marginLeft="";return e.insertAfter(t,n),t.parentNode.removeChild(t),this.destroyed=!0,this},window.FixHeaders=FixHeaders,document.addEventListener("DOMContentLoaded",function domReady(){var t=[];t.push(".fix-headers-wrapper    { position : relative; width : 100%; height : 100%; }"),t.push(".fix-headers            { position : absolute; top : 0; left : 0; overflow: hidden; }"),t.push(".fix-headers-decorator  { background-color: rgba(0,0,0,0.1); }"),t.push(".fix-headers-caption    { z-index : 4; }"),t.push(".fix-headers-intersects { z-index : 3; }"),t.push(".fix-headers-dimensions { z-index : 2; }"),t.push(".fix-headers-body       { position : relative; border : 0; padding : 0; margin : 0; overflow : auto; }"),e.createStyleSheet("fixHeaders",t.join(""))}),window.askiaVista&&buildAskiaVistaPlugin(window.askiaVista)})();