=======================================================================================================================
AskiaVista Chart Google Visualization API
=======================================================================================================================


CHANGELOG
	Version 1.0.0 (06-DEC-2010)
 		+ Generate chart using the Google Visualization API
 		+ Compatible with the packages: corechart, gauge, geomap, table
 		+ Fire the click event on the query: click = function (selections, query, object)
 		+ Implements the number formatter for percentage
 		+ Implements the google formatters
 		+ Code validates with jsLint
 

DESCRIPTION

	Since the version 2.01 of AskiaVista AJAX, this plugin allows you to generate chart using the "Google Visualization API" engine.
	http://code.google.com/apis/charttools/index.html

	This plugin extend the AskiaVista AJAX core with the 'google' namespace and automatically handle queries to generate charts.

SYNOPSIS

	The chart plugins automatically handle the success event of the 'display' queries in order to generate chart.
	This is possible using the 'chart' key of the 'display' queries.
	
	- chart {String|Number|Object}
		
		+ When the value is a string or number it indicates the default AskiaVista chart engine (Dundas or Nevron)

		/**
		 * Generate a server side chart image using the default AskiaVista chart engine (Dundas or Nevron)
		 */
		askiaVista.display({
			survey : "EX",
			rows : "i2. Age",
			columns : "i1. Gender",
			chart : "01 - Standard - 2D Column"
		});

		+ When the value is a plain object it indicates a Javascript chart plugin and the options to generate the chart.
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
		  |				|The 'options' depend that the chart engine.										|		  
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

	Declare the Google Visualization API and the askiavista.chart.google plugin using the following lines:

		<script type="text/javascript" src="http://localhost/AskiaVistaReader/Scripts/askiavista.chart.google.js"></script>
		<script type="text/javascript" src="http://www.google.com/jsapi"></script>
	
	According to the "Google Visualization API" documentation you have to load the 'visualization' with some packages:
	http://code.google.com/apis/visualization/documentation/using_overview.html 

		<script type="text/javascript">
			google.load("visualization", "1", {packages : ["corechart", "table", "gauge", "geomap"]});
		</script>
	
	You can includes all packages or just few of them. Separates the package with comma (as the previous example).
	We strongly recommend you to check the Google documentation before to include a new package to be sure that everything is compatible.

	Below a non-hexaustive list of charts and their associated package:

		+---------------+-----------+-------------------------------------------------------------------------------------------+
		| Chart type	| Package	| Overview (by Google)																		|
		+---------------+-----------+-------------------------------------------------------------------------------------------+
		|Area			|corechart	|An area chart that is rendered within the browser using SVG or VML.						|
		|				|			|Displays tips when hovering over points.													|
		|				|			|http://code.google.com/apis/visualization/documentation/gallery/areachart.html				|
		+---------------+-----------+-------------------------------------------------------------------------------------------+
		|Column			|corechart	|A vertical bar chart that is rendered within the browser using SVG or VML.					|
		|				|			|Displays tips when hovering over bars.														|
		|				|			|http://code.google.com/apis/visualization/documentation/gallery/columnchart.html			|
		+---------------+-----------+-------------------------------------------------------------------------------------------+
		|Bar			|corechart	|A horizontal bar chart that is rendered within the browser using SVG or VML.				|
		|				|			|Displays tips when hovering over bars.														|
		|				|			|http://code.google.com/apis/visualization/documentation/gallery/barchart.html				|
		+---------------+-----------+-------------------------------------------------------------------------------------------+
		|Pie			|corechart	|A pie chart that is rendered within the browser using SVG or VML.							|
		|				|			|Displays tooltips when hovering over slices.												|
		|				|			|http://code.google.com/apis/visualization/documentation/gallery/piechart.html				|
		+---------------+-----------+-------------------------------------------------------------------------------------------+
		|Line			|corechart	|A line chart that is rendered within the browser using SVG or VML.							|
		|				|			|Displays tips when hovering over points.													|
		|				|			|http://code.google.com/apis/visualization/documentation/gallery/linechart.html				|
		+---------------+-----------+-------------------------------------------------------------------------------------------+
		|Table			|table		|A table that can be sorted and paged. Table cells can be formatted using format strings,	|
		|				|			|or by directly inserting HTML as cell values.												|
		|				|			|Numeric values are right-aligned; boolean values are displayed as check marks.				|
		|				|			|Users can select single rows either with the keyboard or the mouse.						|
		|				|			|Users can sort rows by clicking on column headers.											| 
		|				|			|The header row remains fixed as the user scrolls. The table fires a number of events 		|
		|				|			|corresponding to user interaction.															|
		|				|			|http://code.google.com/apis/visualization/documentation/gallery/table.html					|
		+---------------+-----------+-------------------------------------------------------------------------------------------+
		|Gauge			|gauge		|One or more gauges are rendered within the browser using SVG or VML.						|
		|				|			|http://code.google.com/apis/visualization/documentation/gallery/gauge.html					|
		+---------------+-----------+-------------------------------------------------------------------------------------------+
		|Geomap			|geomap		|A geomap is a map of a country, continent, or region map, with colors and values assigned	|
		|				|			|to specific regions.																		|
		|				|			|Values are displayed as a color scale, and you can specify optional hovertext for regions.	|
		|				|			|The map is rendered in the browser using an embedded Flash player.							|
		|				|			|Note that the map is not scrollable or draggable, but can be configured to allow zooming.	|
		|				|			|http://code.google.com/apis/visualization/documentation/gallery/geomap.html				|
		+---------------+-----------+-------------------------------------------------------------------------------------------+

	There are more templates at this address: http://code.google.com/apis/visualization/documentation/gallery.html, 
	but we have verified the integration with 'corechart', 'gauge', 'table' and 'geomap' packages.

	NOTA: Be careful using the charts because not all browsers are supported (ex: Gauge in IE 8).
		  PLEASE TEST IT IN MANY BROWSERS BEFORE GOING LIVE!

USAGE
	
	+ BASIC

	To generate a chart using the "Google Visualization API", you only need to indicates the name "Google Visualization API" in the chart key.

		/**
		 * Generate a column chart using the Google Visualization API chart engine
		 */
		askiaVista.display({
			survey : "EX",
			rows : "i2. Age",
			columns : "i1. Gender",
			chart : {name : "Google Visualization API"}
		});


	+ OPTIONS

	The 'options' key allow you to fully customize the parameters passed to the 'draw' method of the Google Visualization API
	Please refer to the Google documentation to know the exact options allowed for a given chart.
		http://code.google.com/apis/visualization/documentation/reference.html#visdraw

	In addition to the options specific to the Google Visualization API, the plugin allows you to specify some custom options:
	
		- chartType {String} (ColumnChart by default)
			Indicates the type of the chart using the Google-like syntax. 
		
			/**
			 * Google Visualization API Code 
			 */
			var visualization = new google.visualization.AreaChart(container);

			/**
			 * AskiaVista - Google Chart plugin 
			 */
			chart : { 
				name : "Google Visualization API", 
				options : {
					chartType : "AreaChart"
				}
			}
		
			Please find below a non-ehxaustive list of available values:

			ColumnChart http://code.google.com/apis/visualization/documentation/gallery/columnchart.html
			AreaChart	http://code.google.com/apis/visualization/documentation/gallery/areachart.html
			BarChart	http://code.google.com/apis/visualization/documentation/gallery/barchart.html
			PieChart	http://code.google.com/apis/visualization/documentation/gallery/piechart.html
			LineChart	http://code.google.com/apis/visualization/documentation/gallery/linechart.html
			Table		http://code.google.com/apis/visualization/documentation/gallery/table.html
			Gauge		http://code.google.com/apis/visualization/documentation/gallery/gauge.html
			GeoMap		http://code.google.com/apis/visualization/documentation/gallery/geomap.html
		
		- formatters {Array}
			Indicates the 'Google Formatters' to apply in all data column of the chart
			It's really useful to add bars, arrow, conditional colors, number formatting in your chart tables.
			Please find the complete description of the formatters here: http://code.google.com/apis/visualization/documentation/reference.html#formatters

			/**
			 * - Prefix data by '$' 
			 * - Add red/green arrows depending if the value are superior or inferior than $100
			 */
			 askiaVista.display({
				survey : "demo",
				rows : "revenue",
				columns : "profession",
				chart : {
					name : "Google Visualization API",
					options : {
						chartType : "Table",
						allowHtml : true, /* Allow HTML in the table to correctly display the arrow */
						formatters : [
							new google.visualization.NumberFormat({prefix: '$'}),
							new google.visualization.ArrowFormat({base : 100})
						]
					}
				}
			 });

		- percentage {Boolean} (false by default)
			Indicates if the values are percentage or not. 
			When true, it automatically suffix the values with the percentage sign '%'.
			This is equivalent to adding a NumberFormatter in the formatters array (see above), this is a shorthand for:
			http://code.google.com/apis/visualization/documentation/reference.html#numberformatter
			
				new google.visualization.NumberFormat({suffix: '%'})

	+ EVENT

	The Google Visualization API create interactives chart, that mean that user can interact with it.
	The plugin allow you to catch the clicks on the chart and then write the logic according to the value selected.

		askiaVista.display({
			survey : "EX",
			rows : "i2. Age",
			columns : "i1. Gender",
			chart : {
				name : "Google Visualization API"
			},
			click : function (selections, query) {
				/* You own code logic */
			}
		});

	The click event is fired with some arguments:
		
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

				query.chart.object = native_google_chart_object


		- Example

		/**
		 * Display a google chart 
		 * Change the background of the page according to the selected column (man = blue, female = pink)
		 */
		askiaVista.display({
			survey : "EX",
			rows : "i2. Age",
			columns : "i1. Gender",
			chart : {
				name : "Google Visualization API"
			},
			click : function (selections, query) {
				if (!selections || !selections.length) {
					return;
				}
				var color = (selections[0].column === "man") ? "blue" : "pink";
				$(body).css({"background-color" : color}); 
			}
		});

AUTHOR

	The AskiaVista Google Visualization API plugin was written and is maintained by:
		Mamadou Sy <mamadou@askia.com> for Askia SAS

CREDITS
	Google Charts Tools http://code.google.com/apis/charttools/index.html

COPYRIGHT
	Copyright (c) 2010, Askia SAS. All rights reserved.

LICENSE

	All code specific to the AskiaVista AJAX is under the AskiaVistaSDK license
