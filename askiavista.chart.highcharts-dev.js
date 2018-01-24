/*globals jQuery,askiaVista,window,Highcharts*/
/*!
 * AskiaVista - CHART - Highcharts - Version 1.1.0
 */
/*
 * Version 1.1.1 (13-APR-2015)
 *
 *   - Use the Highcharts 4.1.3
 *   - Add 'auto' parameter for widht/height converted to undefined for Highcharts
 *
 * Version 1.1.0 (17-OCT-2014)
 *
 *  - Use the Highcharts 4.0.4
 *  - Disable exportation by default
 *  - Disable credits by default
 *
 * Version 1.0.3 (15-MAY-2012)
 *
 *  - Use the data as string or plain object
 *
 * Version 1.0.2 (06-JUL-2011)
 *
 *  - Add compatibility with the new JSON output (with the shortcut/entry code in the series/categories)
 *  - Code validates with the jsHint
 *  - Change the round method
 *
 * Version 1.0.1 (13-APR-2011)
 *
 * - Add new events to update the chart data
 * - Make the methods to format data public: formatData and formatPieData are now available in the askiaVista.highcharts namespace
 * - Code validates with the new jsLint Edition 2011-02-28
 *
 * Version 1.0.0 (07-DEC-2010)
 *
 * - Generate chart using the Highcharts API<
 * - Manage the themes library
 * - Manage the templates library
 * - Code validates with jsLint
 */

(function ($, askiaVista) {
    "use strict";

    //  Validates the presence of askiaVista
    if (!askiaVista) {
        alert("AskiaVista AJAX script was not found!\r\nPlease add it into the document OR add the current plugin script ('askiavista.chart.highcharts') after AskiaVista.");
        return;
    }

    /**
     * # AskiaVista to Highcharts plugin - Documentation
     *
     * This plugin allows the generation of [Highcharts](http://www.highcharts.com) chart using AskiaVista data.
     *
     * It extend the AskiaVista framework with a new `highcharts` namespace
     * and automate the the generation of charts within the askiaVista.display() or askiaVista.getPages() methods.
     *
     * ## Plugin details:
     *
     * * **Name:**  Highcharts
     * * **Category:** chart
     * * **Dependencies:** Highcharts.js [http://www.highcharts.com](http://www.highcharts.com)
     *
     * ## Setup
     *
     * Include both the Highcharts library and the current plugin in your page:
     *
     *     <script type="text/javascript" src="http://localhost/AskiaVistaReader.Net4/Scripts/Highcharts/Highcharts.js"></script>
     *     <script type="text/javascript" src="http://localhost/AskiaVistaReader.Net4/Scripts/askiavista.chart.highcharts.js"></script>
     *
     * ## Usage
     *
     * In order to produce chart, the askiaVista.display() or askiaVista.getPages() methods automatically use
     * the `chart`.
     *
     * When that key is an object you may first specify the name of the plugin to use, in that case only 'Highcharts'
     * Then you can pass as many options you want under the 'options' section:
     *
     *       askiaVista.display({
     *         survey : "EX",
     *         rows : "i2. Age",
     *         columns : "i1. Gender",
     *         chart : {
     *            name : "Highcharts",
     *            options : {
     *               chartType : 'bar'
     *            }
     *         }
     *       });
     *
     *
     * @class Plugins.chart.highcharts
     */
    var that = {
            name : "Highcharts",
            category : "chart",
            version : "1.1.1",
            date : "13-APR-2015",
            author : "Askia",
            description : "This plugin allows you to generate chart using the \"Highcharts\" library: http://www.highcharts.com/.",
            website : "http://www.highcharts.com/",
            helpUrl : "https://dev.askia.com/projects/askiavista-sdk/wiki/AskiaVista_AJAX_Plugins_HighCharts",
            dependencies : [
                {name : "askiaVista", version : ">=2.0.2"},
                {name : "Highcharts.Themes", require : false},
                function () {
                    if (!window.Highcharts) {
                        return "     - Missing dependency 'Highcharts' for the plugin '" + that.name + "'";
                    }
                }
            ]
        },

        //  askiaVista.Highcharts namespace
        highchartsNamespace = (function () {

            // Collection of available themes
            var themes = {},

            // Collection of available layouts
                layouts = {};


            /*
             * @name addTheme
             * @memberOf askiaVista.highcharts
             * @function
             * @description
             * <p>Add theme in collection.<br />
             * The theme indicates the visual style of chart (colors, background, font ...)</p>
             * @param {String} name Name of theme.
             * @param {Object} theme Definition of the theme
             */
            function addTheme(name, theme) {
                if (typeof (name) !== "string" || !$.isPlainObject(theme)) {
                    return;
                }
                themes[name] = theme;
            }


            /*
             * @name addLayout
             * @memberOf askiaVista.highcharts
             * @function
             * @description
             * <p>Add layout in collection.<br />
             * Indicates the layout of the chart (position, legend ...)</p>
             * @param {String} name Name of layout
             * @param {Object} layout Definition of the layout
             */
            function addLayout(name, layout) {
                if (typeof (name) !== "string" || !$.isPlainObject(layout)) {
                    return;
                }
                layouts[name] = layout;
            }


            /*
             * @name round
             * @memberOf askiaVista.highcharts
             * @function
             * @private
             * @description
             * Helper method to round the number with 2 digits
             * @param {Number} d Number to round
             * @returns {Number} Round number with 2 digits
             */
            function round(d) {
                return Math.round(parseFloat(d) * 100) / 100;
            }

            /*
             * @name updateSerie
             * @memberOf askiaVista.highcharts
             * @event
             * @description
             * This event allow developers to customize a serie.
             * @param {Object} serie  Serie intended to add in the chart data.
             * @param {String} serie.name Name of the serie
             * @param {Array} serie.data Data in the serie
             * @param {Number} index Index of the serie (based 0)
             * @param {Object|Array} data  Original data converted in JSON
             * @param {Object} options Chart options to keep the context
             * @param {Object} query Original query to keep the context
             * @example
             * askiaVista.display({
			 * // ... survey, containerId, and the cross-tab definition goes here
			 *   chart : {
			 *      name : "Highcharts",
			 *      options : {
			 *         updateSerie : function (serie, index, data, options, query) {
			 *              // Change the name of the serie
			 *              serie.name = "My custom name";
			 *              // Change the type of the first serie to produce a combination chart with columns (by default) and spline
			 *              if (index === 0) {
			 *                  serie.type = "spline";
			 *              }
			 *          }
			 *      }
			 *   }
			 * });
             */
            function formatSerie(serie, index, data, options, query) {
                if (options && options.updateSerie && typeof (options.updateSerie) === "function") {
                    var clone = $.extend(true, {}, serie);
                    options.updateSerie(clone, index, data, options, query);
                    // Make sure that the updated serie have a correct format
                    if (clone.name && typeof (clone.name) === "string" && clone.data && clone.data.join && typeof (clone.data.join) === "function") {
                        return clone;
                    }
                }

                return serie;
            }

            /*
             * @name updateCategory
             * @memberOf askiaVista.highcharts
             * @event
             * @description
             * This event allow developers to customize the category.
             * @param {Object} category Category to update
             * @param {Number} index Index of the category (based 0)
             * @param {Object|Array} data  Original data converted to JSON
             * @param {Object} options Chart options to keep the context
             * @param {Object} query Original query to keep the context
             * @example
             * askiaVista.display({
			 * // ... survey, containerId, and the cross-tab definition goes here
			 *   chart : {
			 *      name : "Highcharts",
			 *      options : {
			 *         updateCategory : function (category, index, data, options, query) {
			 *              // Change the name of the category
			 *              category.name = "My custom name";
			 *          }
			 *      }
			 *   }
			 * });
             */
            function formatCategory(category, index, data, options, query) {
                if (options && options.updateCategory && typeof (options.updateCategory) === "function") {
                    var clone = $.extend(true, {}, category);

                    options.updateCategory(clone, index, data, options, query);
                    // Make sure that the updated category have a correct format
                    if (clone.name && typeof (clone.name) === "string") {
                        return clone;
                    }
                }

                return category;
            }


            /*
             * @name updateDataSerie
             * @memberOf askiaVista.highcharts
             * @event
             * @description
             * This event allow developers to customize the data of series.
             * @param {Object} arg Hash with the definition of data to add
             * @param {Object} arg.serie Object which indicates the index and the serie of data
             * @param {Number} arg.serie.index Index of serie based 0
             * @param {Object} arg.serie.serie Serie of data (see updateSerie event for more details)
             * @param {Object} arg.category Object which indicates the index and the category of data
             * @param {Number} arg.category.index Index of category based 0
             * @param {Object} arg.category.category Category of data (see updateCategory event for more details)
             * @param {Number} arg.data Data value
             * @param {Object|Array} data  Original data converted to JSON
             * @param {Object} options Chart options to keep the context
             * @param {Object} query Original query to keep the context
             * @return {Number} Valid number to use as value of the data serie/category
             * @example
             * askiaVista.display({
			 *   // ... survey, containerId, and the cross-tab definition goes here
			 *   chart : {
			 *      name : "Highcharts",
			 *      options : {
			 *          updateDataSerie : function (arg, data, options, query) {
			 *              // Round with one digit in the first serie of the first category
			 *              if (arg.serie.index === 0 && arg.category.index === 0) {
			 *                  return round(arg.data, 1);
			 *              }
			 *              return undefined; // Use the default behaviour
			 *           }
			 *      }
			 *   }
			 * });
             */
            function formatDataSerie(arg, data, options, query) {
                if (options && options.updateDataSerie && typeof (options.updateDataSerie) === "function") {
                    var newNumber = options.updateDataSerie(arg, data, options, query);
                    // Make sure that the value returned is a string
                    if (!isNaN(newNumber)) {
                        return newNumber;
                    }
                }

                // Default behaviour
                return round(arg.data);
            }

            /*
             * @name updateChartData
             * @memberOf askiaVista.highcharts
             * @event
             * @description
             * This event allow developers to customize the fully customize data of chart just before usage.<br />
             * That's latest point for the chart data customization.
             * @param {Object} chartData Chart data to update. (after all formatting)
             * @param {Array} chartData.series Collection of series
             * @param {Array} chartData.categories Collection of categories
             * @param {Object|Array} data  Original data converted to JSON
             * @param {Object} options Chart options to keep the context
             * @param {Object} query Original query to keep the context
             * @return {Object} New chart data object
             * @example
             * askiaVista.display({
			 *     // ... survey, containerId, and the cross-tab definition goes here
			 *     chart : {
			 *        name : "Highcharts",
			 *        options : {
			 *           updateChartData : function (chartData, data, options, query) {
			 *               // Append a new category with some external data
			 *               chartData.categories.push("Total");
			 *
			 *              // Append the data in each series for the "Total" category
			 *              var i, l, j, k, total;
			 *              for (i = 0, l = chartData.series.length; i < l; i += 1) {
			 *                  total = 0;
			 *                  // Calculates the total for the serie
			 *                  for (j = 0, k = chartData.series[i].data.length; j < k; j += 1) {
			 *                      total += chartData.series[i].data[j];
			 *                  }
			 *                  chartData.series[i].data.push(total);
			 *               }
			 *
			 *              // Append a new serie with some external data, and display it as a spline
			 *              chartData.series.push({
			 *                  name : "My external serie name",
			 *                  data : [12, 13, 14, 15, 54],
			 *                  type : "spline"
			 *              });
			 *          }
			 *       }
			 *    }
			 * });
             */
            function formatChartData(chartData, data, options, query) {
                if (options && options.updateChartData && typeof (options.updateChartData) === "function") {
                    var clone = $.extend(true, {}, chartData);
                    options.updateChartData(clone, data, options, query);
                    // Make sure that the updated chartData have a correct format, this is a summary verification (series and categories should be an array)
                    if (clone.series && clone.series.join && typeof (clone.series.join) === "function" &&
                        clone.categories && clone.categories.join && typeof (clone.categories.join) === "function") {
                        return clone;
                    }
                }

                return chartData;
            }

            /*
             * @name formatData
             * @memberOf askiaVista.highcharts
             * @function
             * @description
             * Method to format the cross-tab data to the Highcharts chart data.
             * @param {String} data JSON string which represent the AskiaVista data
             * @param {Object} query Original query to keep the context
             * @returns {Object} Highcharts data
             * @example
             * // Example of return values
             * {
			 *		titles : {
			 *			main : "Age x Gender",
			 *			rows : "Age",
			 *			columns : "Gender"
			 *		},
			 *		categories : ["Man", "Woman"],
			 *		series : [
			 *					{name : "25-34", data : [12.5, 15.14]},
			 *					{name : "35-50", data : [56.4, 12.5]}
			 *		]
			 * }
             * @see askiaVista.highcharts.formatPieData
             */
            function getFormattedData(data, options, query) {

                // Data as object
                data = (typeof data === 'string') ? JSON.parse(data)[0] : data[0];

                var i, j, l, k,
                    cloneData = $.extend(true, {}, data),
                    chartData = cloneData,
                    cat,
                    y,
                    inverseData = {
                        series : [],
                        categories : []
                    };

                // Inverse the categories and the series to keep the consistence between chart engines.
                for (i = 0, l = chartData.categories.length; i < l; i += 1) {
                    inverseData.series.push(formatSerie({
                        name : chartData.categories[i].name,
                        shortcut : chartData.categories[i].shortcut,
                        entryCode : chartData.categories[i].entryCode,
                        data : []
                    }, i, chartData, options, query));
                }
                for (i = 0, l = chartData.series.length; i < l; i += 1) {
                    cat = formatCategory(chartData.series[i], i, chartData, options, query);
                    inverseData.categories.push(cat.name);

                    for (j = 0, k = chartData.series[i].data.length; j < k; j += 1) {
                        y = formatDataSerie({
                            serie : {
                                index : j,
                                serie : inverseData.series[j]
                            },
                            category : {
                                index : i,
                                category : cat
                            },
                            data : chartData.series[i].data[j]
                        }, chartData, options, query);

                        inverseData.series[j].data.push({
                            shortcut : cat.shortcut,
                            entryCode : cat.entryCode,
                            name : cat.name,
                            y : y
                        });
                    }
                }

                chartData.series = inverseData.series;
                chartData.categories = inverseData.categories;
                return formatChartData(chartData, cloneData, options, query);
            }

            /*
             * @name formatPieData
             * @memberOf askiaVista.highcharts
             * @function
             * @description
             * Same as the askiaVista.highcharts.formatData but format the data for the pie chart. (The pie chart don't deals with the categories, only series).
             * @param {Object} chartData Chart data already formatted using the getFormattedData
             * @param {Object} query Original query to keep the context
             * @returns {Object} Returns the updated chartData with the new series
             * @see askiaVista.highcharts.formatData
             */
            function adjustPieData(chartData, options, query) {
                var i, j, k, l,
                    color = 0,
                    series = [],
                    colors = [],
                    innerSizeFactor = parseInt(90 / (chartData.series.length + 1), 10),
                    serie, data,
                    chartDataClone = $.extend(true, {}, chartData);

                // Get the colors of series
                if (options.theme && themes[options.theme] && themes[options.theme].colors) {
                    colors = themes[options.theme].colors;
                }
                if (!colors.length || colors.length === 0) {
                    colors = ['#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE', '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92'];
                }

                for (i = 0, l = chartData.series.length; i < l; i += 1) {
                    // Create data for the serie
                    data = [];
                    color = 0;
                    for (j = 0, k = chartData.categories.length; j < k; j += 1) {
                        chartData.series[i].data[j].color = colors[color];
                        data.push(chartData.series[i].data[j]);
                        color += 1;
                        if (color >= colors.length) {
                            color = 0;
                        }
                    }

                    // Create the serie
                    serie = $.extend(true, {}, chartData.series[i]);
                    serie.data = data;


                    // Multiple pie series
                    if (chartData.series.length > 1) {
                        serie.innerSize = (80 - (innerSizeFactor * (i + 1))) + '%';
                        if (i > 0) {
                            serie.size = (80 - (innerSizeFactor * i)) + '%';
                        }
                    }
                    series.push(serie);
                }
                chartDataClone.series = series; // Update and returns the clone instead of the real chartData object
                return chartDataClone;
            }


            /*
             * @name getChartDefinition
             * @memberOf askiaVista.highcharts
             * @function
             * @private
             * @description
             * Get the definition of the chart
             * @param {String} chartType Defines the default type of the series (column, bar, pie...)
             * @param {Object} chartData JSON object with the chart data
             * @param {Object} query Initial query pass to do the cross-tab. It used to keep the context and update it
             * @param {String} theme Name of the theme to use
             * @param {String} layout Name of the layout to use
             * @returns {Object} Highcharts chart definition
             */
            function getChartDefinition(chartType, chartData, query, theme, layout) {

                /*
                 * Format the tooltip text
                 * @private
                 * @returns {String} Text to display in the tooltip
                 */
                function tooltipFormatter(obj) {
                    if (chartType === "pie" || obj.point.name) {
                        if (chartData.series.length > 1) {
                            return '<strong>' + obj.series.name  + '</strong><br />' + obj.point.name + ': ' + obj.y;
                        }
                        return obj.point.name + ': ' + obj.y;
                    }
                    return obj.x + ': ' + obj.y;
                }

                /*
                 * Fire when the user click on serie
                 * This method fire the 'click' event of the 'query' object
                 * @private
                 */
                function selectHandler(obj) {
                    var selections = [];
                    selections.push({
                        column : {
                            shortcut : obj.series.options.shortcut,
                            entryCode : obj.series.options.entryCode,
                            caption : obj.series.name
                        },
                        row : {
                            shortcut : obj.options.shortcut,
                            entryCode : obj.options.entryCode,
                            caption : obj.category || obj.name
                        },
                        value : obj.y
                    });

                    // Fire the event in AskiaVista
                    if (query.click && typeof (query.click) === "function") {
                        query.click(selections, query);
                    }
                }


                /*
                 * Get the default part of chart definition (column, bar, line...)
                 * @private
                 * @returns {Object} Highcharts definition part with xAxis, yAxis, plotOptions and series
                 */
                function getDefaultChartDefinition() {
                    return {
                        xAxis : {
                            categories : chartData.categories,
                            title : {
                                text : chartData.titles.rows
                            }
                        },

                        yAxis : {
                            min : 0,
                            title : {
                                text : chartData.titles.columns
                            }
                        },
                        plotOptions :  {
                            column : {
                                pointPadding : 0.2,
                                borderWidth : 0
                            }
                        },

                        series : chartData.series
                    };
                }

                /*
                 * Get the formatted data series for the pie chart
                 * The pie chart only use series and not categories
                 * @private
                 * @returns {Object} JSON object with formatted series for the pie chart
                 */
                function getSeriesForPie() {
                    var updatedChartData = adjustPieData(chartData, {theme : theme, layout : layout}, query);

                    /* Make the slice effect (only for pie) */
                    if (updatedChartData.series.length === 1 && updatedChartData.series[0].data.length > 1) {
                        updatedChartData.series[0].data[0].sliced = true;
                        updatedChartData.series[0].data[0].selected = true;
                    }

                    return updatedChartData.series;
                }

                /*
                 * Get the pie chart definition part for Highcharts
                 * @private
                 * @returns {Object} Highcharts definition part with the 'pie' plotOptions and series
                 */
                function getPieChartDefinition() {
                    return {
                        plotOptions : {
                            pie : {
                                allowPointSelect : (chartData.series.length === 1),
                                cursor : "pointer",
                                dataLabels : {
                                    enabled: true,
                                    formatter : function () {
                                        return '<strong>' + this.point.name + '</strong>: ' + this.y;
                                    }
                                }
                            }
                        },

                        series : getSeriesForPie()
                    };
                }


                /*
                 * Creates the common part of the Highcharts definition
                 * @private
                 */
                var chartDef = {
                    chart : {
                        renderTo : query.containerId,
                        defaultSeriesType : chartType,
                        width : (query.width === 'auto') ? undefined : (query.width || 620),
                        height : (query.height === 'auto') ? undefined : (query.height || 400)
                    },
                    exporting : {
                        enabled : false
                    },
                    credits : {
                        enabled : false
                    },
                    title : {
                        text : chartData.titles.main
                    },
                    plotOptions : {
                        series : {
                            cursor: 'pointer',
                            point: {
                                events: {
                                    click: function () {
                                        return selectHandler(this);
                                    }
                                }
                            }
                        }
                    },
                    tooltip: {
                        formatter : function () {
                            return tooltipFormatter(this);
                        }
                    }
                };

                /*
                 * Add the specific part of definition according to the chart type
                 * @private
                 */
                if (chartType === "pie") {
                    $.extend(true, chartDef, getPieChartDefinition());
                } else {
                    $.extend(true, chartDef, getDefaultChartDefinition());
                }

                // Apply the theme
                if (theme && themes[theme]) {
                    $.extend(true, chartDef, themes[theme]);
                }

                // Apply the layout
                if (layout && layouts[layout]) {
                    $.extend(true, chartDef, layouts[layout]);
                }

                // Returns the final chart definition
                return chartDef;
            }


            /**
             * Draw a chart using data of a cross-tab query (askiaVista.display() or askiaVista.getPages())
             *
             * This method is automatically called in the implicit `success` callback of the method askiaVista.display()
             * or askiaVista.getPages()
             *
             * AskiaVista uses the query.chart.options as the `options` parameter of the `draw` method.
             *
             *     // Basic usage
             *     askiaVista.display({
             *          survey : "EX",
             *          rows   : "gender",
             *          columns : "age",
             *          containerId : "chart_container",
             *          chart  : {
             *              name  : "Highcharts",
             *              options : {
             *                  chartType : "bar"
             *              }
             *          }
             *     });
             *
             *     // Same as
             *     askiaVista.display({
             *          survey : "EX",
             *          rows   : "gender",
             *          columns : "age",
             *          containerId : "chart_container",
             *          chart  : {
             *              name  : "Highcharts",
             *              options : {
             *                  chartType : "bar"
             *              }
             *          },
             *          success : function (data, query) {
             *              askiaVista.highcharts.draw(data, query.chart.options, query);
             *          }
             *     });
             *
             * @member Plugins.chart.highcharts
             * @method draw
             * @param {String|askiaVista.data.xTab} data Cross-tab data
             * @param {Object} [options] Options of the chart, it could be one of the predefined plugin options or options from the Highcharts library
             * @param {String} [options.chartType='columns'] Default chart type to use. For the list of possible chart type please refer to the [Highcharts documentation](http://api.highcharts.com/highcharts#chart.type)
             * @param {String} [options.theme=''] Name of a predefined theme to use (series, color, background, font...) (see askiavista.highcharts.themes plugins)
             * @param {String} [options.layout=''] Name of a predefined layout to use (number format, legend, position)  (see askiavista.highcharts.themes plugins)
             *
             * @param {Function} [options.updateSerie] Callback to format a serie (One call for each serie).
             * It allow to change the definition of the serie.
             * @param {Object} [options.updateSerie.serie] Serie to add in the chart data.
             * It's passed by reference, so any modification in the callback function will impact the original serie object.
             * The classical format of the serie is: {name : "Name of the serie", data : []}
             * The data array inside the serie is empty at this stage
             * @param {Number} [options.updateSerie.index] Index of the serie (based 0)
             * @param {askiaVista.data.xTab} [options.updateSerie.data] Original data for the context
             * @param {Object} [options.updateSerie.options] Original options for the context
             * @param {askiaVista.queries.xTab} [options.updateSerie.query] Original cross-tab query for the context
             *
             * @param {Function} [options.updateCategory] Callback to format a category (Once call for each category).
             * It allow to change the definition of the category.
             * @param {String} [options.updateCategory.name] Name of the category
             * @param {Number} [options.updateCategory.index] Index of the category (based 0)
             * @param {askiaVista.data.xTab} [options.updateCategory.data] Original data for the context
             * @param {Object} [options.updateCategory.options] Original options for the context
             * @param {askiaVista.queries.xTab} [options.updateCategory.query] Original cross-tab query for the context
             * @param {String} [options.updateCategory.return] This callback should return the new category name or nothing to use the default.
             *
             * @param {Function} [options.updateDataSerie] Callback to format the data in series/categories (One call for each datapoint)
             * It allow to change the definition of the data.
             * @param {Object} [options.updateDataSerie.def] Definition of the current data.
             * The object contains the following keys (write in meta for convenience)
             * serie : {index, serie}		// index of the serie, serie object (see the updateSerie for more details)
             * category : {index, name}	    // index of the category, name of the category
             * data : Number				// data
             * @param {askiaVista.data.xTab} [options.updateDataSerie.data] Original data for the context
             * @param {Object} [options.updateDataSerie.options] Original options for the context
             * @param {askiaVista.queries.xTab} [options.updateDataSerie.query] Original cross-tab query for the context
             * @param {Number} [options.updateDataSerie.return] This callback should return the new value to use or nothing to use the default.
             *
             * @param {Function} [options.updateChartData] Callback trigger just before to assign the data to the chart (Call only one time)
             * It allow to change entire definition of the data before usage.
             * @param {Object} [options.updateChartData.chartData] Data to use in chart
             * It's passed by reference so any modification in that callback function will impact the original chartData object.
             * The chartData looks like that: { series : [ Collection of series  ], categories : [ Collection of categories ]}
             * @param {askiaVista.data.xTab} [options.updateChartData.data] Original data for the context
             * @param {Object} [options.updateChartData.options] Original options for the context
             * @param {askiaVista.queries.xTab} [options.updateChartData.query] Original cross-tab query for the context
             *
             * @param {askiaVista.queries.xTab} query Cross-tab query that produce the data
             * @param {Number|String|'auto'} [query.width] Width of the chart
             * @param {Number|String|'auto'} [query.height] Height of the chart
             */
            function draw(data, options, query) {
                //  Validates the presence of the Highcharts library
                if (!window.Highcharts) {
                    if (query.error && query.error === "function") {
                        query.error("Missing 'Highcharts' object. Please include the 'Highcharts' core engine in the document", query);
                    }
                    return;
                }

                var
                /* Init the chart type */
                    chartType = (options) ? (options.chartType || "column") : "column",

                /* Init the theme */
                    theme = (options) ? (options.theme || false) : false,

                /* Init the layout */
                    layout = (options) ? (options.layout || false) : false,

                /* Data of chart */
                    chartData = getFormattedData(data, options, query),

                /* Init the layout */

                /* Creates the chart definition */
                    chartDef = getChartDefinition(chartType, chartData, query, theme, layout),

                /* Draw chart */
                    chart = new Highcharts.Chart($.extend(true, chartDef, options));

                /* Attach chart on the query for a future usage (update the context) */
                query.chart.object = chart;
            }


            // Public interface
            return {
                addTheme : addTheme,
                addLayout : addLayout,
                formatData : function (data, query) {
                    var options = {};
                    if (query && query.chart && query.chart.options) {
                        options = query.chart.options;
                    }
                    return getFormattedData(data, options, query);
                },
                formatPieData : function (data, query) {
                    var options = {};
                    if (query && query.chart && query.chart.options) {
                        options = query.chart.options;
                    }
                    // Chain 2 actions: format the data first and then adjust it for the pie chart
                    return adjustPieData(getFormattedData(data, options, query), options, query);
                },
                draw : draw
            };


        }());


    //  Add the method draw in the plugin to be accessible by AskiaVista core engine
    that.draw = highchartsNamespace.draw;

    // Method to initialize the plugin
    that.init = function () {

        // Extend askiaVista with the 'highcharts' namespace
        askiaVista.extend({
            highcharts : highchartsNamespace
        });
    };

     // Add the plugin in askiaVista
    askiaVista.addPlugin(that);

}(jQuery, askiaVista));
