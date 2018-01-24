=======================================================================================================================
AskiaVista DrillDown
=======================================================================================================================


CHANGELOG
	 Version 1.0.0 (15-DEC-2010)
 		+ Creates scenarios
 		+ Bind the 'click' event of query
 		+ Deals with the 'replay' plugin for the drilling
 		+ Manage the query history (move, moveTo, each, previous, next, change)
 		+ Manage the summary using ul or ol HTMLElement
 		+ Providing with the breadcrumbs css for the layout of the summary
 		+ Code validates with jsLint
  

DESCRIPTION

	Since the version 2.01 of AskiaVista AJAX, this plugin allows you to drill in charts or tables.
	This plugin extend the AskiaVista AJAX core with the 'drillDown' namespace.

SYNOPSIS
	Using a Javascript chart library that fires the 'click' event (like Google Visualization API or Highcharts), you can then:

	1/ Create a scenario

		askiaVista.drillDown("Name of scenario")
			.add({ 
				description : "If the question in rows is 'Age', then change it by the question 'Profession'",
				condition : {rows : "i2. Age"},
				replayWith : {rows : "i3. Profession}
			}),
			.add({
				description : "If the question in rows is 'Profession', then change it by the question 'Appreciation'",
				condition : {rows : "i3. Profession"},
				replayWith : {rows : "1. Appreciation"}
			});

	2/ Create a table or chart and apply that scenario
		
		askiaVista.display({
			//Extra id paramater for the Replay plugin 
			id : "result1",

			 // Extra drillDown paramater for the DrillDown plugin 
			 drillDown : "Name of scenario",

			 // Classical parameters 
			 survey : "EX",
			 rows : "i2. Age",
			 columns : "i1. Gender",

			 // Parameters specific to the chart engine
			 chart : {name : "My chart engine"}
		});
	
SETUP

	Declare the DrillDown and the Replay plugin using the following lines:

		<script type="text/javascript" src="http://localhost/AskiaVistaReader/Scripts/askiavista.replay.js"></script>
		<script type="text/javascript" src="http://localhost/AskiaVistaReader/Scripts/askiavista.drilldown.js"></script>
	
USAGE

	You first need to create your drilldown item with a scenario and then associate it to a result.
	The result should be created using a chart engine which implements the 'click' events (like Google Visualization API or Highcharts)
	
	+ DRILLDOWN ITEM

	The DrillDown plugin extends AskiaVista AJAX core with the 'drillDown' method/namespace.
	Using the drillDown method you can get or create a drilldown item. 
	This method has the following signature:

		askiaVista.drillDown(def);
	
		- def {String}
			Indicates the name of the drilldown item to get or to create.
	
	The drilldown item object exposes the following properties/methods:

		  +---------------------+-------------------------------+-------------------------------------------------------------------+
		  |Properties - Methods |Type							| Description														|
		  +---------------------+-------------------------------+-------------------------------------------------------------------+
		  |id					|String							|Id of the drilldown item											|
		  +---------------------+-------------------------------+-------------------------------------------------------------------+
		  |add					|function (scenarioItem)		|Add a condition/action in the scenario								|
		  |						|								| @param {Object} scenarioItem Condition/action used by the scenario|
		  |						|								| @returns {Object} Drilldown item									|
		  +---------------------+-------------------------------+-------------------------------------------------------------------+
		  |execute				|function (selections, query)	|Executes a drilldown scenario.										|
		  |						|								|Search the appropriate condition/action and execute it.			|
		  |						|								| @param {Array} selections Selected values in the chart or table	|
		  |						|								| @param {Object} query Query to re-execute							|
		  |						|								| @returns {Object} Drilldown item									|
		  +---------------------+-------------------------------+-------------------------------------------------------------------+
		  |history				|function (queryId)				|Get the history of a given query.									|
		  |						|								| @param {String} queryId Id of query								|
		  |						|								| @returns {Object} History of the query							|
		  +---------------------+-------------------------------+-------------------------------------------------------------------+

	+ SCENARIO

	A scenario is a collection of the pairs condition/action managed by a drilldown item.
	To create it, use the method 'add' of a drilldown item.
	NOTA: The order to add the condition/action is very important!
		  The DrillDown plugin will loop over the pairs of condition/action and only execute the first matching condition

		askiaVista.drillDown("Scenario1").add({
			condition : {rows : "i2. Age"},
			replayWith : {rows : "i3. Profession"}
		});

	You can optionaly add a 'description' key to comment the condition/action:
		
		askiaVista.drillDown("Scenario1").add({
			description : "If the question in rows is 'Age', then change it by the question 'Profession'",
			condition : {rows : "i2. Age"},
			replayWith : {rows : "i3. Profession"}
		});
	
		- condition {Object|Function|Boolean}
			Indicates the condition in order to fire the action.
			The condition can be a plain object. In this case it indicates all 'keys' which should match with the current display query.
			If the condition is a function, it then should return a boolean. 
			In this case, the function will be fired with some arguments:

				condition : function (selections, query) {
					/* Custom evaluation, return true or false */
				}

				+ selections {Array}
					Indicates the selected values. It contains objects with the following structure:
				
						{
							column : "Label of selected response in column",
							row	: "Label of selected response in row",
							value : value_of_cell
						}
					NOTA: Most of the time the array only contains one item. (selections[0])

				+ query {Object}
					Original query used to generate the table or chart (used to keep the context)
					The query will be updated with the native chart object:

						query.chart.object = native_chart_object

		- replayWith {Object|Function}
			Indicates the action to execute when the condition is true.
			If the 'replayWith' action is a plain object, it indicates the parameters to overwrite in the current query before replaying it.
			If it's a function, it can manage how to drill or return a plain object indicating how to replay.
			In this case, the function will be fire with some arguments:

				replayWith : function (selections, query) {
					/* Customize the drilling */
				}
			(see the above description details)

		- Example
			The 'add' method returns the drilldown item, so you can chain the 'add' to make your code less verbose.
		
			askiaVista.drillDown("Scenario1")
				.add({
					description : "When the user select the 'man' then drill go to the question 'Age'",
					condition : function (selections, query) {
						if (selections && selections.length) {
							return (selections[0].row === "man");
						}
						return false;
					},
					replayWith : {rows : "Age"}
				})
				.add({
					description : "When the question in rows is 'Age' range then apply a sub-population with the name of selected range",
					condition : {rows : "Age"},
					replayWith  : function (selections, query) {
						return {
							subPopulation : selections[0].row
						};
					}
				});


	+ ACTIVATE DRILLDOWN ON RESULT

	To activate a drilldown item in a given query, you need to give an 'id' parameter to your query (for the replay plugin)
	and you need to indicate the name of the drilldown item to use:
		
		askiaVista.display({
			//Extra id paramater for the Replay plugin 
			id : "result1",

			// Extra drillDown paramater for the DrillDown plugin 
			drillDown : "Scenario1",

			// Classical parameters 
			survey : "EX",
			rows : "i2. Age",
			columns : "i1. Gender",

			// Parameters specific to the chart engine
			chart : {name : "My chart engine"}
		});


	+ HISTORY

	The drilldown item records the history of each associated query.
	It updates the 'query' object with the 'index' property, which indicates the position (base 0) of the query in the stack item
	You can get the history object using this following of syntax:
		
		askiaVista.drillDown("Scenario1").history("Id of query");

	The history object has the following properties/methods:

		  +---------------------+-------------------------------+-------------------------------------------------------------------+
		  |Properties - Methods |Type							| Description														|
		  +---------------------+-------------------------------+-------------------------------------------------------------------+
		  |add					|function (query)				|Add query in the history											|
		  |						|								| @param {Object} query Query to add in the history stack item		|
		  |						|								| @returns {Object} History stack item								|
		  +---------------------+-------------------------------+-------------------------------------------------------------------+
		  |change				|function (fn)					|Register a function to fire on change								|
		  |						|								| @param {Function} fn Function to execute on change				|
		  |						|								| @returns {Object} History stack item								|
		  +---------------------+-------------------------------+-------------------------------------------------------------------+
		  |summary				|function (def)					|Indicates how to display the history summary						|
		  |						|								| @param {Object} def Definition of the summary						|
		  |						|								| @returns {Object} History stack item								|
		  +---------------------+-------------------------------+-------------------------------------------------------------------+
		  |count				|function ()					|Count of item in the history stack item							|
		  |						|								| @param {String} queryId Id of query								|
		  |						|								| @returns {Number} Length of the history stack item				|
		  +---------------------+-------------------------------+-------------------------------------------------------------------+
		  |each					|function (fn)					|Loop through the stack and execute the function with the following |
		  |						|								|arguments: fn(query, currentIndex)									| 
		  |						|								|You can break the iteration if the 'fn' method return false		| 
		  |						|								| @param {Function} fn Function to execute during the iteration		|
		  |						|								| @returns {Object} History stack item								|
		  +---------------------+-------------------------------+-------------------------------------------------------------------+
		  |move					|function (step)				|Go back to a previous result										|
		  |						|								| @param {Number} step Positive or negative step to go back			|
		  |						|								| @returns {Object} History stack item								|
		  +---------------------+-------------------------------+-------------------------------------------------------------------+
		  |moveTo				|function (index)				|Go back to a previous result in the history						|
		  |						|								| @param {Number} index Index of the query to re-execute				|
		  |						|								| @returns {Object} History stack item								|
		  +---------------------+-------------------------------+-------------------------------------------------------------------+
		  |previous				|function ()					|Go back to the previous result in the history						|
		  |						|								|Equivalent than move(-1)											|
		  |						|								| @returns {Object} History stack item								|
		  +---------------------+-------------------------------+-------------------------------------------------------------------+
		  |next					|function ()					|Go to the next result in the history								|
		  |						|								|Equivalent than move(1)											|
		  |						|								| @returns {Object} History stack item								|
		  +---------------------+-------------------------------+-------------------------------------------------------------------+


	+ HISTORY SUMMARY

	The DrillDown plugin is able to writes a clickable breadcrumb summary for each query.
	In order to activate this feature, you have to indicate the <ul></ul> or <ol></ol> HTMLElement to write the summary on,
	and the information to display.
	You can do that using the 'drillDown' key in the 'display' method:

		drillDown : {
			id : "Scenario1",
			summary : {
				id : "Id of ul or ol",
				parameter : "Which information to display in the history"
			}
		}
		
		- id {String}
			Indicates the id of the <ul /> or <ol /> HTMLElement

		- parameter {String|Function}
			Indicates the information to display in the summary.
			Using a string it will search the information in the query object:
				parameter : "rows"  // Display the question in rows
				parameter : "title" // Display the title of the cross-tab result
				...
			You can also use a function to customize the text to display.
			In this case the function must return a string.
			The function is fire with the 'query' in argument:
				parameter : function (query) {
					/* Returns the text to display in the history */
				}

		- Example

			* Html

				<ol id="history"><li></li></ol>

			* Javascript

			askiaVista.display({
				//Extra id paramater for the Replay plugin 
				id : "result1",

				// Extra drillDown paramater for the DrillDown plugin 
				// and to display the summary in the HTMLElement with the id "history".
				// The history will display the name of the question in rows
				drillDown : {
					id : "Scenario1",
					summary : {
						id : "history",
						parameter : "rows"
					}
				}

				// Classical parameters 
				survey : "EX",
				rows : "i2. Age",
				columns : "i1. Gender",

				// Parameters specific to the chart engine
				chart : {name : "My chart engine"}
			});
	
	- Extra
		
		The DrillDown plugin is providing with a breadcrumbs css style (Breadcrumbs/Breadcrumbs.css)
		Using the '.breadcrumb' class in your <ul /> or <ol /> it will render it with a beautiful breadcrumb styles.

AUTHOR

	The AskiaVista DrillDown plugin was written and is maintained by:
		Mamadou Sy <mamadou@askia.com> for Askia SAS

CREDITS
	Breadcrumbs from Veerle's blog http://veerle-v2.duoh.com/blog/comments/simple_scalable_css_based_breadcrumbs/

COPYRIGHT
	Copyright (c) 2010, Askia SAS. All rights reserved.

LICENSE

	All code specific to the AskiaVista AJAX is under the AskiaVistaSDK license
