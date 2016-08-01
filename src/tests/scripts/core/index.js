'use strict';

var test = require('tape');
var benv = require('benv');
var snabbdom = require('scripts/core');


var before = test;

before('description: snabdom core', function(t) {

    benv.setup(function() {
        window.document.querySelector('body').innerHTML = `<div id="container">
                                                              <div id="placeholder"></div>
                                                              <div id="with-hooks"></div>
                                                              <div id="module-class"></div>
                                                              <div id="module-props"></div>
                                                           </div>`;
        t.end();
    });
});

test('init', function(t) {
    // The core exposes only one single function snabbdom.init.
    // This init takes a list of modules and returns a patch
    // function that uses the specified set of modules.

    var actual = typeof snabbdom.patch,
        expect = 'function';
    t.equal(actual, expect, 'returns a `patch` function');
    t.end();
});

test('h', function(t) {
    // It is recommended that you use snabbdom/h
    // to create vnodes. h accepts a tag/selector as a string,
    // an optional data object and an optional string or array of children.

    var actual = typeof snabbdom.H,
        expect = 'object';
    t.equal(actual, expect, 'snabbdom `h` object');
    t.end();
});

test('patch', function(t) {
    // The patch function returned by init takes two arguments.
    // The first is a DOM element or a vnode representing the current view.
    // The second is a vnode representing the new, updated view.
    var domElm = document.querySelector('#placeholder');

    var actual = snabbdom.doPatch(domElm).elm.innerHTML,
        expect = 'Hello Snabbdom';
    t.equal(actual, expect, 'was replaced by the created DOM');
    t.end();
});

test('Hooks', function(t) {

    var vnode = document.querySelector('#with-hooks');
    var actual, expect;
    vnode = snabbdom.withHooks(vnode);

    actual = vnode.text;
    expect = 'with hooks';
    t.equal(actual, expect);

    var patch = snabbdom.patch;
    vnode = patch(vnode, snabbdom.H);

    actual = document.querySelector('.with-hooks').innerHTML;
    expect = 'with hooks';
    t.equal(actual, expect, 'is not removed yet');

    setTimeout(function() {
        actual = document.querySelector('.hello-snabbdom').innerHTML;
        expect = 'hello again';
        t.equal(actual, expect, 'now element was removed');
        t.end();
    }, 2);
});

test('classModule', function(t) {
    var vnode = document.querySelector('#module-class');
    var patch = snabbdom.patch;
    var actual, expect;

    vnode = patch(vnode, snabbdom.modules.classModule(true));

    actual = vnode.elm.getAttribute('class');
    expect = 'btn active';
    t.equal(actual, expect, 'is active');

    vnode = patch(vnode, snabbdom.modules.classModule(false))
    actual = vnode.elm.getAttribute('class');
    expect = 'btn selected';
    t.equal(actual, expect, 'is selected');

    t.end();
});

test('propsModule', function(t) {
    var vnode = document.querySelector('#module-props');
    var patch = snabbdom.patch;

    vnode = patch(vnode, snabbdom.modules.propsModule({ a: 'a', b: 'b' }));

    var actual = vnode.elm.getAttribute('src'),
    expect = 'a';
    t.equal(actual, expect, 'prop src is defined');

     window.document.querySelector('body').innerHTML

    t.end();
});
