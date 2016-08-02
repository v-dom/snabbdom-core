'use strict';

var snabbdom = require('snabbdom');
var h = require('snabbdom/h');


module.exports = {

    // The core exposes only one single function snabbdom.init.
    // This init takes a list of modules and returns a patch
    // function that uses the specified set of modules.
    patch: snabbdom.init([
        require('snabbdom/modules/class'), // makes it easy to toggle classes,
        require('snabbdom/modules/props'), // for setting properties on DOM elements
        require('snabbdom/modules/style'), // handles styling on elements with support for animations
        require('snabbdom/modules/attributes')
    ]),


    // It is recommended that you use snabbdom/h
    // to create vnodes. h accepts a tag/selector as a string,
    // an optional data object and an optional string or array of children.
    H: h('div.hello-snabbdom', {
        style: { color: '#000' }
    }, 'hello again'),

    doPatch: function(vnode) {
        // The patch function returned by init takes two arguments.
        // The first is a DOM element or a vnode representing the current view.
        // The second is a vnode representing the new, updated view.
        var newVnode = h('div', 'Hello Snabbdom');
        var patch = snabbdom.init([]);
        return patch(vnode, newVnode);
    },

    withHooks: function(vnode) {
        // Hooks are a way to hook into the lifecycle of DOM nodes.
        // Snabbdom offers a rich selection of hooks.
        // Hooks are used both by modules to extend Snabbdom,
        // and in normal code for executing arbitrary code at desired points
        // in the life of a virtual node.

        var newVnode = h('div.with-hooks', {

            hook: {

                init: function() {
                    // This hook is invoked during the patch process
                    // when a new virtual node has been found.
                    // The hook is called before Snabbdom has processed the node
                    // in any way. I.e., before it has created a DOM node based on
                    // the vnode.
                    console.log('init hook was invoked');
                },

                insert: function() {
                    // This hook is invoked once the DOM element
                    // for a vnode has been inserted into the document
                    // and the rest of the patch cycle is done.
                    console.log('insert hook was invoked');
                },

                remove: function(vn, callback) {
                    // Allows you to hook into the removal of an element.
                    // The hook is called once a vnode is to be removed from the DOM.
                    // The handling function receives both the vnode and a callback.
                    // You can control and delay the removal with the callback.
                    // The callback should be invoked once the hook is done doing its business,
                    // and the element will only be removed once all remove hooks
                    console.log('remove hook was invoked. Text is', vn.text);

                    setTimeout(function() {
                        console.log('element was removed');
                        return callback();
                    }, 1);
                }

            }
        }, 'with hooks');
        var patch = snabbdom.init([]);
        return patch(vnode, newVnode);
    },

    modules: {
        classModule: function(active) {
            // The class module provides an easy way to dynamically toggle
            // classes on elements. It expects an object in the class data property.
            // The object should map class names to booleans that indicates
            // whether or not the class should stay or go on the vnode.
            // var r = 1;
            var newVnode = h('a.btn', {
                class: { active: active, selected: !active }
            }, 'Toggle');

            return newVnode;
        },

        propsModule: function(props) {
            // Allows you to set properties on DOM elements.
            return h('img', { props: { src: props.a, alt: props.b } });
        },

        attrsModule: function(att) {
            // Same as props, but set attributes instead of properties on DOM elements.
            return h('img', { attrs: { src: att.a, alt: att.b } });
        },

        styleModules: {
            style: function(styles) {
                // The style module is for making your HTML look slick and animate smoothly.
                // At its core it allows you to set CSS properties on elements.
                return h('div', { style: styles });
            },

            delayedProperties: function() {
                // You can specify properties as being delayed.
                // Whenever these properties change,
                // the change is not applied until after the next frame.
                return h('div', { style: { opacity: '0', transition: 'opacity .5s', delayed: { opacity: '1' } } });
            }
        }
    }
};
