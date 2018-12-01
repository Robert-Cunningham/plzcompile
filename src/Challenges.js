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
    functionName: "fib"
}

const challenges = [fib]

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
            return {"passed": false, "message": `Failed on test case ${challenge.tests[i].input}.`}
        }
    }

    return {"passed": true}

}


export {challenges, judgeSubmission}