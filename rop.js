// rop.js

class RopChain {
    constructor(stackBaseAddr) {
        this.stack = [];
        this.stackBase = stackBaseAddr || 0;
        this.stackTop = this.stackBase;
    }

    // Push a 64-bit value onto the ROP stack
    push(val) {
        if (typeof val === "bigint") {
            this.stack.push(val);
        } else {
            this.stack.push(BigInt(val));
        }
        this.stackTop += 8;
    }

    // Push a gadget address from gadgets.js
    pushGadget(name) {
        const addr = RopGadgetResolver.resolve(name);
        if (addr === undefined) {
            throw new Error("Gadget not found: " + name);
        }
        this.push(addr);
    }

    // Write the final ROP chain to memory using a write primitive
    writeToMemory(write64, addr) {
        for (let i = 0; i < this.stack.length; i++) {
            write64(addr + BigInt(i * 8), this.stack[i]);
        }
    }

    // Debug print
    dump() {
        console.log("ROP Chain:");
        for (let i = 0; i < this.stack.length; i++) {
            console.log(`  [${i}] = 0x${this.stack[i].toString(16)}`);
        }
    }
}

// Export for use in other modules
window.RopChain = RopChain;