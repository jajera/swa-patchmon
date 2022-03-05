
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    // flush() calls callbacks in this order:
    // 1. All beforeUpdate callbacks, in order: parents before children
    // 2. All bind:this callbacks, in reverse order: children before parents.
    // 3. All afterUpdate callbacks, in order: parents before children. EXCEPT
    //    for afterUpdates called during the initial onMount, which are called in
    //    reverse order: children before parents.
    // Since callbacks might update component values, which could trigger another
    // call to flush(), the following steps guard against this:
    // 1. During beforeUpdate, any updated components will be added to the
    //    dirty_components array and will cause a reentrant call to flush(). Because
    //    the flush index is kept outside the function, the reentrant call will pick
    //    up where the earlier call left off and go through all dirty components. The
    //    current_component value is saved and restored so that the reentrant call will
    //    not interfere with the "parent" flush() call.
    // 2. bind:this callbacks cannot trigger new flush() calls.
    // 3. During afterUpdate, any updated components will NOT have their afterUpdate
    //    callback called a second time; the seen_callbacks set, outside the flush()
    //    function, guarantees this behavior.
    const seen_callbacks = new Set();
    let flushidx = 0; // Do *not* move this inside the flush() function
    function flush() {
        const saved_component = current_component;
        do {
            // first, call beforeUpdate functions
            // and update components
            while (flushidx < dirty_components.length) {
                const component = dirty_components[flushidx];
                flushidx++;
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            flushidx = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        seen_callbacks.clear();
        set_current_component(saved_component);
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(options.context || (parent_component ? parent_component.$$.context : [])),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.46.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    var data_all = [
    {name: "Atlassian Bamboo", version: "8.1.3", check_date: "Sat Mar  5 22:39:03 2022",},
    {name: "Atlassian Bitbucket", version: "7.21.0", check_date: "Sat Mar  5 22:38:53 2022",},
    {name: "Atlassian Confluence", version: "7.9.3", check_date: "Sat Mar  5 22:38:58 2022",},
    {name: "Atlassian JIRA Core", version: "8.22.0", check_date: "Sat Mar  5 22:39:06 2022",},
    {name: "Atlassian JIRA Servicedesk", version: "4.22.0", check_date: "Sat Mar  5 22:39:08 2022",},
    {name: "Atlassian JIRA Software", version: "8.22.0", check_date: "Sat Mar  5 22:39:05 2022",},
    {name: "Chef Automate", version: "20220223121207", check_date: "Sat Mar  5 22:38:51 2022",},
    {name: "Chef Habitat", version: "1.6.420", check_date: "Sat Mar  5 22:39:10 2022",},
    {name: "Chef Infra Server", version: "14.13.46", check_date: "Sat Mar  5 22:39:09 2022",},
    {name: "DELL PS Firmware", version: "", check_date: "Sat Mar  5 22:38:54 2022",},
    {name: "Dell EMC OpenManage Enterprise", version: "", check_date: "Sat Mar  5 22:39:01 2022",},
    {name: "Google Chrome - Windows", version: "99.0.4844.51", check_date: "Sat Mar  5 22:38:56 2022",},
    {name: "MariaDB MaxScale 2.4", version: "", check_date: "Sat Mar  5 22:38:59 2022",},
    {name: "OpenJDK", version: "", check_date: "Sat Mar  5 22:38:54 2022",},
    {name: "Oracle MySQL Enterprise", version: "", check_date: "Sat Mar  5 22:39:00 2022",},
    {name: "SmartBear", version: "", check_date: "Sat Mar  5 22:38:59 2022",},
    {name: "Spring Framework", version: "", check_date: "Sat Mar  5 22:39:02 2022",},
    ];

    /* src\AllList.svelte generated by Svelte v3.46.4 */
    const file$1 = "src\\AllList.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[0] = list[i].name;
    	child_ctx[1] = list[i].version;
    	child_ctx[2] = list[i].check_date;
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (11:4) {#each data_all as { name, version, check_date }
    function create_each_block(ctx) {
    	let tr;
    	let th0;
    	let t0_value = /*name*/ ctx[0] + "";
    	let t0;
    	let th1;
    	let t1_value = /*version*/ ctx[1] + "";
    	let t1;
    	let th2;
    	let t2_value = /*check_date*/ ctx[2] + "";
    	let t2;

    	const block = {
    		c: function create() {
    			tr = element("tr");
    			th0 = element("th");
    			t0 = text(t0_value);
    			th1 = element("th");
    			t1 = text(t1_value);
    			th2 = element("th");
    			t2 = text(t2_value);
    			attr_dev(th0, "class", "svelte-bd3bxu");
    			add_location(th0, file$1, 11, 10, 262);
    			attr_dev(th1, "class", "svelte-bd3bxu");
    			add_location(th1, file$1, 11, 25, 277);
    			attr_dev(th2, "class", "svelte-bd3bxu");
    			add_location(th2, file$1, 11, 43, 295);
    			attr_dev(tr, "class", "svelte-bd3bxu");
    			add_location(tr, file$1, 11, 6, 258);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);
    			append_dev(tr, th0);
    			append_dev(th0, t0);
    			append_dev(tr, th1);
    			append_dev(th1, t1);
    			append_dev(tr, th2);
    			append_dev(th2, t2);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(11:4) {#each data_all as { name, version, check_date }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let h3;
    	let t1;
    	let table;
    	let thead;
    	let tr;
    	let th0;
    	let th1;
    	let th2;
    	let t5;
    	let tbody;
    	let each_value = data_all;
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			h3.textContent = "All Patch List";
    			t1 = space();
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");
    			th0 = element("th");
    			th0.textContent = "Name";
    			th1 = element("th");
    			th1.textContent = "Version";
    			th2 = element("th");
    			th2.textContent = "Date";
    			t5 = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(h3, file$1, 4, 0, 60);
    			attr_dev(th0, "class", "svelte-bd3bxu");
    			add_location(th0, file$1, 7, 8, 126);
    			attr_dev(th1, "class", "svelte-bd3bxu");
    			add_location(th1, file$1, 7, 21, 139);
    			attr_dev(th2, "class", "svelte-bd3bxu");
    			add_location(th2, file$1, 7, 37, 155);
    			attr_dev(tr, "class", "svelte-bd3bxu");
    			add_location(tr, file$1, 7, 4, 122);
    			add_location(thead, file$1, 6, 2, 110);
    			add_location(tbody, file$1, 9, 2, 187);
    			attr_dev(table, "class", "s-table svelte-bd3bxu");
    			add_location(table, file$1, 5, 0, 84);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, table, anchor);
    			append_dev(table, thead);
    			append_dev(thead, tr);
    			append_dev(tr, th0);
    			append_dev(tr, th1);
    			append_dev(tr, th2);
    			append_dev(table, t5);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*data_all*/ 0) {
    				each_value = data_all;
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(tbody, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(table);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('AllList', slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<AllList> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ data_all });
    	return [];
    }

    class AllList extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "AllList",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.46.4 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let title_value;
    	let meta;
    	let html;
    	let t0;
    	let body;
    	let main;
    	let h1;
    	let t1;
    	let t2;
    	let alllist;
    	let t3;
    	let t4;
    	let footer;
    	let div;
    	let span;
    	let t5;
    	let t6;
    	let t7;
    	let a;
    	let t9;
    	let current;
    	document.title = title_value = /*AppName*/ ctx[0];
    	alllist = new AllList({ $$inline: true });

    	const block = {
    		c: function create() {
    			meta = element("meta");
    			html = element("html");
    			t0 = space();
    			body = element("body");
    			main = element("main");
    			h1 = element("h1");
    			t1 = text(/*AppName*/ ctx[0]);
    			t2 = space();
    			create_component(alllist.$$.fragment);
    			t3 = text("\n     ");
    			t4 = space();
    			footer = element("footer");
    			div = element("div");
    			span = element("span");
    			t5 = text("Last update: ");
    			t6 = text(/*DateTime*/ ctx[1]);
    			t7 = text(" | Dev: ");
    			a = element("a");
    			a.textContent = "jdcajera@gmail.com";
    			t9 = text(" | Uses: Azure Static Web App, Azure DB Cosmos, Azure Web Function, GitHub, Python, Svelte, HTML, CSS");
    			attr_dev(meta, "name", "robots");
    			attr_dev(meta, "content", "noindex nofollow");
    			add_location(meta, file, 9, 2, 204);
    			attr_dev(html, "lang", "en");
    			add_location(html, file, 10, 2, 256);
    			attr_dev(h1, "class", "svelte-cvwxen");
    			add_location(h1, file, 15, 4, 311);
    			attr_dev(main, "class", "svelte-cvwxen");
    			add_location(main, file, 14, 2, 300);
    			attr_dev(body, "class", "svelte-cvwxen");
    			add_location(body, file, 13, 0, 291);
    			attr_dev(a, "href", "mailto:jdcajera@gmail.com");
    			attr_dev(a, "class", "svelte-cvwxen");
    			add_location(a, file, 23, 33, 469);
    			attr_dev(span, "class", "svelte-cvwxen");
    			add_location(span, file, 22, 4, 429);
    			attr_dev(div, "class", "copyright svelte-cvwxen");
    			add_location(div, file, 21, 2, 401);
    			attr_dev(footer, "class", "footer svelte-cvwxen");
    			add_location(footer, file, 20, 0, 375);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, meta);
    			append_dev(document.head, html);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, body, anchor);
    			append_dev(body, main);
    			append_dev(main, h1);
    			append_dev(h1, t1);
    			append_dev(main, t2);
    			mount_component(alllist, main, null);
    			append_dev(main, t3);
    			insert_dev(target, t4, anchor);
    			insert_dev(target, footer, anchor);
    			append_dev(footer, div);
    			append_dev(div, span);
    			append_dev(span, t5);
    			append_dev(span, t6);
    			append_dev(span, t7);
    			append_dev(span, a);
    			append_dev(span, t9);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if ((!current || dirty & /*AppName*/ 1) && title_value !== (title_value = /*AppName*/ ctx[0])) {
    				document.title = title_value;
    			}

    			if (!current || dirty & /*AppName*/ 1) set_data_dev(t1, /*AppName*/ ctx[0]);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(alllist.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(alllist.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(meta);
    			detach_dev(html);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(body);
    			destroy_component(alllist);
    			if (detaching) detach_dev(t4);
    			if (detaching) detach_dev(footer);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);
    	let { AppName } = $$props;
    	let DateTime = new Date().toISOString().substr(0, 19).replace('T', ' ');
    	const writable_props = ['AppName'];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ('AppName' in $$props) $$invalidate(0, AppName = $$props.AppName);
    	};

    	$$self.$capture_state = () => ({ AppName, AllList, DateTime });

    	$$self.$inject_state = $$props => {
    		if ('AppName' in $$props) $$invalidate(0, AppName = $$props.AppName);
    		if ('DateTime' in $$props) $$invalidate(1, DateTime = $$props.DateTime);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [AppName, DateTime];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { AppName: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*AppName*/ ctx[0] === undefined && !('AppName' in props)) {
    			console.warn("<App> was created without expected prop 'AppName'");
    		}
    	}

    	get AppName() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set AppName(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {
    		AppName: 'Patch Monitor'
    	}
    });

    return app;

})();
//# sourceMappingURL=bundle.js.map
