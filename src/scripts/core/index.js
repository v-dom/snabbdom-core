'use strict';

var snabbdom = require('snabbdom');
var h = require('snabbdom/h');


module.exports = {

    patch: snabbdom.init([
        require('snabbdom/modules/class'), // makes it easy to toggle classes,
        require('snabbdom/modules/props') // for setting properties on DOM elements
    ]),

    H: h('div.hello-snabbdom', {
        style: { color: '#000' }
    }, 'hello again'),

    doPatch: function(vnode) {
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
        }
    }
};
