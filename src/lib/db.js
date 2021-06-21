const ApiDB = (function() {
    function getStorage(key) {
        let value =  window.localStorage.getItem(key)
        return JSON.parse(value);
    }
    function setStorage(key, value) {
        window.localStorage.setItem(key, JSON.stringify(value))
    }

    return {
        getStorage,
        setStorage
    }
})()

export default ApiDB;