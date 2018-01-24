=======================================================================================================================
AskiaVista UI DropDownList
=======================================================================================================================

CHANGELOG
	Version 1.0.0 (21-DEC-2010)
 		+ Extend askiaVista with the fillDropDown method
 		+ Manage the dropDown parameters in all get (and search) queries
 		+ Extend jQuery with a serie of 'fillWith' helper methods
 		+ Deals with the Replay plugin
 		+ Code validates by jsLint

DESCRIPTION

	Since the version 2.01 of AskiaVista AJAX, this plugin allows you to fill drop-downs (<select> html tag) 
	using all "get" methods provides by AskiaVista AJAX core (all methods which begins by "get", plus the method 'search').
	It makes its easier to fill drop-down.

	- Example

		* Without the UI-DropDown plugin
			
			/**
			 * Fill a drop-down with the list of questions (manual syntax)
			 */
			askiaVista.getQuestions({
				survey : "EX",
				profile : "questionnaire",
				success : function (data, query) {
					var i, l, 
							str = '<option value="">Please select a question</option>', 
							questions = $.parseJSON(data);

					/**
					 * Creates the drop-down options 
					 * Used the 'id' of questions as the value of options
					 * Used the 'name' of questions as the text of options
					 */
					for (i = 0, l = questions.length; i < l; i +=1) {
							str += '<option value="' + questions[i].id + '">' + questions[i].name + '</option>';
					} 
            
					/**
					 * Fill drop-down with the id "questions" 
					 */
					$("#questions").html(str);            
				}
			});


		* With the UI-DropDown plugin
			
			/**
			 * Fill a drop-down with the list of questions (UI-DropDown syntax)
			 */
			askiaVista.getQuestions({
				survey : "EX",
				profile : "questionnaire",
				dropDown : "#questions"
			});


	This plugin offers many ways to fill drop-downs:
		- Using the askiaVista.fillDropDown() method
		- Using the key 'dropDown' in query
		- Using the jQuery-like syntax

	This plugin also deals with the 'Replay' plugin to make your results dynamic
	https://dev.askia.com/projects/askiavista-sdk/wiki/Replay

SETUP

	Declare the 'UI-DropDown' plugin in your document (after the declaration of AskiaVista AJAX)

    <script type="text/javascript" src="http://localhost/AskiaVistaReader/Scripts/askiavista.ui.dropdown.js"></script>

USAGE

	+ BASIC FILLDROPDOWN METHOD

	The UI-DropDown plugin add the method 'fillDropDown()' in 'askiaVista' object.
	This method have the following signature:

		askiaVista.fillDropDown(selector, data, query, options);
	
	- selector {String|HTMLElement}
		Indicates the element(s) to listen to using a css selector or the HTMLElement itself.
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
		Indicates some optional argument 'options' is used to fill the drop-down or to attach event on it.
		Below the list of available options:

		- [first] {false|Object}
			Indicates how to manage the first option in the drop-down.
			Disable the first option when the value is 'false'.
			Otherwise, defines the value and the text of the first option:
			
				{ 
					 first : {
							 value : -1,
							 text : "Please select an item"
							}
				}
			

			NOTA: Using the context ('query'), the plugin generate the first option intelligently.
			For example:
				#1 If the action is askiaVista.getSubPopulations() or askiaVista.getWeightings(), 
				   the plugin doesn't generate the first option. That's because the result include "All interview" or "No weighting".
				#2 If the action is askiaVista.getQuestions() or askiaVista.getPortfolios() and so on, 
					the plugin will generate the first option with "Please select a question" or "Please select a portfolio".


		- [change] {Function}
			Indicates the function to execute when users select change the option in the drop-down.
			The function will be called with some useful arguments:

				change : function (selection, query) {}
			
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
					Original query used by the @fillDropDown@ method.

	- Example

		* Html
	
		 <!-- List of sub-populations -->
		 <select id="subPop"></select>

		 <!-- List of questions -->
		 <select id="questions"></select>

		* Javascript

		  /**
		   * Fill the drop-down with the list of sub-populations
		   */
		 askiaVista.getSubPopulations({
				survey : "EX",
				success : function (data, query) {
					   askiaVista.fillDropDown("#subpop", data, query);
				}
		  });

		  /**
		   * Fill the drop-down with the list of questions.
		   * Display an alert message with the selected question when the drop-down selection changed.
		   */
		  askiaVista.getQuestions({
				survey : "EX",
				profile : "questionnaire",
				success : function (data, query) {
					   askiaVista.fillDropDown(".question", data, query, { 
								 change : function (selection, query) {
									  alert(selection.id + " " + selection.key + " " + selection.shortcut + " " + selection.caption + " " + selection.type);
								 });
					   }
				}
		  });


	+ SHORTHAND SYNTAX

	The UI-DropDown plugin gives you a shorthand alternative to fill a drop-down without implementing the 'success' of query.
	Using the 'dropDown' key, you only need to specify the drop-down to fill with the data of the query.

	- Example
	
		* Javascript

		 /**
		  * Fill drop-down with the list of sub-populations
		  */ 
		  askiaVista.getSubPopulations({
			   survey : "EX",
			   dropDown : "#subpop"
		  });
	
		Same as:

		 /**
		  * Fill drop-down with the list of sub-populations
		  */
		  askiaVista.getSubPopulations({
			   survey : "EX",
			   success : function (data, query) {
					askiaVista.fillDropDown("#subpop", data, query);
			   }
		  });

	- dropDown {String|Object}
		Indicates that the query should fill a given drop-down.
		When it's a string, it represent a css selector.
		When it's a plain object, it allow you to defines more options (like the first option and the event on change).
			
			/**
			 * - Fill drop-downs with the class '.question'
			 * - Modify the default text and the value of the first HTML Option using 'no-question'/'No question'
			 * - Bind the change event of the drop-downs to display the selected option using an alert box.
			 */ 
			askiaVista.getQuestions({
				survey : "EX",
				profile : "questionnaire",
				dropDown : {
						selector : ".question",  
						first : {
							value : "no-question",
							text : "No question"
						},
						change : function (selection, query) {
								alert(selection.shortcut + " " + selection.caption + " " + selection.type);
						}
					}
				}
		  });
	

		You can also use the key 'id' instead of 'selector'.
		You should specify the 'id' of your drop-down list without to the prefix hash sign (#):

			/**
			 * - Fill a drop-down with the id 'subpop'
			 * - Bind the change event of the drop-down to display the selected option using an alert box.
			 */
			askiaVista.getSubPopulations({
				survey : "EX",
				dropDown : {
						id : "subpop",
						change : function (selection, query) {
								alert(selection.id + " " + selection.name + " " + selection.description);
						}
					}
				}
			});


	+ JQUERY SYNTAX

	The UI-DropDown plugin extend jQuery itself.
	Using the "fillWith" prefix in jQuery instead of the "get" prefix of the AskiaVista AJAX methods, 
	it allows you to fill a drop-down using the jQuery-like syntax:
	
	NOTA: For the method 'search', you can use the 'fillWithSearch' method.

	- AskiaVista AJAX-like syntax:
	
		askiaVista.getSubPopulations({
			survey : "EX",
			dropDown : "#subpop"
		});
	

	- jQuery-like syntax:

		$("#subpop").fillWithSubPopulations({
			survey : "EX"
		});


	As almost all of the jQuery plugins, the UI-DropDown plugin returns the initial selected element.
	That allows to "chain" methods on the same element. 
	For example:

		/** 
		 * Fill the drop-down with the sub-populations and then display it using the 'fadeIn' jQuery method
		 */
		$("#subpop")
			.fillWithSubPopulations({
				survey : "EX"
			})
			.fadeIn("slow");
	

	+ DEALING WITH THE REPLAY PLUGIN

	The UI-DropDown plugin can work with the 'Replay' plugin https://dev.askia.com/projects/askiavista-sdk/wiki/Replay
	It allows you to automatically bind the change event of the drop-down list to replay a given query.
	For example, you can execute a cross-tab and change it accordingly when people select a sub-population into a drop-down list.

	- Example

		* Html
			
			<!-- List of sub-populations -->
			<select id="subpop"></select>

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
				rows : "i2. Age",
				columns : "i1. Gender",
				containerId : "result"
			});

			/**
			 * Fill the drop-down with the list of sub-populations and
			 * automatically replay the above cross-tab with the sub-population selected by the user
			 */
			 askiaVista.getSubPopulations({
				survey : "EX",
				dropDown : "#subpop",
				replay : "result1"
			 });

	+ LOCALE

	The UI-DropDown is associated with locale files:
		- English:	Locale/UI-DropDown-en.js
		- French:	Locale/UI-DropDown-fr.js
	
	You can add or edit your translation in these files.

	To load translation, you can use the config() or the loadLocale() method provide by the AskiaVista AJAX:
		askiaVista.config({locale : "en"});
		askiaVista.config({locale : "en-dev"}); //To load the development version
		or
		askiaVista.loadLocale("en");
		askiaVista.loadLocale("en-dev");			//To load the development version

AUTHOR

	The UI-DropDown plugin was written and is maintained by:
		Mamadou Sy <mamadou@askia.com> fro Askia SAS

COPYRIGHT
	Copyright (c) 2010, Askia SAS. All rights reserved.

LICENSE

	All code specific to the AskiaVista AJAX is under the AskiaVistaSDK license