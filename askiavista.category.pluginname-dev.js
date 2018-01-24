/*!
 * jQuery AskiaVista [plugin name]
 * [Description of the plugin]
 *
 * Version [version] ([date])
 *		+ [Feature 1]
 *		+ [Feature 2]
 *
 * @requires jquery.askiavista.js v2.0.1 or later
 * [Other requirement]
 *
 * Examples at: [web site]
 * Copyright (c) [copyright]
 */

(function ($, askiaVista) {
 
	/* ~ Validates the presence of askiaVista ~ */

	if (!askiaVista) {
		alert("AskiaVista AJAX script was not found!\r\nPlease add it into the document OR add the plugin script after AskiaVista.");
		return;
	}

	/* ~ Append some locale for the current plugin ~ */

	askiaVista.config({
		i18n : {
			'[plugin_name]' : {
				hello  :  "Hello world"
			}
		}
	});


	/* ~ Definition of the plugin ~ */

	var that = {
		name	: "[plugin name]",
		version : "[version]",
		date : "[Date of release]",
		category: "[category]",
		localeFile : "[plugin_name]",
		description : "[Description]",
		helpUrl : "[Online help url]",
		author  : "[your name or company name]",
		website : "[your web site]",
		dependencies : [
			{name : "askiaVista", version : ">=2.0.1" }
		],
		deprecatedMethods : [
			//[Place the deprecated methods here]
		]
	};

	/* ~ Manage the askiaVista events ~ */

	/* Only when the category of plugin is 'chart' */
	that.draw = function (data, options, params) {
		/* [Place your code here] */
	};
	
	/* Before to execute a success query */
	that.beforeSuccess = function (data, params) {
		/* [Place your code here] */
	};
	
	/* After to execute a success query */
	that.afterSuccess = function (data, params) {
		/* [Place your code here] */
	};

	/* Before to execute the error management*/
	that.beforeError = function (message, params) {
		/* [Place your code here] */
	};
	
	/* After to execute the error management */
	that.afterError = function (message, params) {
		/* [Place your code here] */
	};

	/* Before to execute the security error management*/
	that.beforeSecurityError = function (message, params) {
		/* [Place your code here] */
	};
	
	/* After to execute the security error management */
	that.afterSecurityError = function (message, params) {
		/* [Place your code here] */
	};

	/* Before to abort a query */
	that.beforeAbort = function (params) {
		/* [Place your code here] */
	};

	/* After to have aborted a query */
	that.afterAbort = function (params) {
		/* [Place your code here] */
	};

	/* Customize the about text */
	that.about = function (verbose) {
		/* [Place your code here] */
	};

	/* ~ Methods to extend askiaVista ~ */

	function hello() {
		/* 
			Usage: 
			askiaVista.hello();
		*/
		alert(that.translate("hello"));
	}


	/* ~ Initialize the plugin ~ */

	that.init = function () {
		/* Extend askiaVista */
		askiaVista.extend({
			hello : hello
		});
	};
	

	/* ~ Add the plugin ~ */

	askiaVista.addPlugin(that);
	
}(jQuery, askiaVista));
