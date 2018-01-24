=======================================================================================================================
AskiaVista Utilities Replay
=======================================================================================================================

CHANGELOG
	Version 1.0.0 (21-DEC-2010)
 		+ Extend askiaVista with the replay namespace/method, replay.bind and replay.bindImplicit methods
 		+ Replay a given query (identify by the 'id' parameter) and only change some options
 		+ Extend jQuery with a series of 'replayOn' helper methods (replayOnChange, replayOnClick)
		+ Code validates with jsLint
 
DESCRIPTION

	Since the version 2.01 of AskiaVista AJAX, this plugin allows you to replay an AskiaVista AJAX query and optionally change it. 
	It makes it easier to do dynamic queries.

	This plugin offers many ways to replay a query:
		- Using the askiaVista.replay() method
		- Using the askiaVista.replay.bind() method
		- Using the jQuery.replayOn method
		- Using askiaVista.replay.bindImplicit() method (advanced feature)

SETUP

	Declare the 'Replay' plugin in your document (after the declaration of AskiaVista AJAX)

    <script type="text/javascript" src="http://localhost/AskiaVistaReader/Scripts/askiavista.replay.js"></script>

	To activate the 'Replay' plugin on a given query, add the 'id' parameter on it

	  askiaVista.display({
			/**
			 * Extra id paramater for the Replay plugin 
			 */
			id : "result1", 

			/**
			 * Classical parameters 
			 */
			survey : "EX",
			rows : "i2. Age",
			columns : "i1. Gender",
			containerId : "result"
	  });

USAGE

	+ BASIC REPLAY METHOD

	The Replay plugin add the method 'replay()' in 'askiaVista' object.
	This method have the following signature:

		askiaVista.replay(id, options);
	
	- id {String}
		Indicates the query to replay.
 
	- options {Object}
		Indicates the part of the query definition to change.
	
	- Example

		* Html
	
		 <!-- Link use to set the question 'Profession' in rows -->
		 <a href="#" id="profession_lnk">Profession</a>

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
		   * Attach events on link when the DOM (page) is ready (jQuery syntax)
		   */
		  $(function () { 

			   /** 
				*  When the user click on the 'Profession' link, 
				*  set the question 'Profession' in rows 
			    */
			   $("#profession_link").click(function () { 
					 askiaVista.replay("result1", {rows : "i3. Profession"});   
					 return false; // Don't follow the link
			   });

		  });  
	

	+ REPLAY ON EVENTS (ASKIAVISTA SYNTAX)

	The Replay plugin adds the namespace 'replay'  in 'askiaVista' object with the method 'bind()'.
	This method allows you to replay a query on a given HTML event, 
	for example when people click on a radio button or select an option in the drop-down list.
	
	NOTA: This method automatically use the 'value' of the HTML element to replay the query.

	This method have the following signature:

		askiaVista.replay.bind(uiEvent, selector, replayParams);
	
	- uiEvent {String}
		Indicates which HTML event to bind: "click", "change", "submit" ...
 
	- selector {String|HTMLElement}
		Indicates the element(s) to listen using a css selector or the HTMLElement itself.
		You can use all available css selectors like: 

		+-----------------------------------------------+-----------------------------------------------+---------------+
		| Selector type									| Description									| Syntax		|
		+-----------------------------------------------+-----------------------------------------------+---------------+
		| Select an element using his @id				| Hash sign (#) follow by the id of the element	| #id			|
		+-----------------------------------------------+-----------------------------------------------+---------------+
		| Select element(s) using the class name		| Period (.) follow by the name of css class	| .class		|
		+-----------------------------------------------+-----------------------------------------------+---------------+
		Please refer to the css selector of W3C documentation to have more information: http://www.w3.org/TR/CSS2/selector.html

	- replayParams {String|Object}
		Defines which query to use and how to replay it.
		When it's a string indicates the query to replay, without changes.
		When it's a plain object, it defines the query to replay and the parameter to change.

			{ 
			   id : "Id_of_query_to_replay",
			   parameter : "Parameter_to_change"
			}
		
	- Example

		* Html

		   <!-- List of questions to set in rows -->
		   <label for="questions">Question in row</label>
		   <select id="questions">
			   <option value="i2. Age" selected="selected">Age</option>
			   <option value="i3. Profession">Profession</option>
		   </select>

			<!-- List of sub-populations to apply -->
			<ul id="subPopsList">
				<li>
					<input type="radio" name="subPop" id="subPop_young" value="young" checked="true" />
					<label for="subPop_young">Young</label>
				</li>
				<li>
					<input type="radio" name="subPop" id="subPop_old" value="old" />
					<label for="subPop_old">Old</label>
				</li>
			</ul>

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
			 * Attach events when the DOM (page) is ready (jQuery syntax)
			 */
			$(function () {
   
				/**
				 * Change the question in rows when people select a question in the drop-down list
				 * @param uiEvent		When the value of drop-down list change
				 * @param selector		HTMLElement with the id 'questions'
				 * @param replayParams	Use the query with the id "result1" and change the question 
				 *		  				in rows using the selected drop-down option
				 */
				askiaVista.replay.bind("change", "#questions", {id : "result1", parameter : "rows"});

				/** 
				 * Change the sub-population when people click on a radio button
				 * @param uiEvent		When people click on a radio button
				 * @param selector		Input HTMLElements with the name 'subPop' and the type 'radio'
				 * @param replayParams	Use the query with the id "result1" and change the sub-population 
				 *						using the selected radio button
				 */
				askiaVista.replay.bind("click", "input[name=subPop]:radio", {id : "result1", parameter : "subPopulation"});

			});
		

	+ REPLAY ON EVENTS (JQUERY SYNTAX)

	The replay plugin extend jQuery itself with two additional methods: 
		- replayOnClick(replayParams)
		- replayOnChange(replayParams)
	This gives you the way to write the replayOn() method using the jQuery-like syntax. 
	The 'replayParams' parameter is defines in the above section.

	- Example
		We can re-write the Javascript part of the example below using the following syntax:

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
			 * Attach events when the DOM (page) is ready (jQuery syntax)
			 */
			$(function () {
   
				/**
				 * Change the question in rows when people select a question in the drop-down list
				 * @param replayParams	Use the query with the id "result1" and change the question 
				 *		  				in rows using the selected drop-down option
				 */
				$("#questions").replayOnChange({id : "result1", parameter : "rows"});
				

				/** 
				 * Change the sub-population when people click on a radio button
				 * @param replayParams	Use the query with the id "result1" and change the sub-population 
				 *						using the selected radio button
				 */
				$("input[name=subPop]:radio").replayOnClick({id : "result1", parameter : "subPopulation"});

			});
   

	+ IMPLICITLY BIND EVENT

	The Replay plugin adds the namespace 'replay' in 'askiaVista' object with the method 'bindImplicit()'.
	It's an advanced technique usually used by other plugins which takes the advantages of the 'Replay' plugin.
	This method has the following signature:

		askiaVista.replay.bindImplicit(uiEvent, selector, query, selectorToFindValues);
	
	- For the 'uiEvent' and 'selector' please refer to the 'replay.bind' section above.

	- query
		Indicates a query with a 'replay' key, like the following example:
		 /**
		  * Get the list of sub-populations
		  * Using the 'replay' key, we can pass the query to the method 'replay.bindImplicit'
		  */
		  askiaVista.getSubPopulations({
				survey : "EX",
				replay : "result1",
				success : function (data, query) {
					askiaVista.replay.bindImplicit("change", "selector", query);
				}
		  });
		
		The 'replay' key can be a string which indicates the id of the query to replay,
		or it can be a plain object which defines how to replay, like that:
		
		   replay  : { id : "result1", parameter : "subPopulation" }
		
		When the 'replay' key is a string, the plugin will try to find itself which parameter it have to change.
		This is done using the 'query' which keeps the context:

		askiaVista.getSubPopulations()	=> Change the 'subPopulation' when it replays
		askiaVista.getWeighting()		=> Change the 'weighting' when it replays
		etc..
		
		However certain queries cannot be predictive (like getProfiles(), getQuestions()), so you have to indicate explicitly the parameter to change.

	- [selectorToFindValues]
		Indicates a CSS selector which determines how to retrieve values.
		For example if you have a list of checkboxes and if you want to use all checked boxes, then you can pass the following css selector:
			"input[type=checkbox|:checked"
			
	- Example
		In the example below the list of questions and sub-populations will be filled using the AskiaVista AJAX queries (askiaVista.getQuestions and askiaVista.getSubPopulations) 

		* Html

			<!-- List of questions to set in rows -->
		   <label for="questions">Question in row</label>
		   <select id="questions"></select>

			<!-- List of sub-populations to apply -->
			<ul id="subPopsList"></ul>


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
			 * Get the list of questions to fill the drop-down list
			 * Using the 'replay' key, we indicate how to 'replay' on change
			 * Using the 'autoReplayOn' method, we attach the 'change' event of the drop-down with id 'questions'
			 */
			askiaVista.getQuestions({
				survey : "EX",
				profile : "questionnaire",
				replay : {id : "result1", parameter : "rows"},
				success : function (data, query) {
					/**
					 * Fill the drop-down (see the method below)
					 */
					fillRows(data);
           
					/**
					 * Bind the event using the current query
					 */
					askiaVista.autoReplayOn("change", "#questions", query); 
				}
			});

			/**
			 * Get the list of sub-populations to fill the radio button list
			 * Using the 'replay' key, we only indicates which query to replay, 
			 *		 the 'query' context will indicates which parameter to change on replay (here the subPopulation)
			 * Using the 'autoReplayOn' method, we attach the 'click' event of the radio buttons
			 */
			askiaVista.getSubPopulations({
				survey : "EX",
				replay : "result1",
				success : function (data, query) {
					/**
					 * Fill the radio button list  (see the method below)
					 */
					fillSubPop(data);
           
					/**
					 * Bind the event using the current query
					 */
					askiaVista.autoReplayOn("click", "input[name=subPop]:radio", query); 
				}
			});


			/**
			 * Fill drop-down with questions 
			 */
			function fillRows(data) {
					var i, l, 
							str = '<option value="">Please select a question</option>', 
							questions = $.parseJSON(data);

					/**
					 * Creates the drop-down options 
					 */
					for (i = 0, l = questions.length; i < l; i +=1) {
							str += '<option value="' + questions[i].shortcut + '">' + questions[i].caption + '</option>';
					} 
            
					/**
					 * Fill drop-down with the id "questions" 
					 */
					$("#questions").html(str);  
			}

			/**
			 * Fill the radio buttons list with sub-populations 
			 */
			function fillSubPop(data) {
					var i, l, 
							str = '', 
							subPops = $.parseJSON(data);

					/**
					 * Creates the radio buttons list  
					 */
					for (i = 0, l = subPops.length; i < l; i +=1) {
							str += '<li>
										<input type="radio" name="subPop" value="' + subPops[i].name + '" id="sp' + i  + '" />
										<label for="sp' + i + '">' + subPops[i].name + '</label>
									</li>';
					} 
            
					/**
					 * Write the list in the document 
					 */
					$("#subPopsList").html(str);  
			}

	+ GET QUERY FROM THE STACK

	The Replay plugin adds the namespace 'replay'  in 'askiaVista' object with the method 'get()'.
	This method allows you to get the query into the stack.
	This method has the following signature:

		askiaVista.replay.get(replay);
	
	- replay {String|Object}
		Indicates the query to retrieve.
		Use the id of query or a replay hash object with the id key.

	+ GET IMPLICIT PARAMETER

	The Replay plugin adds the namespace 'replay'  in 'askiaVista' object with the method 'getImplicitParameter()'.
	This method allows you to obtain the parameter to change using a given query.
	For example, the getSubPopulations query will returns the 'subPopulation' parameter, the getWeightings query will returns the 'weighting' parameter...
	If the parameter to returns is not predictive, then this method returns 'undefined'
	This method has the following signature:

		askiaVista.replay.getImplicitParameter(query);

	
	- query {Object}
		Indicates the query from where the parameter should be extract.

AUTHOR

	The Replay plugin was written and is maintained by:
		Mamadou Sy <mamadou@askia.com> for Askia SAS

COPYRIGHT
	Copyright (c) 2010, Askia SAS. All rights reserved.

LICENSE

	All code specific to the AskiaVista AJAX is under the AskiaVistaSDK license
