module.exports = {
  "parser": "babel-eslint",
    "env": {
        "commonjs": true,
        "es6": true,
        "node": true
    },
    "extends": "eslint:recommended",
    "rules": {
        "linebreak-style": "off",
        "no-console":[
            "error",{
            "allow":["warn","error","info"]
            }
        ],
        "indent": [
            "error",
            2
        ],
        "quotes": [
            "error",
            "single"
        ],
        "semi": [
            "error",
            "always"
        ]
    },
    "parserOptions": {
        "ecmaVersion": 6,
        "sourceType": "script"
    },
    "globals":{
        window:true
    }
};