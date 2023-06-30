export default {
    // Define `base` because this deploys to user.github.io/repo-name/
    base: './',
    publicDir: './public',
    build: {
        // Do not inline images and assets to avoid the phaser error
        // "Local data URIs are not supported"
        assetsInlineLimit: 0
    },
}