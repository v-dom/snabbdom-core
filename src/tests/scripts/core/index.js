'use strict';

var test = require('tape');
var benv = require('benv');
var sinon = require('sinon');
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
                                                              <div id="module-styles-delayed-props"></div>
                                                              <div id="evt-listeners"></div>
                                                              <div id="vnode-properties"></div>
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
});

test('styleModule: delayed properties', function(t) {

    var vnode = document.querySelector('#module-styles-delayed-props');
    var patch = snabbdom.patch;

    vnode = patch(vnode, snabbdom.modules.styleModules.delayedProperties());

    setTimeout(function() {
        var actual = vnode.elm.getAttribute('style'),
            expect = 'opacity: 1;';
        t.equal(actual, expect, 'style opacity with delay');
        t.end();
    }, 500);
});

test('eventListeners', function(t) {

    var vnode = document.querySelector('#evt-listeners');
    var patch = snabbdom.patch;
    var callback = sinon.spy();

    vnode = patch(vnode, snabbdom.evtlistener(callback));

    var buttonValue = vnode.children[0].data.on.click[1];

    // simulate click
    vnode.children[0].data.on.click[0](buttonValue);

    var actual = callback.calledWith(1),
        expect = true;
    t.equal(actual, expect, 'evt listener was called with value === 1');

    t.end();

});

test('virtual node properties', function(t) {

    var props = {
        className: 'props-container',
        title: 'a title',
        items: 3
    };
    var actual, expect;
    var vnode = document.querySelector('#vnode-properties');
    var patch = snabbdom.patch;
    vnode = patch(vnode, snabbdom.virtualNodeProperties(props))

    actual = vnode.sel;
    expect = 'div#cool';
    t.equal(actual, expect, 'selector value is "div#cool"');

    actual = vnode.data.props;
    expect = {
        className: props.className
    };
    t.deepEqual(actual, expect, 'props are defined');


    actual = vnode.children.length;
    expect = 2;
    t.equal(actual, expect, 'should have one children');

    actual = vnode.children[0].text;
    expect = 'a title';
    t.equal(actual, expect, 'children text is defined');

    actual = vnode.children[0].elm.innerHTML;
    expect = 'a title';
    t.equal(actual, expect, 'elm property');

    actual = vnode.children[1].children[0].data.key;
    expect = 0;
    t.equal(actual, expect, 'li key is defined');

    t.end();
});
