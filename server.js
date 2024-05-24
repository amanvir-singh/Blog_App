require('dotenv').config();
const port = process.env.EXPRESS_PORT ?? 3001;
const app = require('./src/app')


app.listen(port, () => {
    console.log(`app running at http://localhost:${port}`);
});
