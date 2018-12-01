const fib = {
    instructions: "Your function should return the nth fibonacci number.",
    examples: 3,
    tests: [
        {"input": 0, "output": 1},
        {"input": 1, "output": 1},
        {"input": 2, "output": 2},
        {"input": 3, "output": 3},
        {"input": 10, "output": 89},
        //{"input": "20", "output": "10946"},
    ],
    initial: "const fibonacci = (n) => {\n\n}",
    functionName: "fibonacci"
}

const factorial = {
    instructions: "Return the factorial of N.",
    examples: 2,
    tests: [
        {"input": 3, "output": 6},
        {"input": 4, "output": 24},
        {"input": 10, "output": 3628800},
        {"input": 1, "output": 1},
        //{"input": "20", "output": "10946"},
    ],
    initial: "const factorial = (n) => {\n\n}",
    functionName: "factorial"
}

// const fib = (n) => (n == 0 || n ==1 ? 1 : fib(n-1)+fib(n-2))

const challenges = [fib, factorial]

let leadingComment = (challenge) => {
    return "// " + challenge.instructions + "\n// Examples:\n" + challenge.tests.splice(0, challenge.examples).map( e => 
        "// " + challenge.functionName + "(" + e.input + ") => " + e.output
        ).join("\n") + "\n\n"
}

/*


--------------

function fib(n) {
    //{instructions here}

    //examples here

}

--------------


*/

const wrapSubmission = (program, challenge) => {
return `function go() {
${program}

//----auto generated-----

let tests = ${JSON.stringify(challenge.tests)}

return tests.map(t => ${challenge.functionName}(t.input))
}

go()
`
}

const judgeSubmission = (program, challenge) => {
    let output
    program = wrapSubmission(program, challenge)
    try {
        output = eval(program)
    } catch (e) {
        console.log(e)
        return {"passed": false, "message": `Exception. ${e}`}
    }

    for (let i = 0; i < challenge.tests.length; i++) {
        if (JSON.stringify(output[i]) !== JSON.stringify(challenge.tests[i].output)) {
            return {"passed": false, "message": `Failed on test case ${challenge.tests[i].input}. Expected ${challenge.tests[i].output}, but got ${output[i]}!`}
        }
    }

    return {"passed": true}

}


export {challenges, judgeSubmission, leadingComment}