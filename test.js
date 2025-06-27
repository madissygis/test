const logEl = document.getElementById("log");
function log(msg) {
    logEl.textContent += msg + "\n";
}

function foo(a,b,c) {
    let x = a | 0;
    let y = b | 0;
    let z = c & 15;
    z = (x << y) ^ (x << (y & 0x10ff));
    let r = z ^ 0xf01;
    let s = z ^ 0xf1f;
    let result = (((a >>> r) << s) >> s);
    return result;
}

function runTest() {
    const LEN = 100000000 - 1;
    let res = foo((LEN & 127), 456, 789);
    log("Initial test result: " + res);

    if (res !== -1) {
        log("Error: Expected -1, got " + res);
    }

    for (let i = 0; i <= 256; i++) {
        let a = (i & 127);
        let y = 456;
        let z = 789 & 15;
        z = (a << y) ^ (a << (y & 0x10ff));
        let r = z ^ 0xf01;
        let s = z ^ 0xf1f;
        let result = (((a >>> r) << s) >> s);

        if (result !== -1 && result !== 0) {
            log("Potential corruption at i=" + i + " a=" + a + " y=" + y + " result=" + result);
        }
    }

    log("Test complete.");
}

window.onload = runTest;
