=======================================================================================================================
AskiaVista UI InputList
=======================================================================================================================

CHANGELOG
	Version 1.0.0 (21-DEC-2010)
 		+ Extend askiaVista with the createInputs method
 		+ Manage the inputList parameters in all get (and search) queries
 		+ Extend jQuery with a serie of 'createInputsWith' helper methods
 		+ Deals with the Replay plugin
 		+ Code validates by jsLint

DESCRIPTION

	Since the version 2.01 of AskiaVista AJAX, this plugin allows you to create a list of inputs (in unordered list <ul> or ordered list <ol>)
	using all "get" methods provided by AskiaVista AJAX core (all methods which begins by "get", plus the method 'search').
	It makes its easier to create inputs list.

	- Example

		* Without the UI-ListInput plugin

			/**
			 * Create a radio buttons list of sub-populations (manual syntax)
			 */
			askiaVista.getSubPopulations({
				survey : "EX",
				success : function (data, query) {
					var i, l, 
							str = [], 
							subPops = $.parseJSON(data);

					/**
					 * Creates the list of radio buttons
					 * Used the 'id' of sub-populations as the value of inputs
					 * Used the 'name' of sub-populations as the label
					 */
					for (i = 0, l = subPops.length; i < l; i +=1) {
							str.push('<li>');
							str.push('<input type="checkbox" name="sp' + i + '" id="sp' + i + '" value="' + subPops[i].id + '" />');
							str.push('<label for="sp' + i + '">' + subPops[i].name + '</label>');
							str.push('</li>');
					} 
            
					/**
					 * Write the list in the unordered list element with the id "subPopulations" 
					 */
					$("#subPopulations").html(str.join(''));            
				}
			});


		* With the UI-InputList plugin
			
			/**
			 * Create a checkbox list of sub-populations (UI-InputList syntax)
			 */
			askiaVista.getSubPopulations({
				survey : "EX",
				inputList : "#subPopulations"
			});


	This plugin offers many ways to create the inputs:
		- Using the askiaVista.createInputs() method
		- Using the key 'inputList' in query
		- Using the jQuery-like syntax

	This plugin also deals with the 'Replay' plugin to make your results dynamic
	https://dev.askia.com/projects/askiavista-sdk/wiki/Replay

SETUP

	Declare the 'UI-InputList' plugin in your document (after the declaration of AskiaVista AJAX)

    <script type="text/javascript" src="http://localhost/AskiaVistaReader/Scripts/askiavista.ui.inputlist.js"></script>

USAGE

	+ BASIC CREATEINPUTS METHOD

	The UI-InputList plugin add the method 'createInputs()' in 'askiaVista' object.
	This method have the following signature:

		askiaVista.createInputs(selector, data, query, options);
	
	- selector {String|HTMLElement}
		Indicates the unordered list(s) to listen to using a css selector or the HTMLElement itself.
		You can use all available css selectors like: 

		--------------------------------------------------------------------------------------------------------------
		| Selector type									| Description									| Syntax	 |
		--------------------------------------------------------------------------------------------------------------
		| Select an element using his @id				| Hash sign (#) follow by the id of the element	| #id		 |
		| Select element(s) using the class name		| Period (.) follow by the name of css class	| .class	 |
		--------------------------------------------------------------------------------------------------------------
		Please refer to the css selector of W3C documentation to have more information: http://www.w3.org/TR/CSS2/selector.html
 
	- data {String}
		Data coming from the server-side AJAX response. Currently a JSON string.
	
	- query {Object}
		Initial query object used to get the list of items. It's used to keep the context.

	- [options] {Object}
		Indicates some optional argument 'options' is used to create the inputs or to attach event on it.
		Below the list of available options:

		- [type] {String} (radio|checkbox)
			Indicates the type of inputs to generate.
			The two available values are 'radio' (by default) or 'checkbox'

		- [inputId] {String}
		- [inputName] {String}
			Indicates the forrmat for the id/name of inputs control.
			To make it dynamic you have to use some formatting keys:
				%s Use the text of the item (name/shortcut...)
				%i, %v Use the id or the expected value of item (id/key)
				%r Use a random string

			The default values are:
				inputId = askiavista.ui.inputlist.%r_%i
				inputName = askiavista.ui.inputlist.%r (for radio buttons)
				inputName = askiavista.ui.inputlist.%r[%i] (for check boxes)

		- [selected] {String|Number|Array}
			Indicates the default selected options.
			You can use the name or the id of item separates by a pipe characters '|', or an array.

			/**
			 * Create inputs with the list of sub-populations and select the "All interview" item by default
			 */
			askiaVista.createInputs("#subPopulations", data, query, {selected : -1 });

		- [click] {Function}
			Indicates the function to execute when users select an item.
			The function will be called with some useful arguments:

				click : function (selection, query) {}
			
				- selection
					Represent the original hash object used to creates the HTML Option selected. 
					According to the query, the 'selection' can be:
						getSubPopulations:
						{id : "id_of_subpopulation", name : "name_of_subpopulation", description : "description_of_subpopulation" ...}
						getQuestions:
						{id : "id_of_question", key : "key_of_question", shortcut : "shortcut_of_question" ....}
					etc...
					Please refer to the "AskiaVista AJAX 2 documentation":https://dev.askia.com/projects/askiavista-sdk/wiki/AskiaVista_AJAX_2 
					to have more details about the plain object definition.

				- query
					Original query used by the @createInputs@ method.

	- Example

		* Html
	
		 <!-- List of sub-populations -->
		 <ul id="subPop"></ul>

		 <!-- List of questions -->
		 <ul id="questions"></ul>

		* Javascript

		  /**
		   * Creates radio buttons with the list of sub-populations
		   */
		 askiaVista.getSubPopulations({
				survey : "EX",
				success : function (data, query) {
					   askiaVista.createInputs("#subpop", data, query);
				}
		  });

		  /**
		   * Creates checkboxes with the list of questions.
		   * Display an alert message with the selected question when the user click on it.
		   */
		  askiaVista.getQuestions({
				survey : "EX",
				profile : "questionnaire",
				success : function (data, query) {
					   askiaVista.createInputs("#question", data, query, { 
								 type : "checkbox",
								 click : function (selection, query) {
									  alert(selection.id + " " + selection.key + " " + selection.shortcut + " " + selection.caption + " " + selection.type);
								 });
					   }
				}
		  });


	+ SHORTHAND SYNTAX

	The UI-InputList plugin gives you a shorthand alternative to create inputs without implementing the 'success' of query.
	Using the 'inputList' key, you only need to specify the unordered list to fill with the data of the query.

	- Example
	
		* Javascript

		 /**
		  * Creates radio buttons with the list of sub-populations
		  */ 
		  askiaVista.getSubPopulations({
			   survey : "EX",
			   inputList : "#subpop"
		  });
	
		Same as:

		 /**
		  * Creates radio buttons with the list of sub-populations
		  */
		  askiaVista.getSubPopulations({
			   survey : "EX",
			   success : function (data, query) {
					askiaVista.createInputs("#subpop", data, query);
			   }
		  });

	- inputList {String|Object}
		Indicates that the query should fill a given unordered list.
		When it's a string, it represent a css selector.
		When it's a plain object, it allow you to defines more options (like the 'selected' option and the event on click).
			
			/**
			 * - Fill unordered list with the class '.question'
			 * - Set the questions 'gender' and 'age' by default
			 * - Bind the click event of the inputs to display the selected question using an alert box.
			 */ 
			askiaVista.getQuestions({
				survey : "EX",
				profile : "questionnaire",
				inputList : {
						selector : ".question",  
						selected : "gender|age",
						click : function (selection, query) {
								alert(selection.shortcut + " " + selection.caption + " " + selection.type);
						}
					}
				}
		  });
	

		You can also use the key 'id' instead of 'selector'.
		You should specify the 'id' of your unordered list without to the prefix hash sign (#):

			/**
			 * - Fill an unordered list with the id 'subpop'
			 * - Bind the click event of the inputs to display the selected sub-population using an alert box.
			 */
			askiaVista.getSubPopulations({
				survey : "EX",
				inputList : {
						id : "subpop",
						click : function (selection, query) {
								alert(selection.id + " " + selection.name + " " + selection.description);
						}
					}
				}
			});


	+ JQUERY SYNTAX

	The UI-InputList plugin extend jQuery itself.
	Using the "createInputsWith" prefix in jQuery instead of the "get" prefix of the AskiaVista AJAX methods, 
	it allows you to fill a unordered list using the jQuery-like syntax:
	
	NOTA: For the method 'search', you can use the 'createInputsWithSearch' method.

	- AskiaVista AJAX-like syntax:
	
		askiaVista.getSubPopulations({
			survey : "EX",
			inputList : "#subpop"
		});
	

	- jQuery-like syntax:

		$("#subpop").createInputsWithSubPopulations({
			survey : "EX"
		});


	As almost all of the jQuery plugins, the UI-InputList plugin returns the initial selected element.
	That allows to "chain" methods on the same element. 
	For example:

		/** 
		 * Fill the list with the sub-populations and then display it using the 'fadeIn' jQuery method
		 */
		$("#subpop")
			.createInputsWithSubPopulations({
				survey : "EX"
			})
			.fadeIn("slow");
	

	+ DEALING WITH THE REPLAY PLUGIN

	The UI-InputList plugin can work with the 'Replay' plugin https://dev.askia.com/projects/askiavista-sdk/wiki/Replay
	It allows you to automatically bind the click event of the inputs list to replay a given query.
	For example, you can execute a cross-tab and change it accordingly when people select a sub-population into the inputs list.

	- Example

		* Html
			
			<!-- List of sub-populations -->
			<ul id="subpop"></ul>

			<!-- Placeholder for the result -->
			<div id="result"></div>

		* Javascript

			/**
			 * Display the default cross-tab
			 * Set the 'id' parameter to identify this query for the replay plugin
			 */
			askiaVista.display({
				id : "result1",
				survey : "EX",
				subPopulation : "worker",
				rows : "i2. Age",
				columns : "i1. Gender",
				containerId : "result"
			});

			/**
			 * Fill the unordered list with the sub-populations and
			 * automatically replay the above cross-tab with the sub-population selected by the user
			 */
			 askiaVista.getSubPopulations({
				survey : "EX",
				inputList : "#subpop",
				replay : "result1"
			 });

		NOTA:
		In the example above, the UI-InputList plugin will automatically determine the default selected sub-populations using the 'result1' query.
		However this auto-detect features only works when the 'result1' query is define before the query to create the list of inputs.

AUTHOR

	The UI-DropDown plugin was written and is maintained by:
		Mamadou Sy <mamadou@askia.com> fro Askia SAS

COPYRIGHT
	Copyright (c) 2010, Askia SAS. All rights reserved.

LICENSE

	All code specific to the AskiaVista AJAX is under the AskiaVistaSDK license