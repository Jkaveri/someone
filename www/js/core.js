(function() {

  'use strict';
  var someone = window.someone || {};

  /***
   * register a name space in someone.
   * @string namespace
   */
  someone.namespace = function(namespace) {
    var parts = namespace.split('.'),
      parent = someone,
      i;
    // strip redundant leading global
    if (parts[0] === "someone") {
      parts = parts.slice(1);
    }
    for (i = 0; i < parts.length; i += 1) {
      // create a property if it doesn't exist
      if (typeof parent[parts[i]] === "undefined") {
        parent[parts[i]] = {};
      }
      parent = parent[parts[i]];
    }
    return parent;
  };


  /***
   * Extend object properties.
   */
  someone.extend = function(parent, child) {
    var i;
    child = child || {};
    for (i in parent) {
      if (parent.hasOwnProperty(i) && !child.hasOwnProperty(i)) {
        child[i] = parent[i];
      }
    }
    return child;
  };


  someone.override = function(base, method) {


    if (typeof(base) !== 'function') {
      //define noop function.
      base = function() {};
    }

    if (typeof(method) !== 'function')
      throw "Invalid operation!";

    return function() {
      var args = Array.prototype.slice.call(arguments);
      args = [base].concat(args);
      //console.log(args);
      return method.apply(this, args);
    };
  };

  /**
   * Encode html.
   */
  someone.htmlEncode = function(html) {
    return document.createElement('a').appendChild(
      document.createTextNode(html)).parentNode.innerHTML;
  };
  /**
   * Decode html.
   */
  someone.htmlDecode = function(html) {
    var a = document.createElement('a');
    a.innerHTML = html;
    return a.textContent;
  };


  /**
   * A method that help to remove first item of arguments.
   * @object arguments
   */
  someone.removeFirstArgument = function(args) {
    if (args.length > 0) {
      return Array.prototype.slice.call(args, 1);
    }
    return [];
  };

  window.someone = someone;
}());
