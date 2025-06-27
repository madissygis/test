const log = msg => document.getElementById('log').textContent += `\n${msg}`;

function foo(a,b,c) {
    let x = a | 0;
    let y = b | 0;
    let z = c & 15;
    z = (x << y) ^ (x << (y & 0x10ff));
    let r = z ^ 0xf01;
    let s = z ^ 0xf1f;
    return (((a >>> r) << s) >> s);
}

function makeTrapObject(id) {
    return {
        marker: 0x1337,
        id: id,
        dummy: 0xdeadbeef
    };
}

function detectCorruption(obj) {
    if (obj.marker !== 0x1337) {
        log(`[!!!] Marker corrupted! id=${obj.id}, marker=${obj.marker}`);
        return true;
    }
    if (obj.dummy !== 0xdeadbeef) {
        log(`[!!!] Dummy corrupted! id=${obj.id}, dummy=${obj.dummy}`);
        return true;
    }
    return false;
}

function runTest() {
    log("[+] Running trap test with trap objects...");

    let LEN = 1000; // For safety, keep low for now
    let trapObjects = [];

    for (let i = 0; i < LEN; i++) {
        trapObjects.push(makeTrapObject(i));
    }

    try {
        for (let i = 0; i < LEN; i++) {
            let res = foo((i & 127), 456, 789);
            if (res !== -1) {
                log(`[!] Logic mismatch at i=${i}, result=${res}`);
            }

            if (detectCorruption(trapObjects[i])) {
                log(`[!!!] Possible memory corruption detected at i=${i}`);
                break;
            }
        }
    } catch (e) {
        log(`[!!] Exception during test: ${e}`);
    }

    log("[+] Trap test completed.");
}

window.onload = runTest;
