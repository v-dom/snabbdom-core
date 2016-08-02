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
                                                              <div id="module-attrs"></div>
                                                              <div id="module-styles-style"></div>
                                                           </div>`;
        t.end();
    });
});

test('init', function(t) {
    var actual = typeof snabbdom.patch,
        expect = 'function';
    t.equal(actual, expect, 'returns a `patch` function');
    t.end();
});

test('h', function(t) {
    var actual = typeof snabbdom.H,
        expect = 'object';
    t.equal(actual, expect, 'snabbdom `h` object');
    t.end();
});

test('patch', function(t) {
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

    vnode = patch(vnode, snabbdom.modules.classModule(false));
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
    t.end();
});

test('attrsModule', function(t) {
    var vnode = document.querySelector('#module-attrs');
    var patch = snabbdom.patch;

    vnode = patch(vnode, snabbdom.modules.attrsModule({ a: 'a', b: 'b' }));

    var actual = vnode.elm.getAttribute('src'),
        expect = 'a';
    t.equal(actual, expect, 'attr src is defined');
    t.end();
});

test('styleModule: style', function(t) {

    var vnode = document.querySelector('#module-styles-style');
    var patch = snabbdom.patch;

    vnode = patch(vnode, snabbdom.modules.styleModules.style({
        color: '#00FFCC',
        fontSize: '35px'
    }));

    var actual = vnode.elm.getAttribute('style'),
        expect = 'color: rgb(0, 255, 204); font-size: 35px;';
    t.equal(actual, expect, 'style is defined');
    t.end();

    // console.log(document.querySelector('#container').innerHTML)
});
