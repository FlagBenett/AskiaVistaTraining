=======================================================================================================================
AskiaVista UI Pagination
=======================================================================================================================

CHANGELOG
  Version 1.0.0 (08-JUN-2011)
 		+ Creates the pagination using the list of links or the dropdown
 		+ Code validates with jsLint

DESCRIPTION

	Since the version 2.02 of AskiaVista AJAX, this plugin generate pagination for the getPages and the getInterviews methods.
	It generates the pagination using the list of links or the dropdown.
	
	This plugin offers many ways to generate the pagination:
		- Using the askiaVista.pagination() method
		- Using the key 'pagination' in query
	
SETUP

	Declare the 'UI-Pagination' plugin in your document (after the declaration of AskiaVista AJAX)

    <script type="text/javascript" src="http://localhost/AskiaVistaReader/Scripts/askiavista.ui.pagination.js"></script>

USAGE

	+ BASIC PAGINATION METHOD

	The UI-Pagination plugin add the method 'pagination()' in 'askiaVista' object.
	This method have the following signature:

		askiaVista.pagination(id, data, query, options);

	- id {String}
		Id of the HTML element to write the pagination, could be a <ul>/<ol> element to write the list of links 
		or a <select> element to write the pagination in dropdown.

	- [data] {String}
		Data coming from the server-side AJAX response. Currently a JSON string.
	
	- [query] {Object}
		Initial query object used to get the pages of result. It's used to keep the context.

	- [options] {Object}
		Indicates some optional argument.
		Below the list of available options:

		- [first=false] {Boolean}
			Only for the pagination by links.
			When true generate an additional link to reach the first page.

		- [previous=true] {Boolean}
			Only for the pagination by links.
			When true generate a link to navigate to the previous page.

		- [next=true] {Boolean}
			Only for the pagination by links.
			When true generate a link to navigate to the next page.

		- [last=false] {Boolean}
			Only for the pagination by links.
			When true generate a link to reach the latest page.

		- [max=15] {Number}
			Only for the pagination by links.
			Indicates the max number of links visible.

		- [format=""]  {String}
			Indicates the format of the text for the pagination.
			You could use the following keywords to make it dynamic:
				%index	:	Display the index of the page (based 1)
				%name	:	Display the name of the page (only for getPages)
				%type	:	Display the type of the page (only for getPages)
			When empty the default format change according to the type of pagination (links or dropdown) 
			and the type of query (getPages or getInterviews):
				- getPages and getInterviews / links: format = "%index"
				- getPages / dropdown: format = "%index %name"
				- getInterviews / dropdown: format = "Page %index"
		
	- Example

		* Html
	
		 <!-- Pagination 1 -->
		 <select id="pagination1"></select>
		 <!-- Result 1 -->
		 <div id="result1"></div>

		 <!-- Result 2 -->
		 <div id="result2"></div>
		 <!-- Pagination 2 -->
		 <ul id="pagination2"><li></li></ul>


		* Javascript

		  /**
		   * Display the result and the pagination
		   */
		 askiaVista.getPages({
				survey : "EX",
				containerId : "result1",
				rows : "i1. Gender|i2. Age|i3. Profession|1. Appreciation",
				settings {
					rows { breakTable : true}
				},
				success : function (data, query) {
					   askiaVista.pagination("pagination1", data, query);
				}
		  });

		  /**
		   * Get the list of interviews and the pagination associated
		   */
		 askiaVista.getInterviews({
				survey : "EX",
				containerId : "result2",
				question : "i1. Gender|i2. Age|i3. Profession|1. Appreciation",
				success : function (data, query) {
					  askiaVista.pagination("pagination1", data, query);
					  // Code to parse the interviews
				}
		  });

	+ PAGINATION OBJECT

	The method askiaVista.pagination() return the pagination object, which has the following method:
		
		- display(index)
			Display the page with index specified.
			Returns the pagination object
		- update()
			Recalculate the pagination.
			Returns the pagination object.
		- length()
			Returns the number of pages.
		- current()
			Returns the index of the current page.
		- config([o])
			Allows you to change the original 'options' used to create the pagination.
			Returns the pagination object or the entire list of options if the argument is ommited.
		- change([fn])
			Register a function to execute when the use navigate through the pagination, or fire the event.
			Returns the pagination object

	+ SHORTHAND SYNTAX

	The UI-Pagination plugin gives you a shorthand alternative to display the pagination without implementing the 'success' of query.
	Using the 'pagination' key, you only need to specify the id of the container to write the pagination.

	- Example
	
		* Javascript

		 /**
		  * Display the first page and display the pagination
		  */ 
		  askiaVista.getPages({
			   survey : "EX",
			   rows : "i1. Gender|i2. Age|i3. Profession|1. Appreciation",
			   settings : {
					rows : {breakTable : true}
			   }
			   pagination : "pagination1"
		  });
	
	- pagination {String|Object}
		When it's a string, it represent a the id of the HTML element to generate the pagination.
		When it's a plain object, it allow you to defines more options (like the max).
		In this latest case, the key id is require.
			
			/**
			 * Pagination with maximum of 10 links visible
			 */ 
			askiaVista.getPages({
				survey : "EX",
				rows : "i1. Gender|i2. Age|i3. Profession|1. Appreciation",
				containerId : "result1",
				pagination : {
						id : "pagination1",  
						max : 10
					}
				}
		  });
	
	+ CSS

	The UI-Pagination use the following css classes which allows you to fully customize the style of the links:
		pagination-first		: CSS class for the "First page" link
		pagination-previous : CSS class for the "Previous page" link
		pagination-next		: CSS class for the "Next page" link
		pagination-last		: CSS class for the "Last page" link
		pagination-current	: CSS class for the current selected page

	+ LOCALE

	The UI-Pagination is associated with locale files:
		- English:	Locale/UI-Pagination-en.js
		- French:	Locale/UI-Pagination-fr.js
	
	You can add or edit your translation in these files.

	To load translation, you can use the config() or the loadLocale() method provide by the AskiaVista AJAX:
		askiaVista.config({locale : "en"});
		askiaVista.config({locale : "en-dev"}); //To load the development version
		or
		askiaVista.loadLocale("en");
		askiaVista.loadLocale("en-dev");			//To load the development version

AUTHOR

	The UI-Pagination plugin was written and is maintained by:
		Mamadou Sy <mamadou@askia.com> for Askia SAS

COPYRIGHT
	Copyright (c) 2011, Askia SAS. All rights reserved.

LICENSE

	All code specific to the AskiaVista AJAX is under the AskiaVistaSDK license