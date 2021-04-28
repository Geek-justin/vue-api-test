const ApiDB = (function() {

    function getStorage(key) {
        let value =  window.localStorage.getItem(key)
        console.log(`get ${key}: ${value}`)
        return JSON.parse(value);
    }
    function setStorage(key, value) {
        console.log(`set ${key}`)
        window.localStorage.setItem(key, JSON.stringify(value))
    }

    return {
        getStorage,
        setStorage
    }
})()