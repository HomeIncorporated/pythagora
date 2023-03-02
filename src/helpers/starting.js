const path = require('path');
const fs = require('fs');

function checkDependencies() {
    const searchPath = process.cwd();
    let mongodb, express;

    const findPackageJson = (dir) => {
        if (mongodb && express) return;
        const files = fs.readdirSync(dir);

        files.forEach(file => {
            if (mongodb && express) return;
            const filePath = path.resolve(dir, file);
            const fileStat = fs.statSync(filePath);

            if (fileStat.isDirectory() && file[0] !== '.' && file !== 'node_modules') {
                findPackageJson(filePath);
            } else if (file === "package.json") {
                const dependencies = JSON.parse(
                    fs.readFileSync(filePath, "utf-8")
                ).dependencies;

                if(dependencies.mongodb) mongodb = true;
                if(dependencies.express) express = true;
                if(dependencies.pythagora) global.PythagoraVersion = dependencies.pythagora;
            }
        });
    };

    findPackageJson(searchPath);

    if (!express) {
        throw new Error('Pythagora is unable to check dependencies. Continuing and hoping you\'re Express and Mongo...')
    }
}

module.exports = {
    checkDependencies
}
