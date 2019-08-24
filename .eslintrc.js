module.exports = {
    "env": {
        "es6": true,
        "node": true
    },
    parser: "babel-eslint",
    "extends": "eslint:recommended",
    "parserOptions": {
        "ecmaVersion": 2017
    },
    "globals": {},
    "rules": {
        "indent": [
            "error",
            2
        ],
        "linebreak-style": [
            "error",
            "unix"
        ],
        "quotes": [
            "error",
            "single",
            { "allowTemplateLiterals": true }
        ],
        "semi": [
            "warn",
            "never"
        ],
        "require-atomic-updates": 0,
        "no-unused-vars": 1
    }
};