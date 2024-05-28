//require('dotenv').config();
const port = 8800;
const app = require('./app');



// Set Server to Listen
app.listen(port, () => {
    console.log(`app running at http://localhost:${port}`);
});
