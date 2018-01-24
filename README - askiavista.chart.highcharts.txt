=======================================================================================================================
AskiaVista Chart Highcharts
=======================================================================================================================


CHANGELOG
  Version 1.0.0 (07-DEC-2010)
 		+ Generate chart using the Highcharts API
 		+ Manage the themes library
 		+ Manage the templates library
 		+ Code validates with jsLint

	Version 1.0.1 (14-APR-2011)
 		+ Add new events to update the chart data
 		+ Make the methods to format data public: formatData and formatPieData are now available in the askiaVista.highcharts namespace
 		+ Code validates with the new jsLint Edition 2011-02-28

DESCRIPTION

	Since the version 2.01 of AskiaVista AJAX, this plugin allows you to generate chart using the Highcharts library.
	http://www.highcharts.com/

	This plugin extend the AskiaVista AJAX core with the 'highcharts' namespace and automatically handle queries to generate charts.

SYNOPSIS

	The chart plugin automatically handles the success event of the 'display' queries in order to generate a chart.
	This is possible using the 'chart' key of the 'display' queries.
	
	- chart {String|Number|Object}
		
		+ When the value is a string or number, it indicates the default AskiaVista chart engine (Dundas or Nevron)

		/**
		 * Generate a chart image in a server side, using the default AskiaVista chart engine (Dundas or Nevron)
		 */
		askiaVista.display({
			survey : "EX",
			rows : "i2. Age",
			columns : "i1. Gender",
			chart : "01 - Standard - 2D Column"
		});

		+ When the value is a javascript object, it indicates a Javascript chart plugin and the options to generate the chart.
		  The 'chart' object can contain the following keys:
		  +-------------+-----------------------------------------------------------------------------------+
		  |Key			|Description																		|
		  +-------------+-----------------------------------------------------------------------------------+
		  |name			|Name of the plugin to use in order to generate the chart.							|
		  |				|AskiaVista AJAX will automatically set the 'format' of the query to JSON and		|
		  |				|will use the 'draw()' method of the plugin to generates the chart					|
		  +-------------+-----------------------------------------------------------------------------------+
		  |[options]	|(Optional) The options is a variable (string, number, array, function or usually	|
		  |				|an object) used by the chart plugin.												|
		  |				|The 'options' depends on the chart engine.											|		  
		  +-------------+-----------------------------------------------------------------------------------+

		/**
		 * Generate a chart using a javascript plugin
		 */
		askiaVista.display({
			 survey : "EX",
			 rows : "i2. Age",
			 columns : "i1. Gender",
			 chart : {
				name : "Name of the chart plugin",
				options : { /* Options of the chart plugin */ }
			 }
		});

SETUP

	Declare the Highcharts library and the askiavista.chart.highcharts plugin using the following lines:

		<script type="text/javascript" src="http://localhost/AskiaVistaReader/Scripts/Highcharts/highcharts.js"></script>
		<script type="text/javascript" src="http://localhost/AskiaVistaReader/Scripts/askiavista.chart.highcharts.js"></script>

USAGE
	
	+ BASIC

	To generate a chart using Highcharts, you only need to indicate the name "Highcharts" in the chart key.

		/**
		 * Generate a column chart using Highcharts library
		 */
		askiaVista.display({
			survey : "EX",
			rows : "i2. Age",
			columns : "i1. Gender",
			chart : {name : "Highcharts"}
		});


	+ OPTIONS

	The 'options' key allow you to fully customize the parameters passed to Highcharts
	Please refer to the Highcharts documentation to know the exact options allowed for a given chart.
		http://www.highcharts.com/ref/

	In addition of the options specific to Highcharts, the plugin allow you to specify some custom options:
	
		- chartType {String} (column by default)
			Indicates the default type of the chart for all series. 		
			Please find below a non-hexaustive list of the available values:

			column		http://www.highcharts.com/demo/?example=column-basic&theme=default
			area		http://www.highcharts.com/demo/?example=area-basic&theme=default
			bar			http://www.highcharts.com/demo/?example=bar-basic&theme=default
			pie			http://www.highcharts.com/demo/?example=pie-basic&theme=default
			line		http://www.highcharts.com/demo/?example=line-basic&theme=default

		- theme {String}
			Indicates the theme (series, color, background, font...) of the chart.
			AskiaVista Highcharts plugin is providing with some themes stored in askiavista.chart.highcharts.themes.js
			Below the list of available themes:
			(All themes was created by Highcharts, we only have customize some options and do the integration)

			initialTheme
			grid
			skies
			gray
			dark-blue
			dark-green

		- layout {string}
			Indicates the layout (number format, legend, position) of the chart.
			AskiaVista Highchart plugin is providing with the 'pieWithLegend' layout stored in askiavista.chart.highcharts.themes.js

		- updateSerie {function}
			Events fire during the formatting of a serie. (Once per serie)
			It allow you to change the definition of the serie.
			See the events section below for more details.

		- updateCategory {function}
			Events fire during the formatting of a category. (Once per category)
			It allow you to change the definition of the category.
			See the events section below for more details.

		- updateDataSerie {function}
			Events fire during the formatting of a data in series. (Once per data in a given serie/category)
			It allow you to change the definition of the data.
			See the events section below for more details.

		- updateChartData {function}
			Events fire before to assign chart data to the Highcharts engine. (Once)
			It allow you to change the definition of the chart data before usage.
			See the events section below for more details
					
		- Example
			
			/**
			 * Display a pie chart with legend and the dark-green theme
			 */
			askiaVista.display({
				survey : "EX",
				rows : "i2. Age",
				columns : "i1. Gender",
				chart : {
					name : "Highcharts",
					options : {
						chartType : "pie",
						theme : "dark-green",
						layout : "pieWithLegend"
					}
				}
			});

	+ HIGHCHARTS NAMESPACE

	The AskiaVista Highcharts plugin give you an easy way to register your own themes and layouts.
	The plugin add a namespace named 'highcharts' in the AskiaVista AJAX core (askiaVista.highcharts)
	This extra 'highcharts' namespace has the following methods:
		
		- draw (data, options, query)
			Method to draw an Highcharts chart using the AskiaVista data.
			@ data {String}
				Data from the 'display' query (JSON string)
			@ options {Object}
				Options to build the chart (see the above description)
			@ query {Object}
				Original query used to generate the data

		- addTheme (name, theme)
			Method to register a new Highcharts theme. Used in the 'theme' key of 'options'. (see the above section)
			@ name {String}
				Name of the theme.
			@ theme {Object}
				Plain object with the Highcharts theme definition.

		- addLayout (name, layout)
			Method to register a new layout. Used in the 'layout' key of 'options'. (see the above section)
			@ name {String}
				Name of the layout.
			@ layout {Object}
				Plain object with the Highcharts layout definition.

		- formatData (data, query)
			Method to format the cross-tab data to the Highcharts chart data.
			@ data {String}
				Data from the 'display' query (JSON string)
			@ query {Object}
				Original query used to generate the data

		- formatPieData (data, query)
			Same as the formatData but format the data for the pie chart. (The pie chart don't deals with the categories, only series).
			

	+ EVENTS

	The Highcharts create interactive chart, that means the user can interact with it.
	The plugin allows you to catch the clicks on the chart and then write the logic according to the value selected.

		askiaVista.display({
			survey : "EX",
			rows : "i2. Age",
			columns : "i1. Gender",
			chart : {
				name : "Highcharts"
			},
			click : function (selections, query) {
				/* You own code logic */
			}
		});

	The click event is fire with some arguments:
		
		- selections {Array}
			Indicates the selected values. It contains objects with the following structure:
				
				{
					column : "Label of selected response in column",
					row	: "Label of selected response in row",
					value : value_of_cell
				}
			NOTA: Most of the time the array only contains one item. (selections[0])

		- query {Object}
			Original query used to generate the chart (used to keep the context)
			The query will be updated with the native chart object:

				query.chart.object = native_highcharts_object


		- Example

		/**
		 * Display a highcharts chart 
		 * Change the background of the page according to the selected column (man = blue, female = pink)
		 */
		askiaVista.display({
			survey : "EX",
			rows : "i2. Age",
			columns : "i1. Gender",
			chart : {
				name : "Highcharts"
			},
			click : function (selections, query) {
				if (!selections || !selections.length) {
					return;
				}
				var color = (selections[0].column === "man") ? "blue" : "pink";
				$(body).css({"background-color" : color}); 
			}
		});

	In addition of the UI events, since the version 1.0.1 of the plugin, it's also possible to interact with chart during his creation phase.
	You can catch some internal events during the creation phase, with the key @options@.
	Below the list and the description for each internal events:

		- updateSerie (serie, index, data, options, query)
			Allow you to customize a serie.
			 @ serie {Object}
				Serie to add in the chart data.
				It's passed by reference so modification of it inside the function will impact the original serie object.
				The clasical format of the serie is:
				{name : "Name of the serie", data : []} 
				The data array inside the serie is empty at this stage
			 @ index {Number} 
				Index of the serie based 0.
			 @ data {Object|Array}
				Original data converted to the Javascript object (JSON)
			 @ options {Object}
				Chart options, this is the @options@ key passed to the display() method
			 @ query {Object}
				Original query used to generate the data
			 
			Example:
			askiaVista.display({
				// ... survey, containerId, and the cross-tab definition goes here
				chart : {
					name : "Highcharts",
					options : {
						updateSerie : function (serie, index, data, options, query) {
							// Change the name of the serie
			 				serie.name = "My custom name";
			 				// Change the type of the first serie to produce a combination chart with columns (by default) and spline
			 				if (index === 0) {
			 					serie.type = "spline";
			 				}
						}
					}
				}
			});
		
		- updateCategory (name, index, data, options, query)
			Allow you to customize the category.
			 @ name {String} 
				Name of the category
			 @ index {Number}
				Index of the category based 0.
			 @ data {Object|Array}
				Original data converted to the Javascript object (JSON)
			 @ options {Object}
				Chart options, this is the @options@ key passed to the display() method
			 @ query {Object}
				Original query used to generate the data
			 This method should return a string, which will be use as the name of the category.
			 If the method return an invalid string or undefined or null, then the default category name will be used.
			 
			 Example:
			 askiaVista.display({
				// ... survey, containerId, and the cross-tab definition goes here
				chart : {
					name : "Highcharts",
					options : {
			 			updateCategory : function (name, index, data, options, query) {
			 				// Change the name of the category
			 				return "My custom name";
			 			}
					}
				}
			});
			  
		- updateDataSerie (arg, data, options, query)
			Allow you to customize the data of series.
			 @ arg {Object}
				Hash with the definition of the data.
				The hash contains the following keys (write in meta for convenience)
				serie : {index, serie}		// index of the serie, serie object (see the updateSerie for more details)
				category : {index, name}	// index of the category, name of the category
				data : Number				// data 
			 @ data {Object|Array}
				Original data converted to the Javascript object (JSON)
			 @ options {Object}
				Chart options, this is the @options@ key passed to the display() method
			 @ query {Object}
				Original query used to generate the data
			This method should return a valid number for the data, otherwise the default data will be used.
			 
			 Example:
			 askiaVista.display({
				// ... survey, containerId, and the cross-tab definition goes here
				chart : {
					name : "Highcharts",
					options : {
			 			updateDataSerie : function (arg, data, options, query) {
			 				// Round with one digit in the first serie of the first category
			 				if (arg.serie.index === 0 && arg.category.index === 0) {
			 					return round(arg.data, 1);
			 				}
			 				return undefined; // Use the default behaviour
			 			}
					}
				}
			 });
			 
		- updateChartData (chartData, data, options, query)
			Allow you to customize the entire chart data before usage.
			That's ultime point for the chart data customization.
			 @ chartData {Object}
				Chart data after all formatting.
				It's passed by reference so modification of it inside the function will impact the original chartData object.
				The chartData looks like that:
				{ series : [/* Collection of series */ ], categories : [/* Collection of categories */]}
			 @ data {Object|Array}
				Original data converted to the Javascript object (JSON)
			 @ options {Object}
				Chart options, this is the @options@ key passed to the display() method
			 @ query {Object}
				Original query used to generate the data
			
			Example:
			 askiaVista.display({
				// ... survey, containerId, and the cross-tab definition goes here
				chart : {
					name : "Highcharts",
					options : {
			 			updateChartData : function (chartData, data, options, query) {
			 				// Append a new category with some external data
			 				chartData.categories.push("Total");
			 				
			 				// Append the data in each series for the "Total" category
			 				var i, l, j, k, total;
			 				for (i = 0, l = chartData.series.length; i < l; i += 1) {
			 					total = 0;
			 					// Calculates the total for the serie
			 					for (j = 0, k = chartData.series[i].data.length; j < k; j += 1) {
			 						total += chartData.series[i].data[j];
			 					}
			 					chartData.series[i].data.push(total);
			 				}
			 
			 				// Append a new serie with some external data, and display it as a spline
			 				chartData.series.push({
			 					name : "My external serie name",
			 					data : [12, 13, 14, 15, 54],
			 					type : "spline"
			 				});
			 			}
					}
				}
			});

	
AUTHOR

	The AskiaVista Highcharts plugin was written and is maintained by:
		Mamadou Sy <mamadou@askia.com> for Askia SAS

CREDITS
	Highcharts	http://www.highcharts.com

COPYRIGHT
	Copyright (c) 2010, Askia SAS. All rights reserved.

LICENSE

	All code specific to the AskiaVista AJAX is under the AskiaVistaSDK license
