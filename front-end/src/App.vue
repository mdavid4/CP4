<template>
<div id="app">
    <div class="header">
        <router-link to="/">
            <div class="title">
                <h1>Pizzaria</h1>
            </div>
        </router-link>
    </div>
    <div class="content">
        <router-view />
    </div>
    <div class="footer">
        <router-link to="/admin">Pizzaiolo's Page</router-link>
        <a href="https://github.com/mdavid4/CP4">This project's Github</a>
    </div>
</div>
</template>

<style>
html {
    box-sizing: border-box;
}

body {
    font-family: 'Montserrat', sans-serif;
    font-size: 16px;
    background: #fff;
    padding: 0px;
    margin: 0px;
}

/* Header */
.header {
    display: flex;
    padding: 10px 100px 0px 100px;
    background-color: #905000;
    color: #FFFFFF;
}

a:link,
a:visited {
    color: #fff;
    text-decoration: none;
}

a:hover,
a:active {
    color: #f80;
    text-decoration: none;
}

.title {
    margin-top: 5px;
}

.title h1 {
    font-size: 30px;
}

.content {
    padding: 20px 100px;
    min-height: 500px;
}

/* Footer */
.footer {
    display: flex;
    justify-content: space-between;
    background-color: #905000;
    padding: 2px 0.5em;
    bottom: 0px;
    position: fixed;
    width: 100%;
    height: 2em;
}

.page {
    position: relative;
    min-height: 100vh;
    padding-bottom: 2.5em;
}

.footer a,
.footer p {
    margin-top: 0.5em;
    margin-left: 2em;
    margin-right: 2em;
}

h1 {
    font-size: 20px;
}

h2 {
    font-size: 14px;
}
</style>
