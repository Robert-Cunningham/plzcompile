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

const palindrome = {
    instructions: "Return a boolean indicating whether the given string is a palindrome",
    example: 2,
    tests: [
        {input: 'abcba', output: true},
        {input: 'word', output: false},
        {input: 'hannah', output: true},
        {input: 'abcdabca', output: false},
    ],
    initial: "const palindrome = (str) => {\n\n}",
    functionName: 'palindrome'
}

const longestIncreasingSubsequence = {
    instructions: "Return the longest increasing subsequence from the given list.",
    examples: 2,
    tests: [
        {input: [4, 2, 6, 1, 3, 6, 2], output: [1, 3, 6]},
        {input: [4, 1, 2, 4, 6, 3, 9], output: [1, 2, 3, 6]},
        {input: [2, 3, 4, 1, 4, 5, 6, 7, 2], output: [1, 4, 5, 6, 7]},
        {input: [2, 3, 4, 1, 4, 5, 6, 7], output: [1, 4, 5, 6, 7]}
    ],
    initial: "liss = (seq) => {\n\n}",
    functionName: 'liss'
}

const nthPrime = {
    instructions: "Return the Nth prime number.",
    examples: 2,
    tests: [
        {input: 1, output: 2},
        {input: 3, output: 5},
        {input: 4, output: 7},
        {input: 100, output: 541}
    ],
    initial: "nthPrime = (n) => {\n\n}",
    functionName: 'nthPrime'
}

const isPerfect = {
    instructions: "Determine if a given number is perfect (the sum of its factors). For example, 6 = 1 + 2 + 3."
}

const biggestPowerOfTwo = {
    instructions: "Find the biggest power of two less or equal to a given number.",
    examples: 2,
    tests: [
        {input: 5, output: 8},
        {input: 128, output: 128},
        {input: 1021, output: 1024},
        {input: 3, output: 4}
    ],
    initial: "biggestPowerOfTwo = (n) => {\n\n}",
    functionName: "biggestPowerOfTwo"
}


// const fib = (n) => (n == 0 || n ==1 ? 1 : fib(n-1)+fib(n-2))

const challenges = [fib, factorial, palindrome, longestIncreasingSubsequence, nthPrime, biggestPowerOfTwo]

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
            return {"passed": false, "message": `Failed on test case with input ${challenge.tests[i].input}. Expected ${challenge.tests[i].output}, but got ${output[i]}!`}
        }
    }

    return {"passed": true}

}


export {challenges, judgeSubmission, leadingComment}