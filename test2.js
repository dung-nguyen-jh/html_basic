const GetSecret = (secret) => {
    return {
        get: () => secret
    };
}

const getSecret = GetSecret(10)
console.log(getSecret.get()) // 10