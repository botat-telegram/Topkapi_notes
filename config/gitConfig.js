require("dotenv").config();

module.exports = {
    GitEmail : process.env.GIT_EMAIL,
    GitUserName : process.env.GIT_USERNAME,
    GitToken : process.env.GITHUB_TOKEN,
    GitDepoUrl : process.env.GITHUB_REPO_URL
}